import type { Metadata } from 'next'
import Contact from '@/components/pages/Contact'

export const metadata: Metadata = {
  title: 'Contact Us | Imbayedu Art Collective',
  description: 'Get in touch with Imbayedu Art Collective. Contact us for inquiries about our artworks, exhibitions, or collaborations.',
}

export default function ContactPage() {
  return <Contact />
}