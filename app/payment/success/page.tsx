// app/payment/success/page.tsx - آپدیت شده
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home, ArrowLeft } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const orderId = searchParams.get('order_id');
  const refId = searchParams.get('ref_id');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-8 text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={48} className="text-green-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black mb-3">پرداخت موفق!</h1>
            <p className="text-zinc-400 text-lg">سفارش شما با موفقیت ثبت و پرداخت شد</p>
          </div>

          {/* Order Info */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderId && (
                <div className="bg-zinc-950/50 rounded-2xl p-4">
                  <div className="text-sm text-zinc-500 mb-1">شماره سفارش</div>
                  <div className="text-2xl font-black text-violet-400">#{orderId}</div>
                </div>
              )}

              {refId && (
                <div className="bg-zinc-950/50 rounded-2xl p-4">
                  <div className="text-sm text-zinc-500 mb-1">کد پیگیری بانکی</div>
                  <div className="text-xl font-mono font-bold" dir="ltr">
                    {refId}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6">
            <p className="text-blue-300 text-center">
              📱 اطلاعات سفارش به شماره موبایل شما ارسال شد
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {orderId && (
              <Link
                href={`/orders/${orderId}/track?phone=YOUR_PHONE`}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-6 py-4 rounded-2xl font-bold transition-all"
              >
                <Package size={20} />
                پیگیری سفارش
              </Link>
            )}

            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-2xl font-bold transition-all"
            >
              <Home size={20} />
              بازگشت به خانه
            </Link>
          </div>

          {/* Countdown */}
          <div className="text-center mt-8 text-sm text-zinc-500">
            <ArrowLeft className="inline mx-1" size={14} />
            {countdown} ثانیه دیگر به صفحه اصلی منتقل می‌شوید...
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}