import type { Metadata } from 'next'
import Artworks from '@/components/pages/Artworks'

export const metadata: Metadata = {
  title: 'Artworks | Imbayedu Art Collective',
  description: 'Browse our curated collection of contemporary African artworks including paintings, sculptures, photography, and mixed media.',
}

export default function ArtworksPage() {
  return <Artworks />
}