'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '@/store/cartStore'
import { createOrder, requestPayment, getProfile } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import type { User } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postal_code: '',
    notes: '',
  })

  useEffect(() => {
    // چک کردن لاگین
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('⚠️ لطفاً ابتدا وارد شوید')
      router.push('/auth/login')
      return
    }

    // چک کردن سبد خرید
    if (items.length === 0) {
      router.push('/cart')
      return
    }

    // بارگذاری اطلاعات کاربر
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = await getProfile()
      setUser(userData)

      // پر کردن فرم با اطلاعات کاربر
      setFormData((prev) => ({
        ...prev,
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        phone: userData.phone || '',
      }))
    } catch (err) {
      console.error('Error loading user:', err)
    }
  }

  const total = getTotal()
  const shippingFee = total >= 3000000 ? 0 : 50000
  const finalTotal = total + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // ۱. ساخت سفارش
      const orderData = {
        ...formData,
        items: items.map((item) => ({
          ...(item.type === 'product'
            ? { product_id: item.id }
            : { consumable_id: item.id }),
          quantity: item.quantity,
        })),
      }

      const orderResponse = await createOrder(orderData)

      // ۲. درخواست پرداخت
      const paymentResponse = await requestPayment(orderResponse.order_id)

      // ۳. پاک کردن سبد خرید
      clearCart()

      // ۴. انتقال به درگاه
      window.location.href = paymentResponse.payment_url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ثبت سفارش')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null // redirect در useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">تسویه حساب</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* فرم اطلاعات */}
        <div className="lg:col-span-2 space-y-6">
          {/* اطلاعات تماس */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-xl mb-4">اطلاعات تماس</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="علی احمدی"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">شماره موبایل *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="09123456789"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* آدرس */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-bold text-xl mb-4">آدرس تحویل</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">استان *</label>
                  <input
                    type="text"
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="تهران"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">شهر *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="تهران"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">آدرس کامل *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="خیابان ولیعصر، پلاک ۱۲، واحد ۳"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">کد پستی *</label>
                <input
                  type="text"
                  required
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234567890"
                  maxLength={10}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">یادداشت (اختیاری)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="توضیحات اضافی برای سفارش..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* خلاصه سفارش */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="font-bold text-xl mb-4">خلاصه سفارش</h3>

            {/* لیست محصولات */}
            <div className="space-y-3 mb-4 pb-4 border-b max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                  <span className="line-clamp-1">
                    {item.quantity}× {item.name}
                  </span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* محاسبات */}
            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">جمع کل:</span>
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
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>مبلغ قابل پرداخت:</span>
              <span className="text-blue-600">{formatPrice(finalTotal)} تومان</span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300 transition"
            >
              {loading ? 'در حال پردازش...' : '💳 پرداخت'}
            </button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              با کلیک روی پرداخت، به درگاه امن زرین‌پال منتقل می‌شوید
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}