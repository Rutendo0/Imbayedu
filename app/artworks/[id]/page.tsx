import type { Metadata } from 'next'
import ArtworkDetail from '@/components/pages/ArtworkDetail'

export const metadata: Metadata = {
  title: 'Artwork Details | Imbayedu Art Collective',
  description: 'View detailed information about this artwork including artist biography, dimensions, and purchase options.',
}

export default function ArtworkDetailPage() {
  return <ArtworkDetail />
}