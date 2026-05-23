// app/products/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Product, Category } from '@/types';
import {
  Cuboid,
  SlidersHorizontal,
  Search,
  PackageX,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

async function getProducts(searchParams: {
  category?: string;
  search?: string;
  product_type?: string;
  ordering?: string;
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (searchParams.category) params.set('category', searchParams.category);
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.product_type) params.set('product_type', searchParams.product_type);
    if (searchParams.ordering) params.set('ordering', searchParams.ordering);

    const res = await fetch(`${API_URL}/store/products/?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? data;
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/store/categories/`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? data;
  } catch {
    return [];
  }
}

const PRODUCT_TYPES = [
  { value: '', label: 'همه' },
  { value: 'action_figure', label: 'اکشن فیگور' },
  { value: 'funko', label: 'فانکو پاپ' },
  { value: 'custom', label: 'سفارشی' },
  { value: 'decoration', label: 'دکوری' },
  { value: 'other', label: 'سایر' },
];

const ORDERING_OPTIONS = [
  { value: '', label: 'پیش‌فرض' },
  { value: '-created_at', label: 'جدیدترین' },
  { value: 'final_price', label: 'ارزان‌ترین' },
  { value: '-final_price', label: 'گران‌ترین' },
  { value: '-discount_percent', label: 'بیشترین تخفیف' },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    product_type?: string;
    ordering?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(resolvedParams),
    getCategories(),
  ]);

  const hasActiveFilter =
    !!resolvedParams.category ||
    !!resolvedParams.search ||
    !!resolvedParams.product_type ||
    !!resolvedParams.ordering;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">

        {/* ── Page Header ── */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-1">محصولات</h1>
          <p className="text-zinc-500 text-sm sm:text-base">
            {products.length} محصول موجود
          </p>
        </div>

        {/* ── Filters ── */}
        <Filters
          categories={categories}
          resolvedParams={resolvedParams}
        />

        {/* ── Active filters bar ── */}
        {hasActiveFilter && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-zinc-400 text-sm">
              <span className="text-white font-bold">{products.length}</span> نتیجه یافت شد
            </p>
            <Link
              href="/products"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors border border-violet-500/30 hover:border-violet-500/60 px-3 py-1.5 rounded-full"
            >
              پاک کردن فیلترها
            </Link>
          </div>
        )}

        {/* ── Grid ── */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState hasFilter={hasActiveFilter} />
        )}
      </div>
    </div>
  );
}

/* ====================== Filters ====================== */

function Filters({
  categories,
  resolvedParams,
}: {
  categories: Category[];
  resolvedParams: {
    category?: string;
    search?: string;
    product_type?: string;
    ordering?: string;
  };
}) {
  const buildHref = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { ...resolvedParams, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/products?${params.toString()}`;
  };

  return (
    <div className="mb-8 space-y-4">

      {/* Search */}
      <form method="GET" action="/products" className="relative">
        {resolvedParams.category && (
          <input type="hidden" name="category" value={resolvedParams.category} />
        )}
        {resolvedParams.product_type && (
          <input type="hidden" name="product_type" value={resolvedParams.product_type} />
        )}
        {resolvedParams.ordering && (
          <input type="hidden" name="ordering" value={resolvedParams.ordering} />
        )}
        <Search
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
        <input
          type="text"
          name="search"
          defaultValue={resolvedParams.search ?? ''}
          placeholder="جستجو در محصولات..."
          className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-3 sm:py-4 pr-12 pl-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 transition-colors text-sm sm:text-base"
        />
      </form>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Link
            href={buildHref({ category: '' })}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
              !resolvedParams.category
                ? 'bg-violet-600 border-violet-500 text-white'
                : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-violet-500/40 hover:text-white'
            }`}
          >
            همه دسته‌ها
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildHref({ category: cat.slug })}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
                resolvedParams.category === cat.slug
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-violet-500/40 hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Product Type + Ordering */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Product types */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
          {PRODUCT_TYPES.map((type) => (
            <Link
              key={type.value}
              href={buildHref({ product_type: type.value })}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
                (resolvedParams.product_type ?? '') === type.value
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-cyan-500/40 hover:text-white'
              }`}
            >
              {type.label}
            </Link>
          ))}
        </div>

        {/* Ordering */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal size={15} className="text-zinc-500 flex-shrink-0" />
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {ORDERING_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={buildHref({ ordering: opt.value })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0 ${
                  (resolvedParams.ordering ?? '') === opt.value
                    ? 'bg-fuchsia-600 border-fuchsia-500 text-white'
                    : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-fuchsia-500/40 hover:text-white'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================== Product Card ====================== */

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col"
    >
      {/* Image */}
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

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
              ویژه
            </span>
          )}
          {product.discount_percent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {product.discount_percent}٪
            </span>
          )}
        </div>

        {/* Inactive overlay */}
        {!product.is_active && (
          <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
            <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-white/10">
              ناموجود
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-bold text-white text-sm sm:text-base mb-1 line-clamp-2 group-hover:text-violet-400 transition-colors leading-snug flex-1">
          {product.name}
        </h3>

        <span className="text-[10px] text-zinc-500 mb-3">
          {PRODUCT_TYPES.find((t) => t.value === product.product_type)?.label ?? product.product_type}
        </span>

        {/* Price */}
        <div className="mt-auto">
          {product.discount_percent > 0 && (
            <div className="text-zinc-500 line-through text-xs sm:text-sm mb-0.5">
              {product.price.toLocaleString('fa-IR')} تومان
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-white">
              {product.final_price.toLocaleString('fa-IR')}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-400">تومان</span>
          </div>

          {/* Stock */}
          <div className="mt-2">
            {product.is_active ? (
              product.stock > 0 ? (
                <span className="text-[10px] text-emerald-400 font-bold">
                  ✓ موجود در انبار
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 font-bold">
                  ⏱ ساخت در {product.preparation_time_days} روز
                </span>
              )
            ) : (
              <span className="text-[10px] text-rose-400 font-bold">
                ✕ ناموجود
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ====================== Empty State ====================== */

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
        {hasFilter ? (
          <Search size={40} className="text-zinc-600" />
        ) : (
          <PackageX size={40} className="text-zinc-600" />
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-white mb-3">
        {hasFilter ? 'محصولی یافت نشد' : 'هنوز محصولی ثبت نشده'}
      </h3>
      <p className="text-zinc-500 text-sm sm:text-base max-w-xs mb-6">
        {hasFilter
          ? 'فیلترهای دیگری امتحان کنید یا جستجوی خود را تغییر دهید'
          : 'به زودی محصولات جدید اضافه خواهند شد'}
      </p>
      {hasFilter && (
        <Link
          href="/products"
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/30 text-sm"
        >
          پاک کردن فیلترها
        </Link>
      )}
    </div>
  );
}