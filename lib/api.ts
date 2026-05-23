// lib/api.ts

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
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'خطای سرور' }));
    throw new Error(error.detail || error.message || 'خطای ناشناخته');
  }
  return response.json();
}

export async function getProducts(params?: {
  category?: number;
  search?: string;
  page?: number;
}): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category.toString());
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', params.page.toString());

  const url = `${API_URL}/store/products/${query.toString() ? `?${query}` : ''}`;
  const response = await fetch(url, { cache: 'no-store' });
  return handleResponse<PaginatedResponse<Product>>(response);
}

export async function getProduct(slug: string): Promise<Product> {
  const response = await fetch(`${API_URL}/store/products/${slug}/`, {
    cache: 'no-store',
  });
  return handleResponse<Product>(response);
}

export async function getConsumables(params?: {
  consumable_type?: string;
  search?: string;
  page?: number;
}): Promise<PaginatedResponse<Consumable>> {
  const query = new URLSearchParams();
  if (params?.consumable_type) query.set('consumable_type', params.consumable_type);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', params.page.toString());

  const url = `${API_URL}/store/consumables/${query.toString() ? `?${query}` : ''}`;
  const response = await fetch(url, { cache: 'no-store' });
  return handleResponse<PaginatedResponse<Consumable>>(response);
}

export async function getConsumable(slug: string): Promise<Consumable> {
  const response = await fetch(`${API_URL}/store/consumables/${slug}/`, {
    cache: 'no-store',
  });
  return handleResponse<Consumable>(response);
}

export async function createOrder(data: OrderCreate): Promise<OrderCreateResponse> {
  const response = await fetch(`${API_URL}/orders/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse<OrderCreateResponse>(response);
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<Order[]>(response);
}

export async function getOrder(id: number): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}/`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<Order>(response);
}

export async function requestPayment(orderId: number): Promise<PaymentRequestResponse> {
  const response = await fetch(`${API_URL}/payments/request/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ order_id: orderId }),
  });
  return handleResponse<PaymentRequestResponse>(response);
}

export async function verifyPayment(authority: string): Promise<Payment> {
  const response = await fetch(`${API_URL}/payments/verify/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ authority }),
  });
  return handleResponse<Payment>(response);
}

export async function getPayments(): Promise<Payment[]> {
  const response = await fetch(`${API_URL}/payments/`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<Payment[]>(response);
}

export async function login(phone: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  const data = await handleResponse<LoginResponse>(response);

  if (typeof window !== 'undefined' && data.tokens) {
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
  }

  return data;
}

export async function register(phone: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/accounts/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  return handleResponse<RegisterResponse>(response);
}

export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export async function getProfile(): Promise<User> {
  const response = await fetch(`${API_URL}/accounts/profile/`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<User>(response);
}

export async function updateProfile(data: Partial<User>): Promise<ProfileUpdateResponse> {
  const response = await fetch(`${API_URL}/accounts/profile/update/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return handleResponse<ProfileUpdateResponse>(response);
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<MessageResponse> {
  const response = await fetch(`${API_URL}/accounts/change-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });
  return handleResponse<MessageResponse>(response);
}

export async function resetPassword(phone: string): Promise<MessageResponse> {
  const response = await fetch(`${API_URL}/accounts/reset-password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return handleResponse<MessageResponse>(response);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export async function refreshToken(): Promise<void> {
  if (typeof window === 'undefined') return;

  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) throw new Error('No refresh token');

  const response = await fetch(`${API_URL}/accounts/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await handleResponse<{ access: string }>(response);
  localStorage.setItem('access_token', data.access);
}