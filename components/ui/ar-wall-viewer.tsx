"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Slider } from './slider'

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace('#','')
  const bigint = parseInt(m.length === 3 ? m.split('').map(c=>c+c).join('') : m, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * ARWallViewer: 2D AR overlay for wall preview with:
 * - Pinch-zoom (mobile) and wheel zoom (desktop)
 * - Distance calibration using an A4 sheet (21x29.7cm)
 * - Room-light aware shadow (auto) + manual strength
 * - Wall color picker for quick paint match preview
 * - Persists last chosen width per artwork (localStorage)
 */
type FrameStyle = 'none' | 'thin-black' | 'thin-white' | 'oak-wood' | 'gold'

export function ARWallViewer({
  open,
  onOpenChange,
  imageUrl,
  initialWidthCm = 60,
  aspectRatio = 0.75,
  artworkId,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  imageUrl: string
  initialWidthCm?: number
  aspectRatio?: number
  artworkId?: string | number
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [bgImage, setBgImage] = useState<string | null>(null)

  // Artwork transform state
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1) // pinch/wheel zoom
  const [rotationDeg, setRotationDeg] = useState(0) // rotation control
  const [widthCm, setWidthCm] = useState(initialWidthCm)

  // Calibration: cm to px mapping. If not calibrated, use a fallback.
  const [pxPerCm, setPxPerCm] = useState<number>(3) // fallback ~3px per cm
  const [calibrate, setCalibrate] = useState(false)
  const [a4Portrait, setA4Portrait] = useState(true) // true => 21x29.7, false => 29.7x21
  const [calibWidthPx, setCalibWidthPx] = useState(100)

  // Shadow and wall color
  const [autoShadow, setAutoShadow] = useState(true)
  const [shadowStrength, setShadowStrength] = useState(0.5) // 0..1, used if autoShadow=false
  const [wallColor, setWallColor] = useState('#ffffff')
  const [wallOpacity, setWallOpacity] = useState(0)

  // Frame state
  const [frame, setFrame] = useState<FrameStyle>('none')

  // Local persistence for width per artwork
  useEffect(() => {
    if (!open || !artworkId) return
    const saved = localStorage.getItem(`arWidthCm:${artworkId}`)
    if (saved) {
      const v = Number(saved)
      if (Number.isFinite(v) && v > 0) setWidthCm(v)
    }
  }, [open, artworkId])
  useEffect(() => {
    if (!artworkId) return
    localStorage.setItem(`arWidthCm:${artworkId}`, String(widthCm))
  }, [widthCm, artworkId])

  // Try to start camera when opened
  useEffect(() => {
    let stream: MediaStream | null = null
    const start = async () => {
      setStreamError(null)
      if (!open) return
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            await videoRef.current.play().catch(()=>{})
          }
        } else {
          setStreamError('Camera not supported.')
        }
      } catch (e: any) {
        setStreamError(e?.message || 'Camera access denied. You can upload a room photo instead.')
      }
    }
    start()
    return () => {
      if (stream) for (const track of stream.getTracks?.() || []) track.stop()
    }
  }, [open])

  // Auto shadow sampling from video brightness
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    let handle: number | null = null
    function sample() {
      if (!open || !autoShadow) return
      const video = videoRef.current
      const canvas = sampleCanvasRef.current
      if (!video || !canvas) return
      const w = 48, h = 27
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      try {
        ctx.drawImage(video, 0, 0, w, h)
        const img = ctx.getImageData(0, 0, w, h)
        let sum = 0
        for (let i = 0; i < img.data.length; i += 4) {
          const r = img.data[i]
          const g = img.data[i+1]
          const b = img.data[i+2]
          // luminance approximation
          sum += 0.2126*r + 0.7152*g + 0.0722*b
        }
        const avg = sum / (w*h)
        // Map brightness 0..255 to shadow alpha 0.7..0.3 (darker room => stronger shadow)
        const alpha = 0.7 - (avg/255) * 0.4
        setShadowStrength(Math.max(0.2, Math.min(0.8, alpha)))
      } catch {}
      handle = window.setTimeout(sample, 800)
    }
    if (open && autoShadow) sample()
    return () => { if (handle) clearTimeout(handle) }
  }, [open, autoShadow])

  function onBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setBgImage(url)
  }

  // Pinch-zoom & pan handling
  type Ptr = { id: number; x: number; y: number }
  const pointers = useRef<Map<number, Ptr>>(new Map())
  const pinchStart = useRef<{ dist: number; zoom: number; center: { x: number; y: number } } | null>(null)
  // If calibrating, pinch scales calibWidthPx; else scales zoom around pinch center
  function handlePointerDown(e: React.PointerEvent) {
    if (!containerRef.current) return
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values())
      const dx = pts[0].x - pts[1].x
      const dy = pts[0].y - pts[1].y
      const dist = Math.hypot(dx, dy)
      const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
      pinchStart.current = { dist, zoom, center }
    }
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY })
    const pts = Array.from(pointers.current.values())
    if (pts.length === 1 && !calibrate) {
      // pan
      setPos(p => ({ x: p.x + (e.movementX || 0), y: p.y + (e.movementY || 0) }))
    } else if (pts.length === 2) {
      const dx = pts[0].x - pts[1].x
      const dy = pts[0].y - pts[1].y
      const dist = Math.hypot(dx, dy)
      const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
      const start = pinchStart.current
      if (!start) return
      const ratio = dist / Math.max(1, start.dist)
      if (calibrate) {
        setCalibWidthPx(w => Math.max(20, Math.min(2000, w * ratio)))
        pinchStart.current = { dist, zoom: start.zoom, center }
      } else {
        // Zoom around pinch center—adjust position so the pinch center stays visually stable
        const newZoom = Math.max(0.1, Math.min(8, start.zoom * ratio))
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const cx = center.x - rect.left - rect.width / 2
          const cy = center.y - rect.top - rect.height / 2
          setPos(p => ({
            x: p.x + cx * (1 - start.zoom / newZoom),
            y: p.y + cy * (1 - start.zoom / newZoom),
          }))
        }
        setZoom(newZoom)
      }
    }
  }
  function handlePointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinchStart.current = null
  }
  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    const delta = -e.deltaY
    setZoom((s) => Math.max(0.1, Math.min(8, s * (1 + delta / 1000))))
  }

  // Derived overlay size
  const overlaySize = useMemo(() => {
    const widthPx = widthCm * pxPerCm * zoom
    const heightPx = widthPx * aspectRatio
    return { widthPx, heightPx }
  }, [widthCm, pxPerCm, zoom, aspectRatio])

  // Calibration commit
  function commitCalibration() {
    const a4WidthCm = a4Portrait ? 21 : 29.7
    const computed = calibWidthPx / a4WidthCm
    if (Number.isFinite(computed) && computed > 0.1) {
      setPxPerCm(computed)
    }
    setCalibrate(false)
  }

  function captureScreenshot(){
    // Render the stage DOM node to canvas using html2canvas-like approach with OffscreenCanvas constraints
    // For simplicity and no extra deps, we draw from video/bg and overlay manually into a canvas snapshot
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const w = Math.min(1280, Math.max(640, Math.floor(rect.width)))
    const h = Math.floor(w * rect.height / rect.width)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw background (video or uploaded)
    if (bgImage) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h)
        drawOverlay()
      }
      img.src = bgImage
    } else if (videoRef.current) {
      try {
        ctx.drawImage(videoRef.current, 0, 0, w, h)
      } catch {}
      drawOverlay()
    }

    const drawOverlay = () => {
      // Wall color rect
      if (wallOpacity > 0) {
        ctx.save()
        const ow = overlaySize.widthPx * (w/rect.width)
        const oh = overlaySize.heightPx * (h/rect.height)
        const ox = w/2 + pos.x * (w/rect.width) - ow/2
        const oy = h/2 + pos.y * (h/rect.height) - oh/2
        ctx.fillStyle = hexToRgba(wallColor, wallOpacity)
        ctx.fillRect(ox, oy, ow, oh)
        ctx.restore()
      }

      // Artwork with frame
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.save()
        const ow = overlaySize.widthPx * (w/rect.width)
        const oh = overlaySize.heightPx * (h/rect.height)
        const ox = w/2 + pos.x * (w/rect.width)
        const oy = h/2 + pos.y * (h/rect.height)
        ctx.translate(ox, oy)
        ctx.rotate(rotationDeg * Math.PI/180)
        // Frame drawing: approximate padding
        const framePad = frame === 'none' ? 0 : (frame.includes('thin') ? 6 : 14) * (w/rect.width)
        // background for wood/gold look
        if (frame === 'oak-wood') {
          ctx.fillStyle = '#8d6e63'
          ctx.fillRect(-ow/2 - framePad, -oh/2 - framePad, ow + framePad*2, oh + framePad*2)
        } else if (frame === 'gold') {
          ctx.fillStyle = '#caa65a'
          ctx.fillRect(-ow/2 - framePad, -oh/2 - framePad, ow + framePad*2, oh + framePad*2)
        } else if (frame === 'thin-black' || frame === 'thin-white') {
          ctx.strokeStyle = frame === 'thin-black' ? '#111' : '#eee'
          ctx.lineWidth = 2 * (w/rect.width)
          ctx.strokeRect(-ow/2 - framePad, -oh/2 - framePad, ow + framePad*2, oh + framePad*2)
        }
        // Artwork image
        ctx.drawImage(img, -ow/2, -oh/2, ow, oh)
        ctx.restore()

        canvas.toBlob((blob)=>{ if (blob) downloadBlob(blob, 'artwork-wall-preview.png') })
      }
      img.src = imageUrl
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px] w-full">
        <DialogHeader>
          <DialogTitle>View on Wall (AR)</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm text-neutral-700">Artwork width: {Math.round(widthCm)} cm</div>
            <div className="flex-1 min-w-[180px]">
              <Slider min={20} max={300} step={1} value={[widthCm]} onValueChange={(v)=> setWidthCm(v[0] || widthCm)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-700">Rotate</span>
              <div className="w-[160px]">
                <Slider min={-15} max={15} step={0.5} value={[rotationDeg]} onValueChange={(v)=> setRotationDeg(v[0] ?? rotationDeg)} />
              </div>
            </div>
            <label className="text-sm text-neutral-700 inline-flex items-center gap-2">
              <input type="file" accept="image/*" onChange={onBgUpload} />
              <span>Upload room photo</span>
            </label>
            <label className="text-sm text-neutral-700 inline-flex items-center gap-2">
              <input type="checkbox" checked={autoShadow} onChange={(e)=> setAutoShadow(e.target.checked)} />
              <span>Auto shadow</span>
            </label>
            {!autoShadow && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-700">Shadow</span>
                <div className="w-[140px]">
                  <Slider min={0} max={1} step={0.01} value={[shadowStrength]} onValueChange={(v)=> setShadowStrength(v[0] ?? shadowStrength)} />
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-700">Wall</span>
              <input type="color" value={wallColor} onChange={(e)=> setWallColor(e.target.value)} />
              <div className="w-[120px]">
                <Slider min={0} max={1} step={0.01} value={[wallOpacity]} onValueChange={(v)=> setWallOpacity(v[0] ?? wallOpacity)} />
              </div>
            </div>
            {!calibrate ? (
              <Button variant="outline" onClick={()=> setCalibrate(true)}>Calibrate (A4)</Button>
            ) : (
              <div className="inline-flex items-center gap-2">
                <Button variant="outline" onClick={commitCalibration}>Set calibration</Button>
                <Button variant="outline" onClick={()=> setCalibrate(false)}>Cancel</Button>
              </div>
            )}
          </div>

          {/* Stage */}
          <div
            ref={containerRef}
            className="relative w-full h-[70vh] bg-black rounded-md overflow-hidden touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={onWheel}
          >
            {/* Background */}
            {bgImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bgImage} alt="room" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover" />
            )}

            {/* Calibration overlay */}
            {calibrate && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-emerald-400/80 bg-emerald-400/10" style={{ width: calibWidthPx, height: calibWidthPx * (a4Portrait ? (29.7/21) : (21/29.7)) }} />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto bg-black/50 text-white rounded px-3 py-2 text-xs flex items-center gap-2">
                  <span>Match this to a real A4 in view. Pinch or use slider.</span>
                  <Button size="sm" variant="outline" onClick={()=> setA4Portrait(v=>!v)} className="h-7">{a4Portrait ? 'Portrait' : 'Landscape'}</Button>
                  <div className="w-[180px]">
                    <Slider min={40} max={1200} step={1} value={[calibWidthPx]} onValueChange={(v)=> setCalibWidthPx(v[0] || calibWidthPx)} />
                  </div>
                </div>
              </div>
            )}

            {/* Wall color rectangle behind artwork (optional) */}
            {wallOpacity > 0 && (
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${overlaySize.widthPx}px`,
                  height: `${overlaySize.heightPx}px`,
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                  backgroundColor: hexToRgba(wallColor, wallOpacity),
                  borderRadius: 2,
                }}
              />
            )}

            {/* Artwork overlay with optional frames */}
            <div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: `${overlaySize.widthPx}px`,
                height: `${overlaySize.heightPx}px`,
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${rotationDeg}deg)`,
                boxShadow: `0 20px 40px rgba(0,0,0,${shadowStrength})`,
              }}
            >
              {/* Frame selection */}
              <Frame imageUrl={imageUrl} frame={frame} />
            </div>

            {/* Helper grid */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
            </div>
          </div>

          {/* Hidden canvas for sampling */}
          <canvas ref={sampleCanvasRef} className="hidden" />

          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <FrameSelector value={frame} onChange={setFrame} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={captureScreenshot}>Screenshot</Button>
              <Button variant="outline" onClick={()=>{ setPos({x:0,y:0}); setZoom(1); setRotationDeg(0) }}>Reset</Button>
              <Button onClick={()=> onOpenChange(false)}>Close</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Frame({ imageUrl, frame = 'none' as FrameStyle }: { imageUrl: string; frame?: FrameStyle }) {
  // Different frame styles use borders or background images to simulate materials
  const border = frame === 'none' ? '0px' : frame.includes('thin') ? '6px' : '14px'
  const color = frame === 'thin-black' ? '#111' : frame === 'thin-white' ? '#eee' : frame === 'gold' ? '#b08d57' : '#8b5e34'
  const bgImage = frame === 'oak-wood' ? 'linear-gradient(45deg, #8d6e63, #a1887f)' : (frame === 'gold' ? 'linear-gradient(45deg, #b08d57, #f1d18a)' : 'none')
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <div style={{ width: '100%', height: '100%', background: bgImage, padding: border, boxSizing: 'border-box', border: frame.includes('thin') ? `1px solid ${color}` : `2px solid ${color}`, borderRadius: 2 }}>
      <img src={imageUrl} alt="artwork" className="w-full h-full object-cover block" />
    </div>
  )
}

function FrameSelector({ value = 'none' as FrameStyle, onChange }: { value?: FrameStyle; onChange?: (v: FrameStyle)=>void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-700">Frame</span>
      <select className="border rounded px-2 py-1 text-sm" value={value} onChange={(e)=> onChange?.(e.target.value as FrameStyle)}>
        <option value="none">None</option>
        <option value="thin-black">Thin Black</option>
        <option value="thin-white">Thin White</option>
        <option value="oak-wood">Oak Wood</option>
        <option value="gold">Gold</option>
      </select>
    </div>
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}