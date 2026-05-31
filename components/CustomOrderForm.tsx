'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Sparkles, Send, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface CustomOrderFormProps {
  id?: string;
}

export default function CustomOrderForm({ id }: CustomOrderFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/store/custom-order/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ full_name: '', phone: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorMsg = 
          data.phone?.[0] || 
          data.message?.[0] || 
          data.full_name?.[0] || 
          data.message || 
          'خطایی رخ داد. لطفا دوباره تلاش کنید.';
        setError(errorMsg);
      }
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={id} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative overflow-hidden scroll-mt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#27272a_0%,transparent_70%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-fuchsia-600/10 blur-[80px] sm:blur-[100px] rounded-full" />

      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-3 sm:mb-4">
            <Sparkles className="text-fuchsia-400" size={16} />
            <span className="font-bold text-xs sm:text-sm text-white/90">سفارش سفارشی</span>
          </div>
          
          {/* Responsive Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 leading-tight px-2">
            محصول خودتون رو سفارش بدید!
          </h2>
          
          {/* Responsive Subtitle */}
          <p className="text-zinc-400 text-sm sm:text-base lg:text-lg px-4">
            ایده‌تون رو با ما به اشتراک بذارید، ما بسازیمش
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Success Message */}
          {success && (
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl sm:rounded-2xl text-emerald-400">
              <CheckCircle2 size={20} className="shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-xs sm:text-sm font-bold">
                درخواست شما با موفقیت ثبت شد! به زودی با شما تماس می‌گیریم.
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl sm:rounded-2xl text-rose-400 text-xs sm:text-sm font-bold">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 text-white">
              نام و نام خانوادگی <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-950 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none focus:border-violet-500 transition-colors text-white placeholder:text-zinc-500"
              placeholder="نام خود را وارد کنید"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 text-white">
              شماره موبایل <span className="text-rose-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              dir="ltr"
              maxLength={11}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-950 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none focus:border-violet-500 transition-colors text-white placeholder:text-zinc-500"
              placeholder="09123456789"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2 text-white">
              توضیحات سفارش <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              minLength={10}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-zinc-950 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none focus:border-violet-500 transition-colors resize-none text-white placeholder:text-zinc-500"
              placeholder="جزئیات محصولی که می‌خواهید رو توضیح بدید... (حداقل 10 کاراکتر)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl sm:rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>در حال ارسال...</span>
              </>
            ) : (
              <>
                <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>ارسال درخواست</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}