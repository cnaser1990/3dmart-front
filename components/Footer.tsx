import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* درباره */}
          <div>
            <h3 className="font-bold text-lg mb-4">3DMart</h3>
            <p className="text-gray-400 text-sm">
              فروشگاه تخصصی محصولات و مصرفی‌های پرینت سه‌بعدی
            </p>
          </div>

          {/* لینک‌های مفید */}
          <div>
            <h4 className="font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/consumables" className="text-gray-400 hover:text-white">
                  مصرفی‌ها
                </Link>
              </li>
            </ul>
          </div>

          {/* حساب کاربری */}
          <div>
            <h4 className="font-bold mb-4">حساب کاربری</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-white">
                  پروفایل
                </Link>
              </li>
              <li>
                <Link href="/profile/orders" className="text-gray-400 hover:text-white">
                  سفارش‌ها
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white">
                  سبد خرید
                </Link>
              </li>
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h4 className="font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📞 ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>📧 info@3dmart.ir</li>
              <li>📍 تهران، خیابان ولیعصر</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© ۱۴۰۳ 3DMart. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}