import type {
  Product,
  Consumable,
  Order,
  OrderCreate,
  OrderCreateResponse,
  Payment,
  PaymentRequestResponse,
  User,
  LoginResponse,
  RegisterResponse,
  MessageResponse,
  ProfileUpdateResponse,
  PaginatedResponse,
} from '@/types'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

// ─── Helper ──────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'خطایی رخ داد' }))
    throw new Error(error.message || error.detail || 'خطایی رخ داد')
  }

  return response.json() as Promise<T>
}

// ─── Products ────────────────────────────────────────

export interface ProductFilters {
  product_type?: string
  material?: string
  category?: string
  search?: string
  ordering?: string
  is_featured?: boolean
  page?: number
  page_size?: number
}

export const getProducts = async (
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value))
    }
  })
  return fetchAPI<PaginatedResponse<Product>>(`/products/?${params}`)
}

export const getProduct = async (slug: string): Promise<Product> => {
  return fetchAPI<Product>(`/products/${slug}/`)
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const data = await getProducts({ is_featured: true, page_size: 8 })
  return data.results || []
}

// ─── Consumables ─────────────────────────────────────

export interface ConsumableFilters {
  consumable_type?: string
  filament_type?: string
  brand?: string
  color?: string
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}

export const getConsumables = async (
  filters: ConsumableFilters = {}
): Promise<PaginatedResponse<Consumable>> => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.append(key, String(value))
    }
  })
  return fetchAPI<PaginatedResponse<Consumable>>(`/consumables/?${params}`)
}

export const getConsumable = async (slug: string): Promise<Consumable> => {
  return fetchAPI<Consumable>(`/consumables/${slug}/`)
}

// ─── Auth ────────────────────────────────────────────

export const register = async (data: {
  phone: string
  password: string
  password_confirm: string
}): Promise<RegisterResponse> => {
  return fetchAPI<RegisterResponse>('/accounts/register/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const verifyRegister = async (data: {
  phone: string
  code: string
}): Promise<LoginResponse> => {
  return fetchAPI<LoginResponse>('/accounts/register/verify/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const login = async (data: {
  phone: string
  password: string
}): Promise<LoginResponse> => {
  return fetchAPI<LoginResponse>('/accounts/login/password/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const loginOTPRequest = async (data: {
  phone: string
}): Promise<RegisterResponse> => {
  return fetchAPI<RegisterResponse>('/accounts/login/otp/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const loginOTPVerify = async (data: {
  phone: string
  code: string
}): Promise<LoginResponse> => {
  return fetchAPI<LoginResponse>('/accounts/login/otp/verify/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const forgotPassword = async (data: {
  phone: string
}): Promise<RegisterResponse> => {
  return fetchAPI<RegisterResponse>('/accounts/password/forgot/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const resetPassword = async (data: {
  phone: string
  code: string
  new_password: string
  new_password_confirm: string
}): Promise<MessageResponse> => {
  return fetchAPI<MessageResponse>('/accounts/password/reset/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const changePassword = async (data: {
  old_password: string
  new_password: string
  new_password_confirm: string
}): Promise<MessageResponse> => {
  return fetchAPI<MessageResponse>('/accounts/password/change/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const logout = async (refresh: string): Promise<MessageResponse> => {
  return fetchAPI<MessageResponse>('/accounts/logout/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  })
}

// ─── Profile ─────────────────────────────────────────

export const getProfile = async (): Promise<User> => {
  return fetchAPI<User>('/accounts/profile/')
}

export const updateProfile = async (
  data: Partial<User>
): Promise<ProfileUpdateResponse> => {
  return fetchAPI<ProfileUpdateResponse>('/accounts/profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// ─── Orders ──────────────────────────────────────────

export const createOrder = async (
  data: OrderCreate
): Promise<OrderCreateResponse> => {
  return fetchAPI<OrderCreateResponse>('/orders/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const getOrders = async (): Promise<Order[]> => {
  return fetchAPI<Order[]>('/orders/')
}

export const getOrder = async (id: number): Promise<Order> => {
  return fetchAPI<Order>(`/orders/${id}/`)
}

export const trackOrder = async (
  orderId: number,
  phone: string
): Promise<Order> => {
  return fetchAPI<Order>(`/orders/${orderId}/track/?phone=${phone}`)
}

// ─── Payments ────────────────────────────────────────

export const requestPayment = async (
  orderId: number
): Promise<PaymentRequestResponse> => {
  return fetchAPI<PaymentRequestResponse>('/payments/request/', {
    method: 'POST',
    body: JSON.stringify({ order_id: orderId }),
  })
}

export const getPayments = async (): Promise<Payment[]> => {
  return fetchAPI<Payment[]>('/payments/')
}

export const getPayment = async (id: number): Promise<Payment> => {
  return fetchAPI<Payment>(`/payments/${id}/`)
}