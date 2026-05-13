// app/products/[slug]/page.tsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import {
  Info,
  Package,
  Truck,
  ShieldCheck,
  Cuboid,
  Clock,
} from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import AddToCartSection from '@/components/AddToCartSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/store/products/${slug}/`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedProducts(categoryId?: number): Promise<Product[]> {
  if (!categoryId) return [];
  try {
    const res = await fetch(
      `${API_URL}/store/products/?category=${categoryId}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? data).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category?.id);
  const filteredRelated = relatedProducts.filter((p) => p.slug !== slug);
  const validImages = product.images?.filter((img) => img.image) || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">

      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
              خانه
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition-colors whitespace-nowrap">
              محصولات
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <span className="text-zinc-500 whitespace-nowrap">
                  {product.category.name}
                </span>
              </>
            )}
            <span>/</span>
            <span className="text-white truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-20">

          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={validImages} name={product.name} />
          </div>

          {/* Info */}
          <div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 mt-4 leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-zinc-400 text-base sm:text-lg mb-6 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Price Box */}
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 mb-6">

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-3">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                  {product.final_price.toLocaleString('fa-IR')}
                </span>
                <span className="text-zinc-400 text-base sm:text-lg">تومان</span>
              </div>

              {/* Discount */}
              {product.discount_percent > 0 && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                  <span className="text-zinc-500 line-through text-lg sm:text-xl">
                    {product.price.toLocaleString('fa-IR')}
                  </span>
                  <span className="bg-rose-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                    {product.discount_percent}٪ تخفیف
                  </span>
                </div>
              )}

              {/* Stock Status */}
              <div className="pt-4 border-t border-white/10">
                {product.is_active ? (
                  product.is_available ? (
                    /* AVAILABLE */
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck size={20} className="flex-shrink-0" />
                      <span className="font-bold text-sm sm:text-base">
                        {product.availability_text}
                      </span>
                    </div>
                  ) : (
                    /* NEEDS PREPARATION */
                    <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-amber-400 mb-3">
                        <Clock size={20} className="flex-shrink-0" />
                        <span className="font-bold">نیاز به آماده‌سازی</span>
                      </div>
                      <p className="font-bold text-cyan-300 text-base">
                        زمان آماده‌سازی:{' '}
                        <span className="text-white">
                          {product.preparation_time_days} روز کاری
                        </span>
                      </p>
                      <p className="text-cyan-300/70 text-sm mt-2 leading-relaxed">
                        پس از ثبت سفارش، محصول پرینت شده و برای شما ارسال خواهد شد.
                      </p>
                      {product.availability_text && (
                        <p className="text-xs text-cyan-400 mt-4 pt-3 border-t border-cyan-500/10 italic">
                          {product.availability_text}
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  /* INACTIVE */
                  <div className="flex items-center gap-2 text-rose-400">
                    <Info size={20} className="flex-shrink-0" />
                    <span className="font-bold text-sm sm:text-base">
                      این محصول فعلاً غیرفعال است
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                <div className="text-zinc-500 text-xs sm:text-sm mb-1">جنس</div>
                <div className="font-bold text-white text-sm sm:text-base">
                  {product.material || '—'}
                </div>
              </div>
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                <div className="text-zinc-500 text-xs sm:text-sm mb-1">نوع</div>
                <div className="font-bold text-white text-sm sm:text-base">
                  {product.product_type}
                </div>
              </div>
              {product.weight_grams && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                  <div className="text-zinc-500 text-xs sm:text-sm mb-1">وزن</div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {product.weight_grams} گرم
                  </div>
                </div>
              )}
              {product.print_time_hours && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-3 sm:p-4">
                  <div className="text-zinc-500 text-xs sm:text-sm mb-1">زمان پرینت</div>
                  <div className="font-bold text-white text-sm sm:text-base">
                    {product.print_time_hours} ساعت
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart - Client Component */}
            <AddToCartSection product={product} />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck size={20} className="text-violet-400" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">ارسال سریع</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">تحویل ۳ روزه</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} className="text-cyan-400" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">گارانتی اصالت</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">ضمانت کیفیت</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-rose-400" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm">بسته‌بندی ویژه</div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">کاملاً ایمن</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-12 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">توضیحات محصول</h2>
            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 sm:p-8">
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <RelatedProducts products={filteredRelated} />
        )}
      </div>
    </div>
  );
}

/* ====================== RelatedProducts ====================== */

function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8">محصولات مرتبط</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all"
          >
            <div className="aspect-square bg-zinc-950 relative overflow-hidden">
              {product.primary_image ? (
                <Image
                  src={getImageUrl(product.primary_image)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Cuboid size={48} className="text-zinc-700" strokeWidth={1} />
                </div>
              )}
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-bold text-white text-sm sm:text-base mb-2 line-clamp-1 group-hover:text-violet-400 transition-colors">
                {product.name}
              </h3>
              <div className="text-base sm:text-lg font-black text-white">
                {product.final_price.toLocaleString('fa-IR')}
                <span className="text-[10px] sm:text-xs font-medium text-zinc-400 mr-1">
                  تومان
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}