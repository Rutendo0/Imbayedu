import type { Metadata } from 'next'
import NotFound from '@/components/pages/not-found'

export const metadata: Metadata = {
  title: 'Page Not Found | Imbayedu Art Collective',
  description: 'The page you are looking for could not be found.',
}

export default function NotFoundPage() {
  return <NotFound />
}