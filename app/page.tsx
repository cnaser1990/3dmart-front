import Link from "next/link";
import { Product, Consumable } from "@/types";
import { ArrowLeft, Box, Droplet, Printer, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ─── Data Fetching ────────────────────────────────────

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/store/products/featured/`, {
      cache: 'no-store', // برای تست - بعداً revalidate بزار
    });
    if (!res.ok) {
      console.error('❌ Featured products fetch failed:', res.status);
      return [];
    }
    const data = await res.json();
    console.log('✅ Featured products:', data);
    return data.results ?? data;
  } catch (error) {
    console.error('❌ Featured products error:', error);
    return [];
  }
}

async function getConsumables(): Promise<Consumable[]> {
  try {
    const res = await fetch(`${API_URL}/store/consumables/`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('❌ Consumables fetch failed:', res.status);
      return [];
    }
    const data = await res.json();
    console.log('✅ Consumables:', data);
    return (data.results ?? data).slice(0, 4);
  } catch (error) {
    console.error('❌ Consumables error:', error);
    return [];
  }
}

// ─── Components ───────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4" />
      <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-3" />
      <div className="h-5 bg-gray-200 rounded-lg w-1/2" />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white p-5 rounded-3xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-4 relative overflow-hidden">
        {product.primary_image ? (
          <Image
            src={product.primary_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Printer size={48} strokeWidth={1.5} />
          </div>
        )}
        {product.discount_percent > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
            {product.discount_percent}٪ OFF
          </span>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm">
              ناموجود
            </span>
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] text-base">
        {product.name}
      </h3>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-col gap-1">
          {product.discount_percent > 0 && (
            <span className="text-gray-400 line-through text-xs">
              {product.price.toLocaleString('fa-IR')}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-blue-600 font-black text-lg">
              {product.final_price.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs text-gray-500">تومان</span>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <ArrowLeft className="text-white" size={18} />
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
      className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-4"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl relative overflow-hidden flex-shrink-0">
        {consumable.image ? (
          <Image
            src={consumable.image}
            alt={consumable.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {consumable.color_hex ? (
              <div
                className="w-10 h-10 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: consumable.color_hex }}
              />
            ) : (
              <Droplet size={28} className="text-gray-300" strokeWidth={1.5} />
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1 font-medium">{consumable.brand}</p>
        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-2">
          {consumable.name}
        </h3>
        {consumable.selling_price ? (
          <div className="flex items-baseline gap-1">
            <span className="text-blue-600 font-bold text-base">
              {consumable.selling_price.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs text-gray-500">تومان</span>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">قیمت ثبت نشده</span>
        )}
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowLeft className="text-blue-600" size={20} />
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────

export default async function HomePage() {
  const [products, consumables] = await Promise.all([
    getFeaturedProducts(),
    getConsumables(),
  ]);

  console.log('📦 Products count:', products.length);
  console.log('💧 Consumables count:', consumables.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230071e3' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-5 py-2.5 rounded-full mb-8 font-medium text-sm">
              <Sparkles size={16} />
              اولین پلتفرم هوشمند پرینت سه‌بعدی در ایران
            </div>

            {/* Heading */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-6 text-gray-900 leading-tight">
              ایده‌هایت رو به{' '}
              <span className="bg-gradient-to-l from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                واقعیت
              </span>
              <span>
               تبدیل کن 
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
              از اکشن‌فیگورهای خاص و فانکوهای کلکسیونی تا پرینت سفارشی و بهترین مواد مصرفی. همه‌چیز برای دنیای سه‌بعدی شما
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <Printer size={20} />
                مشاهده محصولات
                <ArrowLeft size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/consumables"
                className="group bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700 px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <Droplet size={20} />
                مواد مصرفی
                <ArrowLeft size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12">
            <path d="M0 48h1440V0s-168 48-720 48S0 0 0 0v48z" fill="rgb(249, 250, 251)" />
          </svg>
        </div>
      </section>

      {/* محصولات ویژه */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                محصولات ویژه
              </h2>
            </div>
            <p className="text-gray-500 text-lg">
              پرفروش‌ترین و محبوب‌ترین پرینت‌های این هفته
            </p>
          </div>
          <Link
            href="/products"
            className="group text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2 transition-all"
          >
            مشاهده همه
            <ArrowLeft size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-3xl mt-6 border border-gray-100">
            <Box className="text-gray-300 mx-auto mb-4" size={48} />
            <p className="text-gray-500 text-lg font-medium">
              هنوز محصولی اضافه نشده است
            </p>
            <p className="text-gray-400 text-sm mt-2">
              لطفاً از پنل ادمین محصولات را اضافه کنید
            </p>
          </div>
        )}
      </section>

      {/* مواد مصرفی */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-b from-transparent to-gray-50/50">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Droplet className="text-white" size={20} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                مواد مصرفی
              </h2>
            </div>
            <p className="text-gray-500 text-lg">
              باکیفیت‌ترین فیلامنت‌ها و رزین‌ها با بهترین قیمت
            </p>
          </div>
          <Link
            href="/consumables"
            className="group text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2 transition-all"
          >
            مشاهده همه
            <ArrowLeft size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {consumables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {consumables.map((consumable) => (
              <ConsumableCard key={consumable.id} consumable={consumable} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-gray-100 animate-pulse flex gap-4"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 bg-gray-200 rounded-lg w-1/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {consumables.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl mt-6 border border-gray-100">
            <Droplet className="text-gray-300 mx-auto mb-4" size={48} />
            <p className="text-gray-500 text-lg font-medium">
              هنوز مواد مصرفی اضافه نشده است
            </p>
            <p className="text-gray-400 text-sm mt-2">
              لطفاً از پنل ادمین مواد مصرفی را اضافه کنید
            </p>
          </div>
        )}
      </section>

    </div>
  );
}