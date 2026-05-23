// app/faq/page.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Package, Truck, CreditCard, RefreshCw, ShieldCheck } from 'lucide-react';

type FAQ = {
  question: string;
  answer: string;
  icon: React.ReactNode;
};

const faqs: FAQ[] = [
  {
    question: 'چگونه سفارش ثبت کنم؟',
    answer: 'محصول مورد نظر را انتخاب کنید، تعداد را مشخص کرده و به سبد خرید اضافه کنید. سپس از طریق صفحه سبد خرید، اطلاعات خود را وارد کرده و سفارش را نهایی کنید.',
    icon: <Package size={18} className="text-violet-400" />,
  },
  {
    question: 'زمان تحویل سفارش چقدر است؟',
    answer: 'محصولات موجود در انبار ظرف ۲-۳ روز کاری ارسال می‌شوند. محصولاتی که نیاز به پرینت دارند، بر اساس زمان آماده‌سازی ذکر شده در صفحه محصول (معمولاً ۳-۷ روز کاری) تولید و ارسال می‌شوند.',
    icon: <Truck size={18} className="text-cyan-400" />,
  },
  {
    question: 'روش‌های پرداخت چیست؟',
    answer: 'پرداخت از طریق درگاه بانکی امن با کلیه کارت‌های عضو شتاب امکان‌پذیر است.  ',
    icon: <CreditCard size={18} className="text-emerald-400" />,
  },
  {
    question: 'آیا امکان بازگشت کالا وجود دارد؟',
    answer:  'خیر. به دلیل ماهیت محصولات سفارشی و مواد مصرفی، امکان بازگشت کالا وجود ندارد. لطفاً قبل از ثبت سفارش، توضیحات محصول را با دقت مطالعه کنید و در صورت نیاز با پشتیبانی تماس بگیرید.',
    icon: <RefreshCw size={18} className="text-amber-400" />,
  },
  {
    question: 'هزینه ارسال چقدر است؟',
    answer: 'هزینه ارسال بر اساس وزن محصول و آدرس مقصد محاسبه می‌شود.',
    icon: <Truck size={18} className="text-rose-400" />,
  },
  {
    question: 'گارانتی محصولات چگونه است؟',
    answer: 'تمامی محصولات از نظر کیفیت پرینت و جنس مواد اولیه تضمین شده‌اند. در صورت بروز هرگونه مشکل، با پشتیبانی تماس بگیرید.',
    icon: <ShieldCheck size={18} className="text-fuchsia-400" />,
  },
  {
    question: 'آیا می‌توانم طرح خودم را سفارش دهم؟',
    answer: 'بله! از طریق بخش "سفارش محصول سفارشی" فایل STL خود را ارسال کنید یا طرح مورد نظرتان را توضیح دهید. تیم ما قیمت و زمان تولید را اعلام خواهد کرد.',
    icon: <Package size={18} className="text-indigo-400" />,
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-500/30">
            <HelpCircle size={32} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">سوالات متداول</h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            پاسخ سوالات رایج درباره خرید، ارسال و پشتیبانی
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-zinc-900/60 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-violet-500/30"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-right transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    {faq.icon}
                  </div>
                  <span className="font-bold text-white text-sm sm:text-base">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-zinc-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}