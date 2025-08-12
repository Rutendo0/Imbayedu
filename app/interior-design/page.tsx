import type { Metadata } from 'next'
import InteriorDesign from '@/components/pages/InteriorDesign'

export const metadata: Metadata = {
  title: 'Luxury Interior Design Services - Imbayedu Art Collective',
  description: "Transform your space with Imbayedu's professional interior design and art curation services",
}

export default function InteriorDesignPage() {
  return <InteriorDesign />
}