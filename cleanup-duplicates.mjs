#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import postgres from 'postgres'

// Minimal .env loader (no dotenv dependency)
function loadEnvFromDotenv(projectRoot) {
  const envPath = path.join(projectRoot, '.env')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

async function main() {
  const projectRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '.')
  loadEnvFromDotenv(projectRoot)

  const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED
  if (!DATABASE_URL) {
    console.error('❌ No database URL found in env (.env -> DATABASE_URL or POSTGRES_URL)')
    process.exit(1)
  }

  // Patterns (case-insensitive, wildcard-friendly) to match duplicate titles
  const patterns = [
    'sunset%reflec%',
    'sunset reflections%',
    'cultural heritage 2%',
    'cultural heritage 3%',
    'colour%absrac%', // misspelled "Colourful Absraction"
    'color%abstrac%', // covers "Colorful Abstraction"
    'abstract patterns%',
    'absract patterns%', // typo variant
    'unity in diversity%',
    'soulful potrait%', // typo
    'soulful portrait%', // correct spelling just in case
    'vibrant abstraction%',
    'expressionist landscape%'
  ]

  const sql = postgres(DATABASE_URL, { max: 1 })

  try {
    console.log('🔎 Previewing matches...')
    const whereFrag = patterns.reduce((frag, p) => (
      frag ? sql`${frag} OR title ILIKE ${p}` : sql`title ILIKE ${p}`
    ), null)

    const matches = await sql`
      SELECT id, title FROM artworks
      WHERE ${whereFrag}
      ORDER BY title ASC
    `
    if (matches.length === 0) {
      console.log('✅ No matching artworks found. Nothing to delete.')
      return
    }

    console.log('Found matches:')
    for (const row of matches) console.log(` - [${row.id}] ${row.title}`)

    const ids = matches.map(r => r.id)

    console.log('🗑️ Deleting related cart items...')
    const cartDel = await sql`
      DELETE FROM cart_items WHERE artwork_id IN ${sql(ids)} RETURNING id
    `

    console.log('🖼️ Deleting artworks...')
    const artDel = await sql`
      DELETE FROM artworks WHERE id IN ${sql(ids)} RETURNING id
    `

    console.log('✅ Cleanup complete:')
    console.log(`   Matched: ${matches.length}`)
    console.log(`   Deleted cart_items: ${cartDel.length}`)
    console.log(`   Deleted artworks: ${artDel.length}`)
  } catch (e) {
    console.error('❌ Cleanup failed:', e?.message || e)
    process.exitCode = 1
  } finally {
    await sql.end({ timeout: 1 })
  }
}

main()