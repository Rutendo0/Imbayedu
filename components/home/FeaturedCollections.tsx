import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Collection } from "@shared/schema";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FeaturedCollections = () => {
  const fetchFeaturedCollections = async (): Promise<Collection[]> => {
    const res = await fetch('/api/collections?featured=true');
    if (!res.ok) throw new Error('Failed to load featured collections');
    return res.json();
  };

  const { data: collections, isLoading, error } = useQuery<Collection[]>({
    queryKey: ['/api/collections', 'featured=true'],
    queryFn: fetchFeaturedCollections,
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  // Must be declared unconditionally before any early returns to satisfy Rules of Hooks
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Our Collections</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">Experience our carefully curated collections showcasing the finest contemporary African art</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-80 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !collections) {
    return null;
  }

  // Use images from the collection data and de-duplicate by id (normalize id type)
  const uniqueCollections = Array.from(
    new Map(collections.map((c) => [String(c.id), c])).values()
  );

  // Normalize image filename to detect duplicates with variant names
  const normalizeImageKey = (raw?: string | null) => {
    if (!raw) return 'noimg';
    const finalize = (filename: string) => {
      const parts = filename.split('.');
      const ext = parts.length > 1 ? `.${parts.pop()}` : '';
      const base = parts.join('.');
      // Step 1: remove common duplicate/variant markers
      const step1 = base
        .replace(/(\s*\(\d+\)|[ _-]\d+|[ _-]copy\d*)$/i, '') // (1), _1, -copy, -copy2
        .replace(/@[23]x$/i, '') // @2x, @3x
        .replace(/[-_](\d{2,4}x\d{2,4})$/i, '') // -1080x1080, _800x600
        .replace(/[-_](scaled|min|compressed|final|edit(?:ed)?|new|latest)$/i, '') // -scaled, -min, -compressed, -final, -edit/-edited, -new, -latest
        .replace(/\.[a-z0-9]{6,}$/i, ''); // trailing content hash like .a1b2c3d4
      // Step 2: canonicalize by stripping punctuation/whitespace to match "mixed-media" vs "mixed_media" vs "Mixed Media"
      const canonical = step1.replace(/[^a-z0-9]/gi, '').toLowerCase();
      return `${canonical}${ext}`;
    };

    try {
      const u = raw.startsWith('http') ? new URL(raw) : new URL(raw, 'https://dummy.base');
      const pathname = u.pathname.replace(/^\/+/, '');
      const filename = pathname.split('/').pop() || pathname;
      return finalize(filename);
    } catch {
      const cleaned = raw.replace(/^\/+/, '').split('?')[0].split('#')[0];
      const filename = cleaned.split('/').pop() || cleaned;
      return finalize(filename);
    }
  };

  // Filter out collections without a real/valid image URL
  const isPotentialImageUrl = (raw?: string | null) => {
    if (!raw) return false;
    const s = raw.trim().toLowerCase();
    if (!s || s === 'null' || s === 'undefined' || s === '/' || s === '#') return false;
    if (s.startsWith('about:blank')) return false;
    const withoutParams = s.split('?')[0].split('#')[0];
    // Allow common image extensions only
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(withoutParams);
  };

  const collectionsWithImages = uniqueCollections.filter(
    (c) => isPotentialImageUrl(c.imageUrl)
  );

  // Prefer the collection with the longest description for duplicates (more informative)
  const bestOf = (a: Collection, b: Collection) => {
    const al = (a.description || '').length;
    const bl = (b.description || '').length;
    if (al !== bl) return al > bl ? a : b;
    // Tie-breaker: prefer the one with the earliest createdAt if available
    const ad = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
    const bd = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
    if (ad !== bd) return ad < bd ? a : b;
    // Final tie: smaller id
    return String(a.id) < String(b.id) ? a : b;
  };

  // As requested: show each image only once (even if multiple collections share it)
  const uniqueByImageMap = new Map<string, Collection>();
  for (const c of collectionsWithImages) {
    const key = normalizeImageKey(c.imageUrl);
    const existing = uniqueByImageMap.get(key);
    uniqueByImageMap.set(key, existing ? bestOf(existing, c) : c);
  }
  const uniqueByImage = Array.from(uniqueByImageMap.values());

  const fallbackImage = "/img/artwork/artist.png"; // shown if a collection has no image

  // Pin the requested three collections by name (avoids URL variant mismatches)
  const pinnedNames = [
    "Abstract Expressions",
    "Cultural Portraits",
    "Mixed Media",
  ];
  const pinned: Collection[] = [];
  for (const name of pinnedNames) {
    const found = uniqueByImage.find((c) => c.name === name);
    if (found && !pinned.includes(found)) pinned.push(found);
  }
  const remaining = uniqueByImage.filter((c) => !pinned.includes(c));
  const orderedByPinned = [...pinned, ...remaining];

  const visibleCollections = orderedByPinned
    .filter((c) => {
      const key = normalizeImageKey(c.imageUrl);
      return !failedImages.has(key);
    })
    .slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0 md:max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-neutral-900 mb-4">Our Collections</h2>
            <p className="text-neutral-600">Experience our carefully curated collections showcasing the finest contemporary African art from Imbayedu artists</p>
          </div>
          <Link 
            href="/artworks" 
            className="flex items-center text-[#D3A265] hover:text-neutral-900 transition-colors"
          >
            <span className="mr-2 font-medium">View All Collections</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleCollections.map((collection) => {
            const imgKey = normalizeImageKey(collection.imageUrl);
            return (
              <Link key={collection.id} href={`/artworks?collection=${collection.id}`}>
                <div className="group relative overflow-hidden rounded-md shadow-md transition duration-300 hover:shadow-xl h-96">
                  <img 
                    src={collection.imageUrl || fallbackImage} 
                    alt={collection.name} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    onError={() => {
                      setFailedImages((prev) => {
                        const next = new Set(prev);
                        next.add(imgKey);
                        return next;
                      });
                    }}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                    <div className="flex flex-col items-start">
                      <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white mb-2 group-hover:text-[#D3A265] transition-colors">{collection.name}</h3>
                      <p className="text-white text-sm mb-6 opacity-90 max-w-xs">{collection.description}</p>
                      <span 
                        className="inline-flex items-center text-white text-sm font-medium group-hover:text-[#D3A265] transition-colors"
                      >
                        <span className="mr-2">Explore Collection</span>
                        <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
