#!/usr/bin/env node
import postgres from 'postgres'

const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL_UNPOOLED
if (!DATABASE_URL) {
  console.error('❌ No database URL found (DATABASE_URL/POSTGRES_URL)')
  process.exit(1)
}

async function main() {
  const sql = postgres(DATABASE_URL, { max: 1 })
  try {
    const rows = await sql`SELECT id, title, artist_id FROM artworks WHERE title ILIKE 'family'`
    if (rows.length === 0) {
      console.log('ℹ️ No "Family" artwork found. Nothing to remove.')
      return
    }
    const ids = rows.map(r => r.id)
    console.log('Found:', rows.map(r => `[${r.id}] ${r.title}`).join(', '))

    await sql.begin(async (trx) => {
      const cartDel = await trx`DELETE FROM cart_items WHERE artwork_id IN ${trx(ids)} RETURNING id`
      const artDel = await trx`DELETE FROM artworks WHERE id IN ${trx(ids)} RETURNING id`
      console.log(`✅ Removed Family: deleted artworks=${artDel.length}, cart_items=${cartDel.length}`)
    })
  } catch (e) {
    console.error('❌ Removal failed:', e?.message || e)
    process.exitCode = 1
  } finally {
    await sql.end({ timeout: 1 })
  }
}

main()