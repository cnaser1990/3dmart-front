import axios, { AxiosInstance } from 'axios';
import { 
  Product, 
  Consumable, 
  Order, 
  OrderCreate, 
  OrderCreateResponse,
  User,
  LoginResponse,
  RegisterResponse,
  MessageResponse,
  ProfileUpdateResponse,
  PaginatedResponse 
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── جلوگیری از چند refresh همزمان ──────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Request Interceptor ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('refresh token وجود ندارد');

        const { data } = await axios.post(`${BASE_URL}/accounts/token/refresh/`, {
          refresh,
        });

        const newAccessToken = data.access;
        localStorage.setItem('access_token', newAccessToken);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════
// API FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// ─── Products ────────────────────────────────────────

export async function getProducts(params?: {
  search?: string;
  product_type?: string;
  material?: string;
  category?: string;
  is_featured?: boolean;
  ordering?: string;
  page?: number;
}): Promise<PaginatedResponse<Product>> {
  const { data } = await api.get('/store/products/', { params });
  return data;
}

export async function getProduct(slug: string): Promise<Product> {
  const { data } = await api.get(`/store/products/${slug}/`);
  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await api.get('/store/products/featured/');
  return data.results ?? data;
}

// ─── Consumables ─────────────────────────────────────

export async function getConsumables(params?: {
  search?: string;
  consumable_type?: string;
  filament_type?: string;
  brand?: string;
  color?: string;
  ordering?: string;
  page?: number;
}): Promise<PaginatedResponse<Consumable>> {
  const { data } = await api.get('/store/consumables/', { params });
  return data;
}

export async function getConsumable(slug: string): Promise<Consumable> {
  const { data } = await api.get(`/store/consumables/${slug}/`);
  return data;
}

// ─── Orders ──────────────────────────────────────────

export async function createOrder(orderData: OrderCreate): Promise<OrderCreateResponse> {
  const { data } = await api.post('/store/orders/', orderData);
  return data;
}

export async function trackOrder(orderId: number, phone: string): Promise<Order> {
  const { data } = await api.get(`/store/orders/${orderId}/track/`, {
    params: { phone },
  });
  return data;
}

// ─── Auth ────────────────────────────────────────────

export async function registerRequest(phone: string, password: string): Promise<RegisterResponse> {
  const { data } = await api.post('/accounts/register/', {
    phone,
    password,
    password_confirm: password,
  });
  return data;
}

export async function registerVerify(phone: string, code: string): Promise<LoginResponse> {
  const { data } = await api.post('/accounts/register/verify/', { phone, code });
  return data;
}

export async function loginPassword(phone: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/accounts/login/password/', { phone, password });
  return data;
}

export async function loginOTPRequest(phone: string): Promise<MessageResponse> {
  const { data } = await api.post('/accounts/login/otp/', { phone });
  return data;
}

export async function loginOTPVerify(phone: string, code: string): Promise<LoginResponse> {
  const { data } = await api.post('/accounts/login/otp/verify/', { phone, code });
  return data;
}

export async function resendOTP(phone: string, purpose: 'register' | 'login' | 'reset_password'): Promise<MessageResponse> {
  const { data } = await api.post('/accounts/otp/resend/', { phone, purpose });
  return data;
}

export async function forgotPassword(phone: string): Promise<MessageResponse> {
  const { data } = await api.post('/accounts/password/forgot/', { phone });
  return data;
}

export async function resetPassword(
  phone: string,
  code: string,
  new_password: string
): Promise<MessageResponse> {
  const { data } = await api.post('/accounts/password/reset/', {
    phone,
    code,
    new_password,
    new_password_confirm: new_password,
  });
  return data;
}

export async function logout(refreshToken: string): Promise<MessageResponse> {
  const { data } = await api.post('/accounts/logout/', { refresh: refreshToken });
  return data;
}

// ─── Profile ─────────────────────────────────────────

export async function getProfile(): Promise<User> {
  const { data } = await api.get('/accounts/profile/');
  return data;
}

export async function updateProfile(userData: Partial<User>): Promise<ProfileUpdateResponse> {
  const { data } = await api.patch('/accounts/profile/', userData);
  return data;
}

export async function changePassword(
  old_password: string,
  new_password: string
): Promise<MessageResponse> {
  const { data } = await api.post('/accounts/password/change/', {
    old_password,
    new_password,
    new_password_confirm: new_password,
  });
  return data;
}

export async function deleteAccount(password: string): Promise<MessageResponse> {
  const { data } = await api.delete('/accounts/delete/', { data: { password } });
  return data;
}