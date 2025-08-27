#!/usr/bin/env node
import postgres from 'postgres'

const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED
if (!DATABASE_URL) {
  console.error('❌ No database URL found (DATABASE_URL/POSTGRES_URL)')
  process.exit(1)
}

// Desired targets from user; note: two exact files are missing in /public, so we use closest existing variants
const targets = [
  { name: 'Abstract Expressions', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (1).jpeg' }, // (2) not present; using (1)
  { name: 'Cultural Portraits', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg' },
  { name: 'Mixed Media', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (1).jpeg' }, // plain 02 not present; using (1)
]

async function main() {
  const sql = postgres(DATABASE_URL, { max: 1 })
  try {
    for (const t of targets) {
      const res = await sql`
        UPDATE collections
        SET image_url = ${t.imageUrl}, featured = true
        WHERE lower(name) = ${t.name.toLowerCase()}
        RETURNING id, name, image_url
      `
      if (res.length) {
        console.log(`✅ Updated: ${res[0].name} -> ${res[0].image_url}`)
      } else {
        console.log(`ℹ️ Not found: ${t.name}`)
      }
    }
  } catch (e) {
    console.error('❌ Update failed:', e?.message || e)
    process.exitCode = 1
  } finally {
    await sql.end({ timeout: 1 })
  }
}

main()