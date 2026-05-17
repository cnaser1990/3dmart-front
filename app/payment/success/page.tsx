'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)

  const orderId = searchParams.get('order_id')
  const refId = searchParams.get('ref_id')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/profile/orders')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* آیکون موفق */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-5xl">✓</div>
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-4">پرداخت موفق!</h1>
        <p className="text-gray-600 mb-8">سفارش شما با موفقیت ثبت و پرداخت شد</p>

        {/* اطلاعات */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            {orderId && (
              <div>
                <div className="text-sm text-gray-600 mb-1">شماره سفارش:</div>
                <div className="font-bold text-lg">#{orderId}</div>
              </div>
            )}

            {refId && (
              <div>
                <div className="text-sm text-gray-600 mb-1">کد پیگیری:</div>
                <div className="font-bold text-lg" dir="ltr">
                  {refId}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* پیام */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            📧 اطلاعات سفارش به شماره موبایل شما ارسال شد
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile/orders"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700"
          >
            مشاهده سفارش‌ها
          </Link>
          <Link
            href="/"
            className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50"
          >
            بازگشت به خانه
          </Link>
        </div>

        {/* Countdown */}
        <div className="mt-8 text-sm text-gray-500">
          {countdown} ثانیه دیگر به صفحه سفارش‌ها منتقل می‌شوید...
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">درحال بارگذاری...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}