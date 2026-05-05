'use client'

import { useRouter } from 'next/navigation'
import useCartStore from '@/store/cartStore'
import CartItem from '@/components/CartItem'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()

  const total = getTotal()
  const shippingFee = total >= 3000000 ? 0 : 50000
  const finalTotal = total + shippingFee

  const handleCheckout = () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('⚠️ لطفاً ابتدا وارد شوید')
      router.push('/auth/login')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">سبد خرید شما خالی است</h2>
          <p className="text-gray-600 mb-8">هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            مشاهده محصولات
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={`${item.type}-${item.id}`} item={item} />
          ))}

          <button
            onClick={() => {
              if (confirm('آیا مطمئن هستید؟')) {
                clearCart()
              }
            }}
            className="text-red-500 hover:text-red-700"
          >
            🗑️ خالی کردن سبد خرید
          </button>
        </div>

        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="font-bold text-xl mb-4">خلاصه سفارش</h3>

            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">مجموع ({items.length} کالا):</span>
                <span className="font-medium">{formatPrice(total)} تومان</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">هزینه ارسال:</span>
                {shippingFee === 0 ? (
                  <span className="text-green-600 font-medium">رایگان</span>
                ) : (
                  <span className="font-medium">{formatPrice(shippingFee)} تومان</span>
                )}
              </div>

              {total < 3000000 && (
                <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  💡 با خرید {formatPrice(3000000 - total)} تومان دیگر، ارسال رایگان!
                </div>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>مبلغ قابل پرداخت:</span>
              <span className="text-blue-600">{formatPrice(finalTotal)} تومان</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              ادامه و تسویه حساب
            </button>

            <button
              onClick={() => router.push('/products')}
              className="w-full mt-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
            >
              ادامه خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}