
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface ImageLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
}

export function ImageLoader({ 
  src, 
  alt, 
  className, 
  aspectRatio = "auto",
  ...props 
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: "aspect-auto"
  };

  return (
    <div className={cn("relative overflow-hidden", aspectRatioClasses[aspectRatio])}>
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
