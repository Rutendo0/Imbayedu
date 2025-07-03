import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./hooks/use-cart";
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Artworks from "./pages/Artworks";
import ArtworkDetail from "./pages/ArtworkDetail";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";
import ExhibitionDetail from "./pages/ExhibitionDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FAQ from "./pages/FAQ";
import InteriorDesign from "./pages/InteriorDesign";
import FurnitureCatalog from "./pages/FurnitureCatalog";
import FurnitureDetail from "./pages/FurnitureDetail";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  // Prefetch important data
  queryClient.prefetchQuery({
    queryKey: ['/api/categories'],
    staleTime: Infinity
  });

  queryClient.prefetchQuery({
    queryKey: ['/api/artists/featured'],
    staleTime: 1000 * 60 * 5
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/artworks" component={Artworks} />
                  <Route path="/artworks/:id" component={ArtworkDetail} />
                  <Route path="/artists" component={Artists} />
                  <Route path="/artists/:id" component={ArtistDetail} />
                  <Route path="/exhibition/:id" component={ExhibitionDetail} />
                  <Route path="/about" component={About} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/cart" component={Cart} />
                  <Route path="/checkout" component={Checkout} />
                  <Route path="/faq" component={FAQ} />
                  <Route path="/interior-design" component={InteriorDesign} />
                  <Route path="/furniture-catalog" component={FurnitureCatalog} />
                  <Route path="/furniture/:id" component={FurnitureDetail} />
                  <Route component={NotFound} />
                </Switch>
              </main>
              <Footer />
              <Toaster />
            </div>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;