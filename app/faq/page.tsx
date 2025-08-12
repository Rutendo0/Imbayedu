import type { Metadata } from 'next'
import FAQ from '@/components/pages/FAQ'

export const metadata: Metadata = {
  title: 'FAQ | Imbayedu Art Collective',
  description: 'Frequently asked questions about our artworks, shipping, returns, and more.',
}

export default function FAQPage() {
  return <FAQ />
}