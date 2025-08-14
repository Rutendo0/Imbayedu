import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";
import { InsertCartItem, CartItemWithDetails } from "@shared/schema";
import { isDev } from '@/lib/config';

interface CartContextType {
  cartItems: CartItemWithDetails[];
  cartItemsWithDetails: CartItemWithDetails[];
  addItem: (item: InsertCartItem) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fixed userId for demo purposes - in a real app this would come from auth
  const userId = 1;
  const API_URL = '';

  // Load cart items on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/cart/${userId}/details`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast({
          title: "Error",
          description: "Failed to load your cart items. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [API_URL, toast, userId]);

  const addItem = async (item: InsertCartItem) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", `${API_URL}/api/cart`, item);
      const newItem = await response.json();

      // Refetch cart to get updated cart with details
      const cartResponse = await fetch(`${API_URL}/api/cart/${userId}/details`, {
        credentials: "include",
      });

      if (cartResponse.ok) {
        const data = await cartResponse.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `${API_URL}/api/cart/${id}`);
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (id: number, quantity: number) => {
    try {
      setIsLoading(true);
      await apiRequest("PATCH", `${API_URL}/api/cart/${id}`, { quantity });

      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `${API_URL}/api/cart/user/${userId}`);
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsWithDetails: cartItems,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};