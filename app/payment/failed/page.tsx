// app/payment/failed/page.tsx - آپدیت شده
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { XCircle, ArrowLeft, ShoppingCart, Home } from 'lucide-react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const error = searchParams.get('error');

  const getErrorMessage = (errorCode: string | null) => {
    const errors: Record<string, string> = {
      cancelled: 'پرداخت توسط کاربر لغو شد',
      'authority-missing': 'اطلاعات پرداخت یافت نشد',
      'transaction-not-found': 'تراکنش یافت نشد',
    };

    return errors[errorCode || ''] || errorCode || 'خطای نامشخص در پرداخت';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Error Icon */}
          <div className="bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-3xl p-8 text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle size={48} className="text-red-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black mb-3 text-red-400">
              پرداخت ناموفق
            </h1>
            <p className="text-zinc-400 text-lg">متأسفانه پرداخت شما انجام نشد</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-6">
              <p className="font-bold text-red-300 mb-2">دلیل خطا:</p>
              <p className="text-red-200">{getErrorMessage(error)}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6">
            <p className="font-bold text-yellow-300 mb-3">چه اتفاقی افتاد؟</p>
            <ul className="text-sm text-yellow-200 space-y-2">
              <li>• ممکن است پرداخت را لغو کرده باشید</li>
              <li>• موجودی کافی در حساب نبوده است</li>
              <li>• مشکلی در درگاه پرداخت رخ داده</li>
              <li>• اطلاعات کارت اشتباه وارد شده است</li>
            </ul>
          </div>

          {/* Order Info */}
          {orderId && (
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-5 mb-6 text-center">
              <p className="text-zinc-400">
                سفارش شما با شماره{' '}
                <span className="font-bold text-white">#{orderId}</span> ثبت شده اما پرداخت
                نشده است
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/checkout"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-6 py-4 rounded-2xl font-bold transition-all"
            >
              <ArrowLeft size={20} />
              تلاش مجدد
            </Link>

            <Link
              href="/cart"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-2xl font-bold transition-all"
            >
              <ShoppingCart size={20} />
              سبد خرید
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Home size={18} />
            بازگشت به صفحه اصلی
          </Link>

          {/* Support Note */}
          <div className="mt-8 text-center text-sm text-zinc-500 bg-zinc-900/30 border border-white/5 rounded-2xl p-4">
            💡 در صورت کسر وجه از حساب، ظرف ۷۲ ساعت به حساب شما برمی‌گردد
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}