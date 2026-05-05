'use client'

import { useState } from 'react'
import { trackOrder } from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import Loading from '@/components/Loading'
import type { Order } from '@/types'

export default function TrackOrderPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  const [formData, setFormData] = useState({
    order_id: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setOrder(null)

    try {
      const data = await trackOrder(parseInt(formData.order_id), formData.phone)
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'سفارش یافت نشد')
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">پیگیری سفارش</h1>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">شماره سفارش</label>
              <input
                type="number"
                required
                value={formData.order_id}
                onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">شماره موبایل</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
            >
              {loading ? 'در حال جستجو...' : '🔍 پیگیری سفارش'}
            </button>
          </div>
        </form>

        {/* خطا */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* نتیجه */}
        {order && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <h2 className="font-bold text-2xl mb-2">سفارش #{order.id}</h2>
                <p className="text-gray-600">{formatDate(order.created_at)}</p>
              </div>

              <span
                className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}
              >
                {order.status_display || order.status}
              </span>
            </div>

            {/* کد رهگیری */}
            {order.tracking_code && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="font-medium mb-2">📦 کد رهگیری پستی:</div>
                <div className="text-2xl font-bold text-blue-600">{order.tracking_code}</div>
              </div>
            )}

            {/* آیتم‌ها */}
            <div className="mb-6">
              <h3 className="font-bold mb-4">محصولات:</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}× {item.product?.name || item.consumable?.name}
                    </span>
                    <span className="font-medium">{formatPrice(item.subtotal)} تومان</span>
                  </div>
                ))}
              </div>
            </div>

            {/* آدرس */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="font-medium mb-2">📍 آدرس تحویل:</div>
              <div className="text-gray-700">
                {order.full_name}
                <br />
                {order.phone}
                <br />
                {order.province}, {order.city}
                <br />
                {order.address}
                <br />
                کد پستی: {order.postal_code}
              </div>
            </div>

            {/* مبلغ */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>مبلغ کل:</span>
                <span className="text-blue-600">{formatPrice(order.final_amount)} تومان</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}