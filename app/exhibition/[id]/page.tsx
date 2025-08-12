import type { Metadata } from 'next'
import ExhibitionDetail from '@/components/pages/ExhibitionDetail'

export const metadata: Metadata = {
  title: 'Exhibition Details | Imbayedu Art Collective',
  description: 'Learn more about this exhibition, featured artists, and displayed artworks.',
}

export default function ExhibitionDetailPage() {
  return <ExhibitionDetail />
}