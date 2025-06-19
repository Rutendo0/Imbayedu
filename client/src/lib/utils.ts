import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function generatePaginationArray(
  currentPage: number,
  totalPages: number,
  maxButtons: number = 5
): number[] {
  // If we have fewer pages than max buttons, show all pages
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always include first and last page
  const firstPage = 1;
  const lastPage = totalPages;

  // Calculate how many neighbor pages to show
  const neighborsOnEachSide = Math.floor((maxButtons - 3) / 2); // 3 accounts for current, first, last
  
  let startPage = Math.max(firstPage + 1, currentPage - neighborsOnEachSide);
  let endPage = Math.min(lastPage - 1, currentPage + neighborsOnEachSide);

  // Adjust if we're near the beginning or end
  if (currentPage - firstPage < neighborsOnEachSide) {
    endPage = Math.min(lastPage - 1, firstPage + maxButtons - 2);
  } else if (lastPage - currentPage < neighborsOnEachSide) {
    startPage = Math.max(firstPage + 1, lastPage - maxButtons + 2);
  }

  const pages = [firstPage];
  // Add ellipsis if there's a gap after first page
  if (startPage > firstPage + 1) {
    pages.push(-1); // -1 indicates an ellipsis
  }
  
  // Add the neighbor pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // Add ellipsis if there's a gap before last page
  if (endPage < lastPage - 1) {
    pages.push(-1); // -1 indicates an ellipsis
  }
  
  pages.push(lastPage);
  
  return pages;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getRandomColor(): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
