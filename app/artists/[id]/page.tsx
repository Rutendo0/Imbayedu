import type { Metadata } from 'next'
import ArtistDetail from '@/components/pages/ArtistDetail'

export const metadata: Metadata = {
  title: 'Artist Profile | Imbayedu Art Collective',
  description: 'Explore the artist\'s portfolio, biography, and available artworks.',
}

export default function ArtistDetailPage() {
  return <ArtistDetail />
}