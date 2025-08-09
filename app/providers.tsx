"use client";

import { ReactNode, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../client/src/lib/queryClient";
import { CartProvider } from "../client/src/hooks/use-cart";
import { TooltipProvider } from "../client/src/components/ui/tooltip";
import { Toaster } from "../client/src/components/ui/toaster";

export default function Providers({ children }: { children: ReactNode }) {
  // Optional: prefetch common queries here on client if needed
  useEffect(() => {
    queryClient.prefetchQuery({ queryKey: ["/api/categories"], staleTime: Infinity });
    queryClient.prefetchQuery({ queryKey: ["/api/artists/featured"], staleTime: 5 * 60 * 1000 });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}