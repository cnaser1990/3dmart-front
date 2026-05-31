'use client'

import Image from 'next/image'
import Link from 'next/link'
import useCartStore from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* تصویر */}
      <div className="relative w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            بدون تصویر
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="flex-grow">
        <Link
          href={`/${item.type === 'product' ? 'products' : 'consumables'}/${item.id}`}
          className="font-bold hover:text-blue-600 line-clamp-2"
        >
          {item.name}
          {item.variantColor ? ` - ${item.variantColor}` : ''}
        </Link>

        <div className="text-sm text-gray-500 mt-1">
          {item.type === 'product' ? 'محصول' : 'مصرفی'}
        </div>

        <div className="flex items-center gap-4 mt-3">
          {/* قیمت واحد */}
          <div className="text-blue-600 font-bold">
            {formatPrice(item.price)} تومان
          </div>

          {/* کنترل تعداد */}
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
              className="px-3 py-1 hover:bg-gray-100"
            >
              −
            </button>
            <span className="px-3 py-1 border-x min-w-[40px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* حذف */}
          <button
            onClick={() => removeItem(item.id, item.type)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            🗑️ حذف
          </button>
        </div>
      </div>

      {/* قیمت کل */}
      <div className="text-left flex-shrink-0">
        <div className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</div>
        <div className="text-sm text-gray-500">تومان</div>
      </div>
    </div>
  )
}