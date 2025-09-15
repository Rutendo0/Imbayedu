'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CartProvider } from '@/components/hooks/use-cart'
import { ThemeProvider } from 'next-themes'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <CartProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </CartProvider>
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {/* Always provide Elements context; stripePromise may be null in build or when key is missing */}
        <Elements stripe={stripePromise}>
          {content}
        </Elements>
      </QueryClientProvider>
    </ThemeProvider>
  )
}