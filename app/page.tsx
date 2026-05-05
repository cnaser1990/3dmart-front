import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            فروشگاه پرینت سه‌بعدی 3DMart
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            بهترین محصولات و مصرفی‌های پرینت سه‌بعدی
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50"
            >
              مشاهده محصولات
            </Link>
            <Link
              href="/consumables"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400"
            >
              مصرفی‌ها
            </Link>
          </div>
        </div>
      </section>

      {/* محصولات نمونه */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">محصولات ویژه</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl">
                🎨
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">محصول {i}</h3>
                <p className="text-blue-600 font-bold mb-3">
                  {(i * 100000).toLocaleString('fa-IR')} تومان
                </p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  افزودن به سبد
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© ۱۴۰۳ 3DMart. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
    </div>
  )
}