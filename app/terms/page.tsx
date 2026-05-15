// app/terms/page.tsx
import Link from 'next/link';
import { FileText, ShieldCheck, Package, CreditCard, Truck, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-500/30">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">قوانین و مقررات</h1>
        </div>

        {/* Content */}
        <div className="space-y-8">

          {/* Section 1 */}
          <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-violet-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black">۱. کلیات</h2>
            </div>
            <div className="text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                با استفاده از خدمات فروشگاه 3DMart، شما قوانین و مقررات زیر را می‌پذیرید. لطفاً قبل از ثبت سفارش، این قوانین را به دقت مطالعه کنید.
                این فروشگاه به صورت تخصصی در زمینه پرینت سه‌بعدی، فروش محصولات اکشن فیگور، فانکو پاپ، دکوری و مواد مصرفی پرینتر فعالیت می‌کند.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Package size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black">۲. ثبت سفارش و موجودی</h2>
            </div>
            <div className="text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li>محصولات موجود در انبار بلافاصله پس از پرداخت رزرو می‌شوند.</li>
                <li>محصولاتی که موجودی ندارند پس از تأیید سفارش تولید (پرینت) می‌شوند.</li>
                <li>زمان آماده‌سازی محصولات سفارشی در صفحه محصول قید شده و از ۳ تا ۱۰ روز کاری متغیر است.</li>
                <li>تعداد سفارش محدودیتی ندارد، حتی اگر بیشتر از موجودی باشد برای شما تولید می‌شود.</li>
                <li>قیمت مواد مصرفی به صورت خودکار بروزرسانی می‌شود و ممکن است تغییر کند.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <CreditCard size={20} className="text-cyan-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black">۳. پرداخت</h2>
            </div>
            <div className="text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li>پرداخت از طریق درگاه امن بانکی (کلیه کارت‌های عضو شتاب).</li>
                <li>قیمت نهایی شامل هزینه پست است که با توجه به وزن محصولات به صورت نقریبی محاسبه می شود.</li>
                <li>پس از پرداخت موفق، کد پیگیری برای شما ارسال می‌شود.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Truck size={20} className="text-amber-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black">۴. ارسال و تحویل</h2>
            </div>
            <div className="text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li>مدت زمان تحویل: ۲-۳ روز کاری برای کالاهای موجود.</li>
                <li>هزینه ارسال بر اساس وزن و مقصد محاسبه می‌شود.</li>
                <li>خریدار موظف است هنگام تحویل، بسته را بررسی و در صورت آسیب فیزیکی تحویل نگیرد.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-rose-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black">۵. ضمانت و بازگشت کالا</h2>
            </div>
            <div className="text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li>ضمانت کیفیت پرینت و جنس مواد اولیه.</li>
                <li>محصولات سفارشی (custom) قابل بازگشت نیستند مگر در صورت نقص.</li>
                <li>هزینه ارسال بازگشت کالا (در صورت نقص فروشنده) بر عهده فروشگاه است.</li>
                <li>برای بازگشت باید محصول در بسته‌بندی اصلی و سالم باشد.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} className="text-fuchsia-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black">۶. حریم خصوصی</h2>
            </div>
            <div className="text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                اطلاعات شخصی شما (نام، شماره تماس، آدرس) تنها برای پردازش و ارسال سفارش استفاده می‌شود و با هیچ شخص ثالثی به اشتراک گذاشته نمی‌شود.
                ما از امنیت داده‌های شما حفاظت می‌کنیم و از پروتکل‌های امنیتی معتبر استفاده می‌کنیم.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black">۷. سایر موارد</h2>
            </div>
            <div className="text-zinc-400 text-sm sm:text-base leading-relaxed space-y-3">
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li>فروشگاه حق تغییر قوانین و قیمت‌ها را بدون اطلاع قبلی دارد.</li>
                <li>برای سفارشات عمده (بالای ۱۰ عدد) با پشتیبانی تماس بگیرید.</li>
                <li>استفاده از تصاویر و محتوای سایت بدون اجازه ممنوع است.</li>
                <li>تمامی اختلافات در حوزه قضایی تهران قابل رسیدگی است.</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Footer CTA */}
        <div className="mt-10 sm:mt-14 text-center bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-6 sm:p-8">
          <h3 className="font-black text-lg sm:text-xl mb-2">سوالی دارید؟</h3>
          <p className="text-zinc-400 text-sm sm:text-base mb-5">
            برای اطلاعات بیشتر با پشتیبانی تماس بگیرید
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all text-sm"
            >
              سوالات متداول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}