'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getProfile, logout } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import Loading from '@/components/Loading'
import type { User } from '@/types'

function ProfileContent() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getProfile()
      setUser(data)
    } catch (err) {
      console.error(err)
      alert('خطا در بارگذاری پروفایل')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!confirm('آیا می‌خواهید خارج شوید؟')) return

    try {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        await logout(refresh)
      }
    } catch (err) {
      console.error(err)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      router.push('/')
    }
  }

  if (loading) return <Loading />
  if (!user) return <div>خطا در بارگذاری</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">پروفایل من</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* منوی سمت راست */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* آواتار */}
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">👤</div>
                )}
              </div>
              <h3 className="font-bold text-lg">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.phone}
              </h3>
              <p className="text-sm text-gray-600">{user.phone}</p>
            </div>

            {/* منو */}
            <nav className="space-y-2">
              <Link
                href="/profile"
                className="block px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
              >
                📋 اطلاعات حساب
              </Link>
              <Link
                href="/profile/edit"
                className="block px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                ✏️ ویرایش پروفایل
              </Link>
              <Link
                href="/profile/orders"
                className="block px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                📦 سفارش‌ها
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-right px-4 py-2 rounded-lg hover:bg-red-50 text-red-600"
              >
                🚪 خروج
              </button>
            </nav>
          </div>
        </div>

        {/* محتوای اصلی */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">اطلاعات حساب کاربری</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">نام:</div>
                  <div className="font-medium">
                    {user.first_name || <span className="text-gray-400">تنظیم نشده</span>}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">نام خانوادگی:</div>
                  <div className="font-medium">
                    {user.last_name || <span className="text-gray-400">تنظیم نشده</span>}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">شماره موبایل:</div>
                <div className="font-medium flex items-center gap-2">
                  {user.phone}
                  {user.phone_verified && <span className="text-green-600 text-sm">✓ تأیید شده</span>}
                </div>
              </div>

              {user.email && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">ایمیل:</div>
                  <div className="font-medium flex items-center gap-2">
                    {user.email}
                    {user.email_verified && <span className="text-green-600 text-sm">✓ تأیید شده</span>}
                  </div>
                </div>
              )}

              {user.national_code && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">کد ملی:</div>
                  <div className="font-medium">{user.national_code}</div>
                </div>
              )}

              {user.gender && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">جنسیت:</div>
                  <div className="font-medium">
                    {user.gender === 'M' ? 'مرد' : user.gender === 'F' ? 'زن' : 'نامشخص'}
                  </div>
                </div>
              )}

              {user.birth_date && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">تاریخ تولد:</div>
                  <div className="font-medium">{formatDate(user.birth_date)}</div>
                </div>
              )}

              {user.bio && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">بیوگرافی:</div>
                  <div className="font-medium">{user.bio}</div>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <div className="text-sm text-gray-600 mb-1">تاریخ عضویت:</div>
                <div className="font-medium">{formatDate(user.date_joined)}</div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/profile/edit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
              >
                ✏️ ویرایش اطلاعات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}