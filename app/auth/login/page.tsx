'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, loginOTPRequest, loginOTPVerify } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [method, setMethod] = useState('password') // 'password' | 'otp'
  const [step, setStep] = useState('input') // 'input' | 'verify'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    code: '',
  })
  
  // ورود با پسورد
  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const data = await login({
        phone: formData.phone,
        password: formData.password,
      })
      
      // ذخیره توکن
      localStorage.setItem('access_token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      alert('✅ ورود موفق')
      router.push('/profile')
    } catch (err) {
      setError(err.message || 'خطا در ورود')
    } finally {
      setLoading(false)
    }
  }
  
  // درخواست OTP
  const handleOTPRequest = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      await loginOTPRequest({ phone: formData.phone })
      setStep('verify')
      alert('✅ کد برای شما ارسال شد')
    } catch (err) {
      setError(err.message || 'خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
  }
  
  // تأیید OTP
  const handleOTPVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const data = await loginOTPVerify({
        phone: formData.phone,
        code: formData.code,
      })
      
      localStorage.setItem('access_token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      alert('✅ ورود موفق')
      router.push('/profile')
    } catch (err) {
      setError(err.message || 'کد وارد شده صحیح نیست')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8">ورود به حساب کاربری</h2>
        
        {/* تب‌ها */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMethod('password')}
            className={`flex-1 py-2 rounded-lg font-medium ${
              method === 'password'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            با رمز عبور
          </button>
          <button
            onClick={() => setMethod('otp')}
            className={`flex-1 py-2 rounded-lg font-medium ${
              method === 'otp'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            با کد یکبار مصرف
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* فرم ورود با پسورد */}
        {method === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">شماره موبایل</label>
              <input
                type="tel"
                placeholder="09123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">رمز عبور</label>
              <input
                type="password"
                placeholder="رمز عبور"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
            
            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                فراموشی رمز عبور
              </Link>
            </div>
          </form>
        )}
        
        {/* فرم ورود با OTP */}
        {method === 'otp' && step === 'input' && (
          <form onSubmit={handleOTPRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">شماره موبایل</label>
              <input
                type="tel"
                placeholder="09123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
                dir="ltr"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? 'در حال ارسال...' : 'ارسال کد'}
            </button>
          </form>
        )}
        
        {/* تأیید OTP */}
        {method === 'otp' && step === 'verify' && (
          <form onSubmit={handleOTPVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">کد ارسال شده</label>
              <input
                type="text"
                placeholder="123456"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 text-center text-2xl tracking-widest"
                required
                maxLength={6}
                dir="ltr"
              />
              <p className="text-sm text-gray-600 mt-2">
                کد به شماره {formData.phone} ارسال شد
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? 'در حال تأیید...' : 'تأیید و ورود'}
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
        
        {/* لینک ثبت‌نام */}
        <div className="mt-6 text-center text-sm">
          حساب کاربری ندارید؟{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
            ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  )
}