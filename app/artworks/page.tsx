import type { Metadata } from 'next'
import { Suspense } from 'react'
import Artworks from '@/components/pages/Artworks'

export const metadata: Metadata = {
  title: 'Artworks | Imbayedu Art Collective',
  description: 'Browse our curated collection of contemporary African artworks including paintings, sculptures, photography, and mixed media.',
}

export const dynamic = 'force-dynamic'

export default function ArtworksPage() {
  return (
    <Suspense fallback={<div className="pt-24 md:pt-32" />}> 
      <Artworks />
    </Suspense>
  )
}