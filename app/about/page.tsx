import type { Metadata } from 'next'
import About from '@/components/pages/About'

export const metadata: Metadata = {
  title: 'About Us | Imbayedu Art Collective',
  description: 'Learn about Imbayedu Art Collective, our mission to promote African art and culture, and our commitment to supporting talented artists.',
}

export default function AboutPage() {
  return <About />
}