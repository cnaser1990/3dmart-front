'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useSyncExternalStore } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  User,
  Phone,
  Home,
  FileText,
  Truck,
  Weight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const SHIPPING_THRESHOLD_GRAMS = 500;
const SHIPPING_LIGHT = 100_000;
const SHIPPING_HEAVY = 150_000;

const getImageUrl = (path: string | null | undefined) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:8000${path}`;
};

function formatPrice(value: number) {
  return value.toLocaleString('fa-IR');
}

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  notes: string;
  paymentMethod: 'online' | 'pos' | 'cash';
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { items, getTotalItems, getTotalWeightGrams, clearCart } = useCart();
  const isHydrated = useHydrated();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    notes: '',
    paymentMethod: 'online',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItems = getTotalItems();
  const totalWeightGrams = getTotalWeightGrams();

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + (item.finalPrice || item.price || 0) * item.quantity,
      0
    );
  }, [items]);

  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    return totalWeightGrams < SHIPPING_THRESHOLD_GRAMS ? SHIPPING_LIGHT : SHIPPING_HEAVY;
  }, [items.length, totalWeightGrams]);

  const totalPrice = subtotal + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';


    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تماس الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'شماره موبایل معتبر نیست';
    }

    if (!formData.province.trim()) newErrors.province = 'استان الزامی است';
    if (!formData.city.trim()) newErrors.city = 'شهر الزامی است';
    if (!formData.address.trim()) newErrors.address = 'آدرس الزامی است';

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'کد پستی الزامی است';
    } else if (!/^\d{10}$/.test(formData.postalCode.replace(/\s/g, ''))) {
      newErrors.postalCode = 'کد پستی باید ۱۰ رقم باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          province: formData.province,
          city: formData.city,
          address: formData.address,
          postalCode: formData.postalCode,
        },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.finalPrice || item.price,
          isConsumable: item.isConsumable,
        })),
        subtotal,
        shippingCost,
        totalPrice,
        totalWeight: totalWeightGrams,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('خطا در ثبت سفارش');
      }

      const result = await response.json();

      clearCart();
      router.push(`/orders/${result.id}?success=true`);
    } catch (error) {
      console.error('Order submission error:', error);
      alert('خطا در ثبت سفارش. لطفا دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-20">
        <div className="border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
                خانه
              </Link>
              <span>/</span>
              <span className="text-white whitespace-nowrap">تسویه حساب</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">تسویه حساب</h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white pt-20">
        <div className="border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
                خانه
              </Link>
              <span>/</span>
              <span className="text-white whitespace-nowrap">تسویه حساب</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="max-w-3xl mx-auto bg-zinc-900/40 border border-white/10 rounded-3xl p-6 sm:p-10 text-center">
            <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ShoppingCart size={34} className="text-amber-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-3">سبد خرید خالی است</h2>
            <p className="text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto">
              برای ادامه فرآیند خرید، ابتدا محصولات موردنظر خود را به سبد خرید اضافه کنید.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/25"
            >
              <ShoppingCart size={18} />
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-20">
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-7xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">
              خانه
            </Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-white transition-colors whitespace-nowrap">
              سبد خرید
            </Link>
            <span>/</span>
            <span className="text-white whitespace-nowrap">تسویه حساب</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              تسویه حساب
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-2">
              اطلاعات خود را وارد کنید و سفارش را نهایی کنید
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-bold w-fit"
          >
            <ArrowLeft size={18} />
            بازگشت به سبد خرید
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Customer Information */}
              <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <User size={20} className="text-violet-400" />
                  </div>
                  <h2 className="text-xl font-black">اطلاعات شخصی</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold mb-2">
                      نام <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${
                        errors.firstName ? 'border-rose-500' : 'border-white/10'
                      } rounded-2xl focus:outline-none focus:border-violet-500 transition-colors`}
                      placeholder="نام خود را وارد کنید"
                    />
                    {errors.firstName && (
                      <p className="text-rose-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold mb-2">
                      نام خانوادگی <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${
                        errors.lastName ? 'border-rose-500' : 'border-white/10'
                      } rounded-2xl focus:outline-none focus:border-violet-500 transition-colors`}
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                    {errors.lastName && (
                      <p className="text-rose-400 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold mb-2">
                      شماره موبایل <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pr-12 bg-zinc-950 border ${
                          errors.phone ? 'border-rose-500' : 'border-white/10'
                        } rounded-2xl focus:outline-none focus:border-violet-500 transition-colors`}
                        placeholder="09123456789"
                        dir="ltr"
                      />
                    </div>
                    {errors.phone && <p className="text-rose-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <MapPin size={20} className="text-cyan-400" />
                  </div>
                  <h2 className="text-xl font-black">آدرس تحویل</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="province" className="block text-sm font-bold mb-2">
                      استان <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${
                        errors.province ? 'border-rose-500' : 'border-white/10'
                      } rounded-2xl focus:outline-none focus:border-violet-500 transition-colors`}
                      placeholder="مثال: تهران"
                    />
                    {errors.province && (
                      <p className="text-rose-400 text-xs mt-1">{errors.province}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-bold mb-2">
                      شهر <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${
                        errors.city ? 'border-rose-500' : 'border-white/10'
                      } rounded-2xl focus:outline-none focus:border-violet-500 transition-colors`}
                      placeholder="مثال: تهران"
                    />
                    {errors.city && <p className="text-rose-400 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-bold mb-2">
                      آدرس کامل <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${
                        errors.address ? 'border-rose-500' : 'border-white/10'
                      } rounded-2xl focus:outline-none focus:border-violet-500 transition-colors resize-none`}
                      placeholder="آدرس دقیق خود را وارد کنید"
                    />
                    {errors.address && (
                      <p className="text-rose-400 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-bold mb-2">
                      کد پستی <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-zinc-950 border ${
                        errors.postalCode ? 'border-rose-500' : 'border-white/10'
                      } rounded-2xl focus:outline-none focus:border-violet-500 transition-colors`}
                      placeholder="1234567890"
                      dir="ltr"
                      maxLength={10}
                    />
                    {errors.postalCode && (
                      <p className="text-rose-400 text-xs mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>

      

              {/* Order Notes */}
              <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <FileText size={20} className="text-amber-400" />
                  </div>
                  <h2 className="text-xl font-black">توضیحات سفارش (اختیاری)</h2>
                </div>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-950 border border-white/10 rounded-2xl focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  placeholder="توضیحات خود درباره سفارش را اینجا بنویسید..."
                />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6">
                  <h2 className="text-xl font-black mb-5">سفارش شما</h2>

                  <div className="space-y-3 mb-5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-950/50 border border-white/5"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                          {item.image ? (
                            <Image
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home size={24} className="text-zinc-700" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm line-clamp-1">{item.name}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">
                            {item.quantity} عدد × {formatPrice(item.finalPrice || item.price || 0)}{' '}
                            تومان
                          </div>
                        </div>

                        <div className="font-black text-sm" suppressHydrationWarning>
                          {formatPrice((item.finalPrice || item.price || 0) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">تعداد کالا</span>
                      <span className="font-bold" suppressHydrationWarning>
                        {totalItems} عدد
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">جمع جزء</span>
                      <span className="font-bold" suppressHydrationWarning>
                        {formatPrice(subtotal)} تومان
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">هزینه ارسال</span>
                      <span className="font-bold" suppressHydrationWarning>
                        {formatPrice(shippingCost)} تومان
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Weight size={12} />
                        <span>وزن کل</span>
                      </div>
                      <span suppressHydrationWarning>
                        {totalWeightGrams >= 1000
                          ? `${(totalWeightGrams / 1000).toFixed(2)} کیلو`
                          : `${totalWeightGrams} گرم`}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-lg font-black">مبلغ نهایی</span>
                      <span
                        className="text-2xl font-black text-violet-400"
                        suppressHydrationWarning
                      >
                        {formatPrice(totalPrice)} تومان
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-violet-500/10 border border-violet-500/15">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Truck size={18} className="text-violet-300" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">ارسال سریع</div>
                      <div className="text-[11px] text-zinc-400">
                        {totalWeightGrams < SHIPPING_THRESHOLD_GRAMS
                          ? 'ارسال معمولی'
                          : 'ارسال سنگین'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/15">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} className="text-cyan-300" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">تضمین اصالت</div>
                      <div className="text-[11px] text-zinc-400">کیفیت تضمین شده</div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      در حال ثبت...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
پرداخت                        </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}