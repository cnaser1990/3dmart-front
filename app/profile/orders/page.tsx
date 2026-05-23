'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getOrders } from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import Loading from '@/components/Loading'
import ErrorMessage from '@/components/ErrorMessage'
import type { Order } from '@/types'

function OrdersContent() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری سفارش‌ها')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل داده شده',
      cancelled: 'لغو شده',
    }
    return texts[status] || status
  }

  if (loading) return <Loading />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profile" className="text-gray-600 hover:text-gray-800">
          ← بازگشت
        </Link>
        <h1 className="text-3xl font-bold">سفارش‌های من</h1>
      </div>

      {error ? (
        <ErrorMessage message={error} retry={loadOrders} />
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-4">هنوز سفارشی ندارید</h2>
          <p className="text-gray-600 mb-8">اولین سفارش خود را ثبت کنید</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              {/* هدر سفارش */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
                <div>
                  <div className="font-bold text-lg mb-1">سفارش #{order.id}</div>
                  <div className="text-sm text-gray-600">
                    {formatDate(order.created_at)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>

                  {order.tracking_code && (
                    <div className="text-sm">
                      <span className="text-gray-600">کد رهگیری: </span>
                      <span className="font-medium">{order.tracking_code}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* آیتم‌ها */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}× {item.product?.name || item.consumable?.name}
                    </span>
                    <span className="font-medium">{formatPrice(item.subtotal)} تومان</span>
                  </div>
                ))}
              </div>

              {/* آدرس */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                <div className="font-medium mb-2">📍 آدرس تحویل:</div>
                <div className="text-gray-700">
                  {order.province}, {order.city}
                  <br />
                  {order.address}
                  <br />
                  کد پستی: {order.postal_code}
                </div>
              </div>

              {/* جمع کل */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">
                    مبلغ کل: {formatPrice(order.total_price)} تومان
                  </div>
                  {order.shipping_fee > 0 && (
                    <div className="text-sm text-gray-600">
                      هزینه ارسال: {formatPrice(order.shipping_fee)} تومان
                    </div>
                  )}
                  {order.discount_amount > 0 && (
                    <div className="text-sm text-green-600">
                      تخفیف: {formatPrice(order.discount_amount)} تومان
                    </div>
                  )}
                </div>

                <div className="text-left">
                  <div className="text-sm text-gray-600 mb-1">مبلغ پرداختی:</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(order.final_amount)} تومان
                  </div>
                </div>
              </div>

              {/* دکمه‌ها */}
              {order.status === 'pending' && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      // درخواست پرداخت دوباره
                      alert('قابلیت پرداخت مجدد به زودی...')
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    💳 پرداخت
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  )
}