import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./hooks/use-cart";

import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import Artworks from "./pages/Artworks";
import ArtworkDetail from "./pages/ArtworkDetail";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/artworks" component={Artworks} />
          <Route path="/artworks/:id" component={ArtworkDetail} />
          <Route path="/artists" component={Artists} />
          <Route path="/artists/:id" component={ArtistDetail} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
