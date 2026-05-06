// ─── قیمت ────────────────────────────────────────────

export function formatPrice(price?: number): string {
  if (!price && price !== 0) return '۰'
  return new Intl.NumberFormat('fa-IR').format(price)
}

// ─── تاریخ ───────────────────────────────────────────

export function formatDate(date?: string): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fa-IR')
}

// ─── متن ─────────────────────────────────────────────

export function truncate(text?: string, length: number = 100): string {
  if (!text || text.length <= length) return text || ''
  return text.substring(0, length) + '...'
}

// ─── اعتبارسنجی ──────────────────────────────────────

export function isValidIranianPhone(phone: string): boolean {
  const pattern = /^(\+98|0)?9\d{9}$/
  return pattern.test(phone)
}

export function isValidNationalCode(code: string): boolean {
  if (!code || code.length !== 10) return false
  const check = parseInt(code[9])
  const sum = code
    .split('')
    .slice(0, 9)
    .reduce(
      (acc, digit, index) => acc + parseInt(digit) * (10 - index),
      0
    )
  const remainder = sum % 11
  return (
    (remainder < 2 && check === remainder) ||
    (remainder >= 2 && check === 11 - remainder)
  )
}

// ─── موبایل ──────────────────────────────────────────

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('98')) return `+${cleaned}`
  if (cleaned.startsWith('0')) return `+98${cleaned.slice(1)}`
  return `+98${cleaned}`
}

// ─── className ───────────────────────────────────────

export function cn(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(' ')
}

// ─── Storage ─────────────────────────────────────────

interface StorageValue {
  [key: string]: unknown
}

export const storage = {
  get: <T,>(key: string): T | null => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch {
      return null
    }
  },

  set: (key: string, value: StorageValue | string | number | boolean): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      console.error('Error saving to localStorage')
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}

// ─── Auth ─────────────────────────────────────────────

export const auth = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('access_token')
  },

  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('access_token')
  },

  setTokens: (access: string, refresh: string): void => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  },

  logout: (): void => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },
}