import { useMemo } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useCart } from "../hooks/use-cart";
import { CartItem } from "../components/ui/cart-item";
import { Button } from "../components/ui/button";
import { formatCurrency } from "../lib/utils";
import { ShoppingBag } from "lucide-react";

const Cart = () => {
  const { cartItemsWithDetails, clearCart } = useCart();

  const subtotal = useMemo(() => {
    return cartItemsWithDetails.reduce(
      (total, item) => total + item.artwork.price * item.quantity,
      0
    );
  }, [cartItemsWithDetails]);

  // Fixed shipping fee - would be dynamic in a real implementation
  const shippingFee = subtotal > 0 ? 150 : 0;
  
  const total = subtotal + shippingFee;

  if (cartItemsWithDetails.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart | Imbayedu Art Collective</title>
          <meta name="description" content="View and manage the items in your shopping cart at Imbayedu Art Collective." />
        </Helmet>
        
        <div className="pt-24 md:pt-32">
          <div className="bg-neutral-100 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
                Your Cart
              </h1>
            </div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-xl mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <ShoppingBag size={80} className="text-neutral-300" />
              </div>
              <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-neutral-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-neutral-600 mb-8">
                Looks like you haven't added any artworks to your cart yet. Continue browsing to discover our unique collection.
              </p>
              <Link href="/artworks">
                <Button className="bg-[#D3A265] hover:bg-opacity-90 text-white font-medium px-8 py-3">
                  Browse Artworks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Cart | Imbayedu Art Collective</title>
        <meta name="description" content="View and manage the items in your shopping cart at Imbayedu Art Collective." />
      </Helmet>
      
      <div className="pt-24 md:pt-32">
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 text-center">
              Your Cart
            </h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h2 className="text-xl font-['Playfair_Display'] font-semibold">Shopping Cart ({cartItemsWithDetails.length} items)</h2>
                <Button 
                  variant="ghost" 
                  className="text-neutral-500 hover:text-red-500 p-0"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
              
              <div>
                {cartItemsWithDetails.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-8">
                <Link href="/artworks">
                  <Button variant="outline" className="text-neutral-700">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 p-6 rounded-md">
                <h3 className="text-lg font-['Playfair_Display'] font-semibold mb-6 pb-4 border-b border-gray-200">
                  Order Summary
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">{formatCurrency(shippingFee)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-semibold">{formatCurrency(total)}</span>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full bg-[#D3A265] hover:bg-opacity-90 text-white font-medium py-3">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="mt-6 text-center text-sm text-neutral-500">
                  <p>Secure checkout. All transactions are encrypted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
