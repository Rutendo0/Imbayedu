
import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import type { InsertArtist, InsertCategory, InsertCollection, InsertArtwork, InsertTestimonial } from '@shared/schema'

export async function POST() {
  try {
    // Categories
    const categoriesData: InsertCategory[] = [
      { name: 'Paintings', description: 'Original paintings including oil, acrylic, watercolor and mixed media' },
      { name: 'Mixed Media', description: 'Artworks that combine different materials and techniques' },
    ]

    let catPaintings, catMixedMedia
    try {
      catPaintings = await storage.createCategory(categoriesData[0])
      catMixedMedia = await storage.createCategory(categoriesData[1])
    } catch {
      // Categories might already exist, fetch them
      const categories = await storage.getCategories()
      catPaintings = categories.find(c => c.name === 'Paintings')!
      catMixedMedia = categories.find(c => c.name === 'Mixed Media')!
    }

    // Collections
    const collectionsData: InsertCollection[] = [
      { name: 'Abstract Expressions', description: 'Bold colors and expressive forms capturing emotional landscapes', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (2).jpeg', featured: true },
      { name: 'Cultural Portraits', description: 'Celebrating African heritage and identity through vibrant expressions', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03 (2).jpeg', featured: true },
      { name: 'Mixed Media', description: 'Contemporary techniques with traditional influences and textural exploration', imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg', featured: true },
    ]

    let collAbstract, collCultural, collMixed
    try {
      collAbstract = await storage.createCollection(collectionsData[0])
      collCultural = await storage.createCollection(collectionsData[1])
      collMixed = await storage.createCollection(collectionsData[2])
    } catch {
      // Collections might already exist, fetch them
      const collections = await storage.getCollections()
      collAbstract = collections.find(c => c.name === 'Abstract Expressions')!
      collCultural = collections.find(c => c.name === 'Cultural Portraits')!
      collMixed = collections.find(c => c.name === 'Mixed Media')!
    }

    // Artists
    const artistsData: InsertArtist[] = [
      { name: 'Tunga Makoni', bio: 'Contemporary painter specializing in portrait art that captures the essence of African identity and heritage through vibrant colors and expressive brushwork. Her work celebrates cultural pride and explores themes of tradition in modern contexts.', imageUrl: '/img/artwork/WhatsApp Image 2025-06-10 at 07.59.33_a0ff7f2e.jpg', featured: true, location: 'Harare, Zimbabwe' },
      { name: "O'Neal Tanaka Maisiri", bio: "O'Neal Tanaka Maisiri is a Zimbabwean artist whose abstract paintings reflect a deep connection to his environment. Using bold colors and dynamic compositions, he conveys the energy and emotions of his surroundings.", imageUrl: '/img/artwork/artist.png', featured: true, location: 'Harare, Zimbabwe' },
    ]

    let tunga, oneal
    try {
      tunga = await storage.createArtist(artistsData[0])
      oneal = await storage.createArtist(artistsData[1])
    } catch {
      // Artists might already exist, fetch them and match by normalized names
      const artists = await storage.getArtists()
      const norm = (s: string) => s.trim().toLowerCase()
      tunga = artists.find(a => norm(a.name) === norm('Tunga Makoni'))!
      oneal = artists.find(a => norm(a.name) === norm("O'Neal Tanaka Maisiri"))!
    }

    // All artworks from comprehensive list
    const artworksData: InsertArtwork[] = [
      { title: 'Family', description: 'A vibrant portrait the beauty of family relations.', price: 0, imageUrl: '/img/artwork/WhatsApp Image 2025-06-24 at 04.32.13.jpg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 120 cm', medium: 'Acrylic on canvas', year: '2024', inStock: true, featured: true, artistId: tunga.id },
      { title: 'Blending Colours', description: 'A vibrant portrait.', price: 279, imageUrl: '/img/artwork/WhatsApp Image 2025-06-24 at 07.18.28.jpg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 120 cm', medium: 'Acrylic on canvas', year: '2024', inStock: true, featured: true, artistId: tunga.id },
      { title: 'Abstract Spirit', description: 'A vibrant portrait celebrating African heritage with bold colors and expressive brushwork.', price: 250, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.27.21.jpeg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 120 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: true, artistId: oneal.id },
      { title: 'Nature\'s Harmony', description: 'An exploration of natural forms and patterns through a rich tapestry of colors and textures.', price: 500, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.27.24.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '70 x 90 cm', medium: 'Mixed media on canvas', year: '2023', inStock: false, featured: true, artistId: oneal.id },
      { title: 'Abstract Emotion', description: 'A powerful abstract piece exploring the depths of human emotion through color and form.', price: 260, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.29.57.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '100 x 100 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: true, artistId: oneal.id },
      { title: 'Cultural Heritage', description: 'A celebration of African cultural heritage through symbolic imagery and traditional patterns.', price: 290, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.29.59.jpeg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 120 cm', medium: 'Oil on canvas', year: '2023', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Colorful Abstraction', description: 'A vibrant abstract composition with bold colors and dynamic forms creating visual harmony.', price: 420, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.01.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '80 x 80 cm', medium: 'Mixed media on canvas', year: '2023', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Dynamic Harmony', description: 'An abstract composition that explores the interplay of shapes and colors, creating a sense of rhythm and balance.', price: 280, imageUrl: '/img/artwork/WhatsApp Image 2025-06-10 at 07.59.32 (2).jpg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '100 x 100 cm', medium: 'Collage on canvas', year: '2022', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Abstract Patterns 2', description: 'A mesmerizing exploration of patterns and textures through abstract composition.', price: 530, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.02 (1).jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '80 x 100 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Cultural Tapestry', description: 'A vibrant representation of African cultural elements woven together in a harmonious composition.', price: 460, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.03.jpeg', categoryId: catMixedMedia.id, collectionId: collCultural.id, dimensions: '100 x 100 cm', medium: 'Acrylic on canvas', year: '2023', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Soulful Portrait 2', description: 'A soulful portrait that captures the depth and spirit of its subject through expressive techniques.', price: 580, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.04.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '90 x 120 cm', medium: 'Oil on canvas', year: '2023', inStock: false, featured: true, artistId: tunga.id },
      { title: 'Expressive Portrait', description: 'A bold portrait using expressive brushwork to convey emotion and character.', price: 390, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.05 (3).jpeg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 110 cm', medium: 'Oil on canvas', year: '2024', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Dynamic Composition', description: 'A dynamic arrangement of shapes and colors creating a sense of movement and energy.', price: 410, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '100 x 100 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Textural Abstract', description: 'A highly textured abstract work exploring surface quality and material interaction.', price: 325, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (1).jpeg', categoryId: catMixedMedia.id, collectionId: collMixed.id, dimensions: '90 x 95 cm', medium: 'Mixed media on canvas', year: '2023', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Serene Waters', description: 'A peaceful depiction of water and sky with subtle color transitions creating a meditative mood.', price: 290, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.07 (2).jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '85 x 110 cm', medium: 'Oil on canvas', year: '2023', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Cultural Celebration', description: 'A vibrant celebration of African cultural motifs and patterns in a contemporary format.', price: 250, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.08 (1).jpeg', categoryId: catPaintings.id, collectionId: collCultural.id, dimensions: '90 x 110 cm', medium: 'Mixed media on canvas', year: '2024', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Gestural Abstract', description: 'A dynamic gestural abstract painting capturing movement and spontaneity through brushwork.', price: 600, imageUrl: '/img/artwork/WhatsApp Image 2025-05-15 at 09.30.09.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '95 x 115 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Abstract Expressions Collection', description: 'From the vibrant strokes of paintings that sing with color to the intricate details of mixed media, this collection showcases the dynamic range of contemporary African art.', price: 550, imageUrl: '/img/artwork/WhatsApp Image 2025-05-16 at 11.47.25.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '80 x 120 cm', medium: 'Acrylic on canvas', year: '2025', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Paintings Collection', description: 'Creating a visual narrative that speaks to the heart and soul of African culture, this collection features a range of styles and techniques that celebrate the beauty and diversity of the continent.', price: 385, imageUrl: '/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24 (1).jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '80 x 130 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: false, artistId: tunga.id },
      { title: 'Cultural Portraits Collection', description: 'A piece that breathes life into space, inviting viewers to explore the rich tapestry of African culture through the lens of contemporary art.', price: 575, imageUrl: '/img/artwork/WhatsApp Image 2025-05-16 at 11.47.24.jpeg', categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '90 x 120 cm', medium: 'Acrylic on canvas', year: '2024', inStock: false, featured: false, artistId: tunga.id },
      { title: 'A ROYAL AFRICAN DIALECT', description: 'The bi-associative and symbolic diction in the title of the work highlights the African affinities we share as African people. This painting highlights the unified empathy of a people under threat during the restrictive times of COVID-19', price: 800, imageUrl: '/img/artwork/royal.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '126 cm x 73 cm ', medium: 'oil, acrylic, pastel on canvas', year: '2021', inStock: true, featured: false },
      { title: 'BLOOMING DESIRE', description: 'The artwork Blooming Desire is presented in an effortless flow of paint with rippling harmonies, melodious squiggles and an ultra spontaneous mode of application. In painterly automatism, this capricious work has amorous overtones, revealed in the stemming of a heart symbol juxtaposed with a rose bloom.', price: 950, imageUrl: '/img/artwork/box.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '38 cm x 38cm x 5cm', medium: 'oil on canvas', year: '2024', inStock: true, featured: false },
      { title: 'FIGHT FLIGHT', description: 'A pun on the workings of adrenaline on the body, the image of an aeroplane taking off symbolizes the economic migration that has beset the youth of the nation. In a search for better opportunities, employment and economic survival, Zimbabwean youths are experiencing growing up isolated in today\'s broken up families.', price: 900, imageUrl: '/img/artwork/flight.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '194 cm X 54 cm', medium: 'acrylic, ink on wood ', year: '2024', inStock: true, featured: false },
      { title: 'UNTITLED X', description: 'Untitled X is a work inspired by apocalyptic revelations in the Bible. An outline of a skull entwined in the digital age of Starlink, Twitter, X and other global digital platforms harken the end times for man.', price: 1000, imageUrl: '/img/artwork/unit.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '190 cm x 135 cm ', medium: 'oil acrylic ink and pastel on wood', year: '2024', inStock: true, featured: false },
      { title: 'TRANSCENDENT', description: 'In this painting the artist reminiscence about his close spiritual relationship with his late mother and how her intuition protected him from the dangerous follies of life. Likening her intuition to an out of body experience, the artist depicts his thoughts in a surreal manner where a disjointed head hovers over his work. This painting has layers of meaning that question our physical and spiritual existence.', price: 985, imageUrl: '/img/artwork/UNIT3.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '120 cm X 43 cm', medium: 'acrylic, oil, ink and pastel on canvas', year: '2024', inStock: true, featured: false },
      { title: 'CAPPIN\' VANITIES', description: 'In local urban slang, the term capping means to tell exaggerated lies to impress one\'s peers. Maisiri makes a penetrating statement about the vanities and false identities exhibited by the youth of today. In this urban landscape the social critic uses collage of torn bank notes and faces from popular social and fashion magazines to express the pseudo identities and materialism sought by his urban peers.', price: 920, imageUrl: '/img/artwork/capp.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '120 x 38 cm', medium: 'oil, acrylic, ink on plastic, paper and canvas', year: '2024', inStock: true, featured: false },
      { title: 'GIRLS DESERVE THEIR FLOWERS', description: 'Here Maisiri interrogates social norms and etiquette of placing flowers at gravesites or presenting a female with flowers as a gesture of affection. Squiggles of white \'iceberg\' roses snd graffiti, reading; \' Girls Deserve their Flowers\' occupy the left foreground of the painting as a reminder of the importance of the moment and the worthiness of women.', price: 830, imageUrl: '/img/artwork/girls.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '56 x 63 cm', medium: 'acrylic, oil, ink, pastel, embroidery threads and found objects', year: '2024', inStock: true, featured: false },
      { title: 'MUDIWA', description: 'The Shona word Mudiwa means beloved one. In this work Maisiri depicts an exaggerated female hand pointing to the viewer in the manner of the famous Lord Kitchener World War II poster - Your Country Needs You, calling on youths to enlist. Here the gender sensitive artist reconstitutes the image in a socioreligious way that is locally relevant and directed to the female youth of Zimbabwe', price: 1000, imageUrl: '/img/artwork/mudiwa.png', artistId: oneal.id, categoryId: catPaintings.id, collectionId: collAbstract.id, dimensions: '100 x 100 cm', medium: 'acrylic, oil, ink, plastic and glass on canvas', year: '2022', inStock: true, featured: false },
      { title: 'Waves of Change', description: 'A dynamic abstract piece that captures the essence of movement and transformation through fluid brushstrokes and vibrant colors.', price: 500, imageUrl: '/img/artwork/WhatsApp Image 2025-06-10 at 07.59.33_a0ff7f2e.jpg', artistId: tunga.id, categoryId: catMixedMedia.id, collectionId: collAbstract.id, dimensions: '100 x 100 cm', medium: 'Acrylic on canvas', year: '2022', inStock: false, featured: true },
    ]

    // Insert artworks idempotently by title
    const existingArtworks = await storage.getArtworks()
    const existingTitles = new Set(existingArtworks.map(a => a.title))
    let createdCount = 0
    let skipped = 0
    const failures: { title: string; error: string }[] = []

    for (const aw of artworksData) {
      if (existingTitles.has(aw.title)) { skipped++; continue }
      try {
        await storage.createArtwork(aw)
        createdCount++
      } catch (e) {
        failures.push({ title: aw.title, error: (e as Error)?.message || String(e) })
      }
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

    return NextResponse.json({ 
      message: 'Database seeded successfully', 
      artworksCreated: createdCount,
      artworksSkipped: skipped,
      totalArtworks: artworksData.length,
      failures
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json({ message: 'Failed to seed database', error: String(error) }, { status: 500 })
  }
}

// Convenience: allow GET to trigger seeding in dev
export async function GET() {
  return POST()
}
