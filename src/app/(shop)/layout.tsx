import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Shop | Inkbloom',
  description: 'Curated artworks and doodles for your collection.',
}

/**
 * Shop Group Layout
 * Aesthetic: Warm greige (#EEEBE5) inherited from root.
 * Bottom pill nav provided by root layout.
 */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen selection:bg-terracotta selection:text-white overflow-x-hidden">
      <main className="relative z-0">
        {children}
      </main>
    </div>
  )
}
