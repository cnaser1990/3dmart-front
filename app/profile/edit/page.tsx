'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getProfile, updateProfile } from '@/lib/api'
import Loading from '@/components/Loading'
import type { User } from '@/types'

function EditProfileContent() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    birth_date: '',
    bio: '',
    national_code: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getProfile()
      setUser(data)
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        gender: data.gender || '',
        birth_date: data.birth_date || '',
        bio: data.bio || '',
        national_code: data.national_code || '',
      })
    } catch (err) {
      setError('خطا در بارگذاری پروفایل')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const response = await updateProfile(formData)
      setSuccess('✅ اطلاعات با موفقیت بروزرسانی شد')
      
      // بروزرسانی localStorage
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بروزرسانی')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (!user) return <div>خطا در بارگذاری</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            ← بازگشت
          </button>
          <h1 className="text-3xl font-bold">ویرایش پروفایل</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* آواتار */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
              {user.avatar_url ? (
                <Image src={user.avatar_url} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-6xl">👤</div>
              )}
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => alert('قابلیت آپلود تصویر به زودی...')}
            >
              تغییر تصویر
            </button>
          </div>

          {/* پیام‌ها */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* فیلدها */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">نام</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="علی"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">نام خانوادگی</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="احمدی"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ایمیل</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">کد ملی</label>
            <input
              type="text"
              value={formData.national_code}
              onChange={(e) => setFormData({ ...formData, national_code: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234567890"
              maxLength={10}
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">جنسیت</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">انتخاب کنید</option>
                <option value="M">مرد</option>
                <option value="F">زن</option>
                <option value="N">ترجیح می‌دهم نگویم</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">تاریخ تولد</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">بیوگرافی</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={300}
              placeholder="درباره خودتان بنویسید..."
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.bio.length}/300 کاراکتر
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
            >
              {saving ? 'در حال ذخیره...' : '💾 ذخیره تغییرات'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfileContent />
    </ProtectedRoute>
  )
}