'use client'

import Image from 'next/image'
import Link from 'next/link'
import useCartStore from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    const weightInGrams = product.weight_grams && product.weight_grams > 0 
      ? Math.round(product.weight_grams) 
      : 0;

    addItem({
      id: product.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      finalPrice: product.final_price,
      image: product.primary_image,
      quantity: 1,
      stock: product.stock,
      preparationTimeDays: product.preparation_time_days,
      weightGrams: weightInGrams,
      brand: product.brand,
      isConsumable: false,
      type: 'product',
    })
    alert('✅ به سبد خرید اضافه شد')
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="bg-gray-200">
          {product.primary_image ? (
            <Image
              src={product.primary_image}
              alt={product.name}
              width={600}
              height={450}
              className="h-48 w-full object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="flex h-48 items-center justify-center text-gray-400">
              بدون تصویر
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(product.final_price)}
          </span>
          <span className="text-sm text-gray-500">تومان</span>

          {product.discount_percent > 0 && (
            <span className="rounded bg-red-500 px-2 py-1 text-xs text-white">
              {product.discount_percent}%
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.is_available}
          className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {product.is_available ? 'افزودن به سبد' : 'ناموجود'}
        </button>
      </div>
    </div>
  )
}