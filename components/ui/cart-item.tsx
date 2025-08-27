import { useCart } from "@/components/hooks/use-cart";
import { CartItemWithDetails } from "@shared/schema";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
  item: CartItemWithDetails;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCart();
  const { artwork, quantity } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      updateItemQuantity(item.id, quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const handleIncrease = () => {
    updateItemQuantity(item.id, quantity + 1);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-200">
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 mr-0 sm:mr-6 flex-shrink-0">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-medium mb-1">{artwork.title}</h3>
        <p className="text-neutral-600 text-sm mb-2">
          By {artwork.artist ? artwork.artist.name : (artwork.price === 0 ? 'Gift to Community' : 'Unknown Artist')}
        </p>
        <p className="text-[#D3A265] font-semibold">{formatCurrency(artwork.price)}</p>
      </div>
      <div className="flex items-center mt-4 sm:mt-0">
        <div className="flex items-center border border-gray-300 rounded-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDecrease}
            className="h-8 w-8 rounded-none"
          >
            <Minus size={16} />
          </Button>
          <span className="w-10 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleIncrease}
            className="h-8 w-8 rounded-none"
          >
            <Plus size={16} />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="ml-4 text-red-500 hover:text-red-700 hover:bg-transparent"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
