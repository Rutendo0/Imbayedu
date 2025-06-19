import { useState } from "react";
import { Category } from "@shared/schema";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  sortOrder: string;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export function FilterBar({
  categories,
  selectedCategory,
  sortOrder,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="mt-6 md:mt-0 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
      <div className="w-full md:w-auto">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-white border border-neutral-300 text-neutral-700 rounded-sm focus:ring-1 focus:ring-[#D3A265] focus:border-[#D3A265] w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-auto">
        <Select value={sortOrder} onValueChange={onSortChange}>
          <SelectTrigger className="bg-white border border-neutral-300 text-neutral-700 rounded-sm focus:ring-1 focus:ring-[#D3A265] focus:border-[#D3A265] w-full md:w-48">
            <SelectValue placeholder="Latest Arrivals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest Arrivals</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
