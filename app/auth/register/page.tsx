'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register, verifyRegister } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState('input') // 'input' | 'verify'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    password_confirm: '',
    code: '',
  })
  
  // مرحله ۱: ثبت‌نام
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.password_confirm) {
      setError('رمز عبور و تکرار آن یکسان نیستند')
      return
    }
    
    if (formData.password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد')
      return
    }
    
    setLoading(true)
    
    try {
      await register({
        phone: formData.phone,
        password: formData.password,
        password_confirm: formData.password_confirm,
      })
      
      setStep('verify')
      alert('✅ کد تأیید برای شما ارسال شد')
    } catch (err) {
      setError(err.message || 'خطا در ثبت‌نام')
    } finally {
      setLoading(false)
    }
  }
  
  // مرحله ۲: تأیید OTP
  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const data = await verifyRegister({
        phone: formData.phone,
        code: formData.code,
      })
      
      localStorage.setItem('access_token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      alert('✅ ثبت‌نام با موفقیت انجام شد')
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
        <h2 className="text-3xl font-bold text-center mb-8">ثبت‌نام</h2>
        
        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'input' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {step === 'verify' ? '✓' : '1'}
          </div>
          <div className={`w-20 h-1 ${step === 'verify' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'verify' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-white'
          }`}>
            2
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* مرحله ۱: اطلاعات */}
        {step === 'input' && (
          <form onSubmit={handleRegister} className="space-y-4">
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
                placeholder="حداقل ۸ کاراکتر"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
                minLength={8}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">تکرار رمز عبور</label>
              <input
                type="password"
                placeholder="تکرار رمز عبور"
                value={formData.password_confirm}
                onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? 'در حال ارسال...' : 'ادامه'}
            </button>
          </form>
        )}
        
        {/* مرحله ۲: تأیید */}
        {step === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">کد تأیید</label>
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
              {loading ? 'در حال تأیید...' : 'تأیید و ثبت‌نام'}
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
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            ورود
          </Link>
        </div>
      </div>
    </div>
  )
}