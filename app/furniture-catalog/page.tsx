import type { Metadata } from 'next'
import FurnitureCatalog from '@/components/pages/FurnitureCatalog'

export const metadata: Metadata = {
  title: 'Furniture Catalog | Imbayedu Art Collective',
  description: 'Explore our collection of handcrafted furniture pieces designed by talented African artisans.',
}

export default function FurnitureCatalogPage() {
  return <FurnitureCatalog />
}