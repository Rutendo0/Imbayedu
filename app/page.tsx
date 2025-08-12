import type { Metadata } from 'next'
import Home from '@/components/pages/Home'

export const metadata: Metadata = {
  title: 'Imbayedu Art Collective | Discover Unique African Art',
  description: 'Discover unique African art pieces from talented artists at Imbayedu Art Collective. Shop our curated collection of contemporary paintings, sculptures, photography, and mixed media artwork.',
}

export default function HomePage() {
  return <Home />
}