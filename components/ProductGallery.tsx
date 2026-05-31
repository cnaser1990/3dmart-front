'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Cuboid } from 'lucide-react';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

interface GalleryImage {
  id: number;
  image: string | null;
  alt_text: string;
}

export default function ProductGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const safeImages = useMemo(
    () => images.filter((img): img is GalleryImage & { image: string } => Boolean(img.image)),
    [images]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (safeImages.length === 0) {
    return (
      <div className="relative aspect-square bg-zinc-900/50 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30" />
        <Cuboid size={64} className="sm:w-24 sm:h-24 text-zinc-600" strokeWidth={1} />
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* ✅ Main Image - Fixed with object-contain */}
      <div className="relative aspect-square bg-zinc-900/50 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30" />
        
        {/* Image with contain to show full product */}
        <Image
          src={getImageUrl(safeImages[selectedIndex].image)}
          alt={safeImages[selectedIndex].alt_text || name}
          fill
          className="object-contain p-4 sm:p-6 md:p-8 transition-opacity duration-300"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
        />
        
        {/* Border Glow Effect */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/5 pointer-events-none" />
      </div>

      {/* ✅ Thumbnails - Fixed sizing */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {safeImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-zinc-900/50 ${
                index === selectedIndex
                  ? 'border-violet-500 opacity-100 scale-[0.95] shadow-lg shadow-violet-500/20'
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-violet-500/50'
              }`}
            >
              {/* Thumbnail with contain */}
              <Image
                src={getImageUrl(img.image)}
                alt={img.alt_text || name}
                fill
                className="object-contain p-2 sm:p-3"
                sizes="(max-width: 640px) 25vw, 60px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}