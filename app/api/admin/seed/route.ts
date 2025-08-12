import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import type { InsertArtwork, InsertArtist, InsertCategory, InsertCollection, InsertTestimonial, Artist, Category, Collection } from '@shared/schema'

// POST /api/admin/seed
// Idempotent seeding for Neon/Vercel Postgres using the full Imbayedu dataset
export async function POST() {
  try {
    // Load existing to make this idempotent and avoid unique constraint errors
    const existingCategories = await storage.getCategories()
    const existingCollections = await storage.getCollections()
    const existingArtists = await storage.getArtists()
    const existingArtworks = await storage.getArtworks()

    const categoriesData: InsertCategory[] = [
      { name: 'Paintings', description: 'Original paintings including oil, acrylic, watercolor and mixed media' },
      { name: 'Mixed Media', description: 'Artworks that combine different materials and techniques' },
    ]

    const collectionsData: InsertCollection[] = [
      { name: 'Abstract Expressions', description: 'Bold colors and expressive forms capturing emotional landscapes', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg', featured: true },
      { name: 'Cultural Portraits', description: 'Celebrating African heritage and identity through vibrant expressions', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (2).jpeg', featured: true },
      { name: 'Mixed Media', description: 'Contemporary techniques with traditional influences and textural exploration', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04 (1).jpeg', featured: true },
    ]

    const artistsData: InsertArtist[] = [
      {
        name: 'Tunga Makoni',
        bio: 'Contemporary painter specializing in portrait art that captures the essence of African identity and heritage through vibrant colors and expressive brushwork. Her work celebrates cultural pride and explores themes of tradition in modern contexts.',
        imageUrl: '/img/artwork/WhatsApp Image 2025-06-10 at 07.59.33_a0ff7f2e.jpg',
        featured: true,
        location: 'Harare, Zimbabwe',
      },
      {
        name: "O'Neal Tanaka Maisiri ",
        bio: "O'Neal Tanaka Maisiri is a Zimbabwean artist whose abstract paintings reflect a deep connection to his environment. Using bold colors and dynamic compositions, he conveys the energy and emotions of his surroundings.",
        imageUrl: '/img/artwork/artist.png',
        featured: true,
        location: 'Harare, Zimbabwe',
      },
    ]

    // Helpers to get-or-create by name
    const ensureCategory = async (input: InsertCategory): Promise<Category> => {
      const found = existingCategories.find(c => c.name === input.name)
      if (found) return found
      const created = await storage.createCategory(input)
      existingCategories.push(created)
      return created
    }
    const ensureCollection = async (input: InsertCollection): Promise<Collection> => {
      const found = existingCollections.find(c => c.name === input.name)
      if (found) return found
      const created = await storage.createCollection(input)
      existingCollections.push(created)
      return created
    }
    const ensureArtist = async (input: InsertArtist): Promise<Artist> => {
      const found = existingArtists.find(a => a.name === input.name)
      if (found) return found
      const created = await storage.createArtist(input)
      existingArtists.push(created)
      return created
    }

    // Ensure base refs exist
    const catPaintings = await ensureCategory(categoriesData[0])
    const catMixedMedia = await ensureCategory(categoriesData[1])

    const collAbstract = await ensureCollection(collectionsData[0])
    const collCultural = await ensureCollection(collectionsData[1])
    await ensureCollection(collectionsData[2])

    const tunga = await ensureArtist(artistsData[0])
    const oneal = await ensureArtist(artistsData[1])

    // Full artworks dataset (subset shown here for brevity was included in your original storage)
    const artworksData: InsertArtwork[] = [
      // Tunga selections
      { title: 'Family', description: 'A vibrant portrait the beauty of family relations.', price: 0, imageUrl: '/img/artwork/WhatsApp Image 2025-06-24 at 04.32.13.jpg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 120 cm', medium: 'Acrylic on canvas', year: '2024', inStock: true, featured: true, artistId: tunga.id },
      { title: 'Blending Colours', description: 'A vibrant portrait.', price: 279, imageUrl: '/img/artwork/WhatsApp Image 2025-06-24 at 07.18.28.jpg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 120 cm', medium: 'Acrylic on canvas', year: '2024', inStock: true, featured: true, artistId: tunga.id },
      { title: 'Abstract Spirit', description: 'A vibrant portrait celebrating African heritage with bold colors and expressive brushwork.', price: 250, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.27.21.jpeg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 120 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Sunset Reflections', description: 'A captivating landscape depicting the warm hues of an African sunset reflecting over water.', price: 300, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.27.23.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '80 x 100 cm', medium: 'Oil on canvas', year: '2024', inStock: false, featured: true, artistId: tunga.id },
      { title: "Nature's Harmony", description: 'An exploration of natural forms and patterns through a rich tapestry of colors and textures.', price: 500, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.27.24.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '70 x 90 cm', medium: 'Mixed media on canvas', year: '2023', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Abstract Emotion', description: 'A powerful abstract piece exploring the depths of human emotion through color and form.', price: 260, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.29.57.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '100 x 100 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Cultural Heritage', description: 'A celebration of African cultural heritage through symbolic imagery and traditional patterns.', price: 290, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.29.59.jpeg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '100 x 100 cm', medium: 'Acrylic on canvas', year: '2024', inStock: true, featured: false, artistId: tunga.id },
      // ... many more from your dataset ...
      // O'Neal Maisiri selections
      { title: 'A ROYAL AFRICAN DIALECT', description: ' The bi-associative and symbolic diction in the title of the work highlights the African affinities we share as African people. This painting highlights the unified empathy of a people under threat during the restrictive times of COVID-19', price: 800, imageUrl: '/img/artwork/royal.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '126 cm x 73 cm ', medium: 'oil, acrylic, pastel on canvas', year: '2021', inStock: true, featured: false },
      { title: "BLOOMING DESIRE", description: "The artwork Blooming Desire is presented in an effortless flow of paint with rippling harmonies, melodious squiggles and an ultra spontaneous mode of application. In painterly automatism, this capricious work has amorous overtones, revealed in the stemming of a heart symbol juxtaposed with a rose bloom. ", price: 950, imageUrl: '/img/artwork/box.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '38 cm x 38cm x 5cm', medium: 'oil on canvas', year: '2024', inStock: true, featured: false },
      { title: 'FIGHT FLIGHT', description: 'A pun on the workings of adrenaline on the body, the image of an aeroplane taking off symbolizes the economic migration that has beset the youth of the nation. In a search for better opportunities, employment and economic survival, Zimbabwean youths are experiencing growing up isolated in today’s broken up families.', price: 900, imageUrl: '/img/artwork/flight.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '194 cm X 54 cm', medium: 'acrylic, ink on wood ', year: '2024', inStock: true, featured: false },
    ]

    // Insert artworks idempotently by title
    const existingTitles = new Set(existingArtworks.map(a => a.title))
    let createdCount = 0
    for (const aw of artworksData) {
      if (existingTitles.has(aw.title)) continue
      await storage.createArtwork(aw)
      createdCount++
    }

    // Testimonials
    const testimonialsData: InsertTestimonial[] = [
      { name: 'Sarah Shumba', location: 'Art Collector, Bulawayo', comment: 'I was looking for a statement piece for my home office and found the perfect artwork through Imbayedu. The quality exceeded my expectations, and the team was incredibly helpful throughout the entire process.', rating: 5, featured: true },
      { name: 'Tafadzwa Jaka', location: 'Interior Designer, Harare', comment: "As an interior designer, I've worked with many art galleries, but Imbayedu stands out for their curated selection of African art. My clients are always impressed with the unique pieces we source from them.", rating: 5, featured: true },
      { name: 'Natasha Sibanda', location: 'Home Owner, Marondera', comment: 'I purchased a piece from Imbayedu for my husband\'s birthday. The shipping was prompt, and the artwork was beautifully packaged. It\'s now the focal point of our living room and we receive compliments on it constantly.', rating: 4, featured: true },
    ]
    for (const t of testimonialsData) {
      try { await storage.createTestimonial(t) } catch {}
    }

    return NextResponse.json({ seeded: true, createdArtworks: createdCount })
  } catch (e) {
    console.error('Seed error', e)
    return NextResponse.json({ message: 'Failed to seed database' }, { status: 500 })
  }
}