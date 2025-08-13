import type { Metadata } from 'next'
import { Suspense } from 'react'
import FAQ from '@/components/pages/FAQ'

export const metadata: Metadata = {
  title: 'FAQ | Imbayedu Art Collective',
  description: 'Frequently asked questions about our artworks, shipping, returns, and more.',
}

export default function FAQPage() {
  return (
    <Suspense fallback={<div className="pt-24 md:pt-32" />}> 
      <FAQ />
    </Suspense>
  )
}