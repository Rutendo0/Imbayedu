import type { Metadata } from 'next'
import Cart from '@/components/pages/Cart'

export const metadata: Metadata = {
  title: 'Shopping Cart | Imbayedu Art Collective',
  description: 'Review your selected artworks and furniture pieces before checkout.',
}

export default function CartPage() {
  return <Cart />
}