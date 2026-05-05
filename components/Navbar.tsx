'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useCartStore from '@/store/cartStore'
import type { User } from '@/types'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const itemsCount = useCartStore((state) => state.getItemsCount())
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* لوگو */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            3DMart
          </Link>

          {/* منوی اصلی */}
          <div className="hidden md:flex gap-6">
            <Link href="/" className={pathname === '/' ? 'text-blue-600' : 'hover:text-blue-600'}>
              خانه
            </Link>
            <Link
              href="/products"
              className={pathname.startsWith('/products') ? 'text-blue-600' : 'hover:text-blue-600'}
            >
              محصولات
            </Link>
            <Link
              href="/consumables"
              className={pathname.startsWith('/consumables') ? 'text-blue-600' : 'hover:text-blue-600'}
            >
              مصرفی‌ها
            </Link>
          </div>

          {/* سبد و پروفایل */}
          <div className="flex gap-4 items-center">
            <Link href="/cart" className="relative">
              🛒
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  👤 <span className="text-sm">{user.first_name || 'کاربر'}</span>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    پروفایل
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    سفارش‌ها
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-right px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    خروج
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ورود
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}