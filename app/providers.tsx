'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CartProvider } from '@/hooks/use-cart'
import { ThemeProvider } from 'next-themes'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}