'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import Loading from '@/components/Loading'
import ErrorMessage from '@/components/ErrorMessage'
import { getProducts } from '@/lib/api'
import type { PaginatedResponse, Product } from '@/types'

type Filters = {
  product_type: string
  material: string
  search: string
  ordering: string
}

const DEFAULT_FILTERS: Omit<Filters, 'product_type'> = {
  material: '',
  search: '',
  ordering: '-created_at',
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type') ?? ''

  return <ProductsContent key={typeParam} typeParam={typeParam} />
}

function ProductsContent({ typeParam }: { typeParam: string }) {
  const [filters, setFilters] = useState<Filters>({
    product_type: typeParam,
    ...DEFAULT_FILTERS,
  })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = (await getProducts(filters)) as PaginatedResponse<Product>

        if (cancelled) return
        setProducts(data.results ?? [])
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'خطا در دریافت محصولات رخ داد.')
        setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchData()

    return () => {
      cancelled = true
    }
  }, [filters, retryKey])

  const handleRetry = useCallback(() => {
    setRetryKey((prev) => prev + 1)
  }, [])

  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    []
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">محصولات</h1>
        <p className="text-gray-600">تمامی محصولات پرینت سه‌بعدی</p>
      </div>

      <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <select
            value={filters.product_type}
            onChange={(e) => updateFilter('product_type', e.target.value)}
            className="rounded-lg border px-4 py-2"
          >
            <option value="">همه انواع</option>
            <option value="action_figure">اکشن فیگور</option>
            <option value="funko">فانکو پاپ</option>
            <option value="custom">سفارشی</option>
            <option value="decoration">تزئینات</option>
            <option value="other">سایر</option>
          </select>

          <select
            value={filters.material}
            onChange={(e) => updateFilter('material', e.target.value)}
            className="rounded-lg border px-4 py-2"
          >
            <option value="">همه جنس‌ها</option>
            <option value="pla">PLA</option>
            <option value="resin">رزین</option>
            <option value="abs">ABS</option>
            <option value="petg">PETG</option>
          </select>

          <select
            value={filters.ordering}
            onChange={(e) => updateFilter('ordering', e.target.value)}
            className="rounded-lg border px-4 py-2"
          >
            <option value="-created_at">جدیدترین</option>
            <option value="created_at">قدیمی‌ترین</option>
            <option value="price">ارزان‌ترین</option>
            <option value="-price">گران‌ترین</option>
          </select>

          <input
            type="text"
            placeholder="جستجو..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="rounded-lg border px-4 py-2"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} retry={handleRetry} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <p className="text-gray-600">محصولی یافت نشد</p>
        </div>
      )}
    </div>
  )
}