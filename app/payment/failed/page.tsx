'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const error = searchParams.get('error')

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* آیکون خطا */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-5xl text-red-500">✕</div>
        </div>

        <h1 className="text-3xl font-bold text-red-600 mb-4">پرداخت ناموفق</h1>
        <p className="text-gray-600 mb-8">متأسفانه پرداخت شما انجام نشد</p>

        {/* دلیل خطا */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-8">
            <p className="font-medium">دلیل خطا:</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {/* راهنمایی */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-right">
          <p className="font-medium text-yellow-800 mb-2">چه اتفاقی افتاد؟</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• ممکن است پرداخت را لغو کرده باشید</li>
            <li>• موجودی کافی نبوده است</li>
            <li>• مشکلی در درگاه پرداخت رخ داده</li>
          </ul>
        </div>

        {/* اطلاعات سفارش */}
        {orderId && (
          <div className="mb-8">
            <p className="text-gray-600">
              سفارش شما با شماره <span className="font-bold">#{orderId}</span> ثبت شده اما پرداخت
              نشده است
            </p>
          </div>
        )}

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderId && (
            <Link
              href={`/profile/orders`}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              مشاهده سفارش و تلاش مجدد
            </Link>
          )}
          <Link
            href="/cart"
            className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50"
          >
            بازگشت به سبد خرید
          </Link>
        </div>

        {/* پشتیبانی */}
        <div className="mt-8 text-sm text-gray-500">
          در صورت کسر وجه از حساب، تا ۷۲ ساعت آینده به حساب شما برمی‌گردد
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">درحال بارگذاری...</div>}>
      <PaymentFailedContent />
    </Suspense>
  )
}