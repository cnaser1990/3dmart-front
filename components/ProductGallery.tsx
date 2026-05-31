// components/ProductGallery.tsx

'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Cuboid } from 'lucide-react';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
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
      <div className="aspect-square bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/10">
        <Cuboid size={80} className="sm:w-32 sm:h-32 text-zinc-700" strokeWidth={1} />
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square bg-zinc-900 rounded-3xl mb-3 sm:mb-4 overflow-hidden border border-white/10">
        <Image
          src={getImageUrl(safeImages[selectedIndex].image)}
          alt={safeImages[selectedIndex].alt_text || name}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {safeImages.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                index === selectedIndex
                  ? 'border-violet-500 opacity-100 scale-95'
                  : 'border-white/10 opacity-60 hover:opacity-100 hover:border-violet-500/50'
              }`}
            >
              <Image
                src={getImageUrl(img.image)}
                alt={img.alt_text || name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}