import type { Metadata } from 'next'
import Artists from '@/components/pages/Artists'

export const metadata: Metadata = {
  title: 'Artists | Imbayedu Art Collective',
  description: 'Discover talented African artists and their unique creative journeys at Imbayedu Art Collective.',
}

export default function ArtistsPage() {
  return <Artists />
}