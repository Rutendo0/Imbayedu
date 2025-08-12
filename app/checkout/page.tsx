import type { Metadata } from 'next'
import Checkout from '@/components/pages/Checkout'

export const metadata: Metadata = {
  title: 'Checkout | Imbayedu Art Collective',
  description: 'Complete your purchase of selected artworks and furniture pieces.',
}

export default function CheckoutPage() {
  return <Checkout />
}