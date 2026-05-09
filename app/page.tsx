import Link from "next/link";
import { Product, Consumable } from "@/types";
import { Sparkles, ArrowLeft, Layers, PaintBucket, Cuboid } from "lucide-react";
import Image from "next/image";
import Slider from "@/components/Slider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

// ─── Data Fetching ────────────────────────────────────

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

// ─── Components ───────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="group relative flex flex-col bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-2 w-[280px] flex-shrink-0"
    >
      <div className="aspect-[4/5] relative overflow-hidden bg-zinc-950">
        {product.primary_image ? (
          <Image
            src={getImageUrl(product.primary_image)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Cuboid size={64} className="text-zinc-700" strokeWidth={1} />
          </div>
        )}
        {product.discount_percent > 0 && (
          <div className="absolute top-4 right-4 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-2xl shadow-lg shadow-rose-500/30">
            {product.discount_percent}٪
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover:text-violet-400 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-end justify-between">
          <div>
            {product.discount_percent > 0 && (
              <span className="text-zinc-500 line-through text-sm">
                {product.price.toLocaleString('fa-IR')}
              </span>
            )}
            <div className="text-2xl font-black text-white mt-1">
              {product.final_price.toLocaleString('fa-IR')}
              <span className="text-sm font-medium text-zinc-400 mr-1">تومان</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white border border-white/10 group-hover:border-violet-500 transition-all">
            <ArrowLeft size={18} />
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
      className="group relative flex flex-col bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 w-[280px] flex-shrink-0"
    >
      <div className="aspect-square relative overflow-hidden bg-zinc-950 flex items-center justify-center p-6">
        {consumable.image ? (
          <Image
            src={getImageUrl(consumable.image)}
            alt={consumable.name}
            fill
            className="object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
          />
        ) : consumable.color_hex ? (
          <div 
            className="w-24 h-24 rounded-3xl shadow-2xl ring-1 ring-white/20 transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundColor: consumable.color_hex }}
          />
        ) : (
          <PaintBucket size={64} className="text-zinc-700" strokeWidth={1} />
        )}
      </div>

      <div className="p-5">
        <p className="text-cyan-400 text-xs font-bold tracking-widest mb-1">
          {consumable.brand}
        </p>
        <h3 className="font-bold text-lg text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {consumable.name}
        </h3>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-black text-white">
            {consumable.selling_price?.toLocaleString('fa-IR') || "—"}
            <span className="text-sm font-medium text-zinc-400 mr-1">تومان</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white border border-white/10 group-hover:border-cyan-500 transition-all">
            <ArrowLeft size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────

export default async function HomePage() {
  const [products, consumables] = await Promise.all([
    getRecentProducts(),
    getConsumables(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-12 overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden min-h-[70vh] flex items-center justify-center">
        
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#27272a_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-white/5 bg-[length:40px_40px]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />

        {/* گوشه بالا راست */}
        <div className="absolute top-8 right-8 w-32 h-32 md:w-44 md:h-44 hidden lg:block">
          <Image
            src="/images/luffy.png"
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.4)] opacity-80"
          />
        </div>

        {/* گوشه بالا چپ */}
        <div className="absolute top-8 left-8 w-32 h-32 md:w-44 md:h-44 hidden lg:block">
          <Image
            src="images/pink-panter.png"
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] opacity-80"
          />
        </div>

        {/* گوشه پایین راست */}
        <div className="absolute bottom-8 right-8 w-32 h-32 md:w-44 md:h-44 hidden lg:block">
          <Image
            src="images/jujutsu.png"
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(244,63,94,0.4)] opacity-80"
          />
        </div>

        {/* گوشه پایین چپ */}
        <div className="absolute bottom-8 left-8 w-32 h-32 md:w-44 md:h-44 hidden lg:block">
          <Image
            src="images/jin-kazama.png"
            alt=""
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.4)] opacity-80"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-3xl text-center relative z-30">
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mb-8">
            <Sparkles className="text-violet-400" size={20} />
            <span className="font-bold text-sm tracking-widest text-white/90">
              مرجع اکشن فیگور و چیزای باحال!
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tighter mb-8">
            <span>اینجا ایده‌ها </span>
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              سه‌بعدی
            </span>
            {' '}میشن
          </h1>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-12">
            اکشن فیگور، فانکو پاپ، دکوری، قطعات خاص و بهترین مواد مصرفی پرینتر سه‌بعدی
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-black px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
            >
              <Layers size={20} />
              گالری محصولات
            </Link>
            <Link
              href="/consumables"
              className="bg-transparent border border-white/20 hover:border-white/40 px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-white/5"
            >
              مواد مصرفی
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
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

      {/* Consumables Section */}
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

    </div>
  );
}