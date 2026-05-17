// types/index.ts

// ─── Product ─────────────────────────────────────────

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  category_type: string;
  image?: string;
  is_active: boolean;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  product_type: string;
  material?: string;
  description?: string;
  short_description?: string;
  price: number;
  discount_percent: number;
  final_price: number;
  stock: number;
  preparation_time_days: number;
  is_active: boolean;
  is_available: boolean;
  is_featured: boolean;
  availability_text: string;
  primary_image?: string;
  images?: ProductImage[];
  category?: Category;
  tags?: Tag[];
  print_time_hours?: number;
  weight_grams?: number;
  brand?: string;
  created_at: string;
}

// ─── Consumable ──────────────────────────────────────

export type PriceHistory = {
  price: number;
  recorded_at: string;
};

export type Consumable = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  color: string;
  color_hex: string;
  consumable_type: 'filament' | 'resin';
  filament_type: 'pla' | 'abs' | 'petg' | 'tpu' | 'asa' | 'none';
  weight_kg: string;
  description?: string;
  image?: string;
  selling_price: number | null;
  stock: number;
  last_crawled_at: string | null;
  price_history?: PriceHistory[];
};

// ─── Cart ─────────────────────────────────────────────

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  price: number;
  finalPrice: number;
  image?: string;
  quantity: number;
  stock: number;
  preparationTimeDays: number;
  weightGrams: number;
  brand?: string;
  isConsumable: boolean;
  type: 'product' | 'consumable';
}

// ─── Order ───────────────────────────────────────────

export interface OrderItem {
  id: number;
  product?: Product;
  consumable?: Consumable;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user?: number;
  status: string;
  status_display?: string;
  full_name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  total_price: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
  tracking_code?: string;
  notes?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderCreateItem {
  product_id?: number;
  consumable_id?: number;
  quantity: number;
}

export interface OrderCreate {
  full_name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  notes?: string;
  items: OrderCreateItem[];
}

export interface OrderCreateResponse {
  message: string;
  order_id: number;
  final_amount: number;
  shipping_fee: number;
}

// ─── Payment ─────────────────────────────────────────

export interface Payment {
  id: number;
  user_phone: string;
  order_id: number;
  gateway: string;
  gateway_display: string;
  amount: number;
  status: string;
  status_display: string;
  authority?: string;
  ref_id?: string;
  card_pan?: string;
  description?: string;
  created_at: string;
  paid_at?: string;
}

export interface PaymentRequestResponse {
  message: string;
  payment_id: number;
  payment_url: string;
  authority: string;
}

// ─── User ────────────────────────────────────────────

export interface User {
  id: number;
  phone: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  birth_date?: string;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
  national_code?: string;
  is_verified: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  message: string;
  tokens: AuthTokens;
  user: User;
}

export interface RegisterResponse {
  message: string;
  phone: string;
}

export interface MessageResponse {
  message: string;
}

export interface ProfileUpdateResponse {
  message: string;
  user: User;
}

// ─── API ─────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}