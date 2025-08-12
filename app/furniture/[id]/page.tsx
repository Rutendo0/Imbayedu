import type { Metadata } from 'next'
import FurnitureDetail from '@/components/pages/FurnitureDetail'

export const metadata: Metadata = {
  title: 'Furniture Details | Imbayedu Art Collective',
  description: 'View detailed information about this furniture piece including designer, materials, and purchase options.',
}

export default function FurnitureDetailPage() {
  return <FurnitureDetail />
}