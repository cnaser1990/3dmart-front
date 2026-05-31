import Link from "next/link";
import { Product, Consumable } from "@/types";
import { Sparkles, ArrowLeft, Layers, PaintBucket, Cuboid } from "lucide-react";
import Image from "next/image";
import Slider from "@/components/Slider";
import CustomOrderForm from '@/components/CustomOrderForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

async function getRecentProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/store/products/`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? data;
  } catch {
    return [];
  }
}

async function getConsumables(): Promise<Consumable[]> {
  try {
    const res = await fetch(`${API_URL}/store/consumables/`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? data;
  } catch {
    return [];
  }
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-2 w-[240px] sm:w-[260px] md:w-[280px] flex-shrink-0"
    >
      {/* Image Container with Border */}
      <div className="relative p-3 sm:p-4">
        <div className="aspect-[4/5] relative overflow-hidden bg-zinc-950 rounded-2xl border-2 border-white/10 group-hover:border-violet-500/30 transition-all duration-500">
          {product.primary_image ? (
            <Image
              src={getImageUrl(product.primary_image)}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 240px, (max-width: 768px) 260px, 280px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Cuboid size={48} className="sm:w-16 sm:h-16 text-zinc-700" strokeWidth={1} />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Discount Badge */}
          {product.discount_percent > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white text-xs sm:text-sm font-black px-2.5 py-1.5 rounded-xl shadow-lg shadow-rose-500/30 backdrop-blur-sm">
              {product.discount_percent}٪
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 flex-1 flex flex-col">
        <h3 className="font-bold text-base sm:text-lg text-white mb-3 line-clamp-2 min-h-[3rem] group-hover:text-violet-400 transition-colors">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0">
              {product.discount_percent > 0 && (
                <div className="text-zinc-500 line-through text-xs sm:text-sm mb-1">
                  {product.price.toLocaleString('fa-IR')} تومان
                </div>
              )}
              <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {product.final_price.toLocaleString('fa-IR')}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">تومان</div>
            </div>
            
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 flex items-center justify-center group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:border-transparent transition-all shrink-0 group-hover:shadow-lg group-hover:shadow-violet-500/30">
              <ArrowLeft size={18} className="text-violet-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ConsumableCard({ consumable }: { consumable: Consumable }) {
  return (
    <Link 
      href={`/consumables/${consumable.slug}`} 
      className="group relative flex flex-col bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 w-[240px] sm:w-[260px] md:w-[280px] flex-shrink-0"
    >
      {/* Image Container with Border */}
      <div className="relative p-3 sm:p-4">
        <div className="aspect-square relative overflow-hidden bg-zinc-950 rounded-2xl border-2 border-white/10 group-hover:border-cyan-500/30 transition-all duration-500 flex items-center justify-center p-4 sm:p-6">
          {consumable.image ? (
            <Image
              src={getImageUrl(consumable.image)}
              alt={consumable.name}
              fill
              className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 p-4"
              sizes="(max-width: 640px) 240px, (max-width: 768px) 260px, 280px"
            />
          ) : consumable.color_hex ? (
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-2xl ring-2 ring-white/20 group-hover:ring-4 transition-all duration-700 group-hover:scale-110"
              style={{ backgroundColor: consumable.color_hex }}
            />
          ) : (
            <PaintBucket size={48} className="sm:w-16 sm:h-16 text-zinc-700" strokeWidth={1} />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          
          {/* Stock Badge */}
          <div className="absolute top-3 left-3">
            {consumable.stock > 0 ? (
              <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                موجود
              </div>
            ) : (
              <div className="bg-rose-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-lg">
                ناموجود
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 flex-1 flex flex-col">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-1.5 mb-2 w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-cyan-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            {consumable.brand}
          </span>
        </div>
        
        <h3 className="font-bold text-base sm:text-lg text-white mb-3 line-clamp-2 min-h-[3rem] group-hover:text-cyan-400 transition-colors">
          {consumable.name}
        </h3>
        
        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {consumable.selling_price?.toLocaleString('fa-IR') || "—"}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">تومان</div>
            </div>
            
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:border-transparent transition-all shrink-0 group-hover:shadow-lg group-hover:shadow-cyan-500/30">
              <ArrowLeft size={18} className="text-cyan-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          
          {/* Stock Info */}
          {consumable.stock > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-xs text-zinc-500">
                <span className="font-bold text-emerald-400">{consumable.stock}</span> عدد در انبار
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ... rest of the HomePage component (Hero Section, Sliders, etc.) remains the same
export default async function HomePage() {
  const [products, consumables] = await Promise.all([
    getRecentProducts(),
    getConsumables(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 pt-16 text-white pb-12 overflow-hidden">
      {/* Hero Section - Same as before */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-12 sm:pb-14 md:pb-16 px-4 sm:px-6 overflow-hidden min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] flex flex-col justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#27272a_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] sm:w-[600px] md:w-[700px] h-[350px] sm:h-[400px] md:h-[500px] bg-violet-600/20 blur-[100px] sm:blur-[120px] md:blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[300px] sm:w-[400px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[400px] bg-cyan-500/10 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full" />

        <div className="absolute top-8 right-8 w-28 h-28 lg:w-32 lg:h-32 xl:w-44 xl:h-44 hidden lg:block">
          <Image src="/images/luffy.png" alt="" fill className="object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.4)] opacity-80" />
        </div>
        <div className="absolute top-8 left-8 w-28 h-28 lg:w-32 lg:h-32 xl:w-44 xl:h-44 hidden lg:block">
          <Image src="/images/pink-panter.png" alt="" fill className="object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] opacity-80" />
        </div>
        <div className="absolute bottom-8 right-8 w-28 h-28 lg:w-32 lg:h-32 xl:w-44 xl:h-44 hidden lg:block">
          <Image src="/images/jujutsu.png" alt="" fill className="object-contain drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] opacity-80" />
        </div>
        <div className="absolute bottom-8 left-8 w-28 h-28 lg:w-32 lg:h-32 xl:w-44 xl:h-44 hidden lg:block">
          <Image src="/images/Jin_Kazama.png" alt="" fill className="object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.4)] opacity-80" />
        </div>

        <div className="container mx-auto max-w-3xl text-center relative z-30 px-4">
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-1.5 sm:py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8">
            <Sparkles className="text-violet-400" size={16} />
            <span className="font-bold text-xs sm:text-sm tracking-wide sm:tracking-widest text-white/90">
              مرجع اکشن فیگور و چیزای باحال!
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight sm:leading-[1.1] md:leading-[1.05] tracking-tight sm:tracking-tighter mb-6 sm:mb-8 px-2">
            <span>اینجا ایده‌ها </span>
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              سه‌بعدی
            </span>
            {' '}میشن
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-4">
            اکشن فیگور، فانکو پاپ، دکوری، قطعات خاص و بهترین مواد مصرفی پرینتر سه‌بعدی
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/products"
              className="bg-white text-black px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10 text-sm sm:text-base"
            >
              <Layers size={18} className="sm:w-5 sm:h-5" />
              گالری محصولات
            </Link>
            <Link
              href="/consumables"
              className="bg-transparent border border-white/20 hover:border-white/40 px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 sm:gap-3 transition-all hover:bg-white/5 text-sm sm:text-base"
            >
              مواد مصرفی
            </Link>
          </div>
        </div>
      </section>

      <Slider
        subtitle="جدیدترین محصولات و فیگورها"
        href="/products"
        linkText="مشاهده همه"
        itemCount={products.length}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-center">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>

      <Slider
        subtitle="فیلامنت و رزین‌های حرفه‌ای"
        href="/consumables"
        linkText="مشاهده همه"
        itemCount={consumables.length}
      >
        {consumables.map((consumable) => (
          <div key={consumable.id} className="snap-center">
            <ConsumableCard consumable={consumable} />
          </div>
        ))}
      </Slider>

      <CustomOrderForm id="custom-order" />
    </div>
  );
}