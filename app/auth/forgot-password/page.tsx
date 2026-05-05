'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { forgotPassword, resetPassword } from '@/lib/api'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    new_password: '',
    new_password_confirm: '',
  })

  // مرحله ۱: درخواست کد
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await forgotPassword({ phone: formData.phone })
      setStep('verify')
      alert('✅ کد بازیابی برای شما ارسال شد')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
  }

  // مرحله ۲: تأیید و تغییر رمز
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.new_password !== formData.new_password_confirm) {
      setError('رمز عبور و تکرار آن یکسان نیستند')
      return
    }

    if (formData.new_password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد')
      return
    }

    setLoading(true)

    try {
      await resetPassword({
        phone: formData.phone,
        code: formData.code,
        new_password: formData.new_password,
        new_password_confirm: formData.new_password_confirm,
      })

      alert('✅ رمز عبور با موفقیت تغییر کرد')
      router.push('/auth/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در تغییر رمز عبور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8">بازیابی رمز عبور</h2>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'input' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {step === 'verify' ? '✓' : '1'}
          </div>
          <div className={`w-20 h-1 ${step === 'verify' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'verify' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-white'
            }`}
          >
            2
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* مرحله ۱: شماره موبایل */}
        {step === 'input' && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">شماره موبایل</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="09123456789"
                dir="ltr"
              />
              <p className="text-sm text-gray-600 mt-2">
                کد بازیابی به این شماره ارسال می‌شود
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
            >
              {loading ? 'در حال ارسال...' : 'ارسال کد'}
            </button>
          </form>
        )}

        {/* مرحله ۲: کد و رمز جدید */}
        {step === 'verify' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">کد بازیابی</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123456"
                maxLength={6}
                dir="ltr"
              />
              <p className="text-sm text-gray-600 mt-2">
                کد به شماره {formData.phone} ارسال شد
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رمز عبور جدید</label>
              <input
                type="password"
                required
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="حداقل ۸ کاراکتر"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">تکرار رمز عبور</label>
              <input
                type="password"
                required
                value={formData.new_password_confirm}
                onChange={(e) =>
                  setFormData({ ...formData, new_password_confirm: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="تکرار رمز عبور"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition"
            >
              {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </button>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="w-full text-blue-600 hover:text-blue-700"
            >
              ← بازگشت
            </button>
          </form>
        )}

        {/* لینک ورود */}
        <div className="mt-6 text-center text-sm">
          رمز عبور خود را به خاطر آوردید؟{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            ورود
          </Link>
        </div>
      </div>
    </div>
  )
}