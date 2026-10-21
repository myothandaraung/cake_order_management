import { Role } from './auth'

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface CakeSize {
  id: number
  label: string
  extraPrice: number
  basePrice?: number
}

export interface CakeFlavor {
  id: string
  name: string
  extraPrice: number
}

export interface Topping {
  id: string
  name: string
  extraPrice: number
}

export interface Cake {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  rating?: number
  categoryId: string
  isPopular: boolean
  isNewArrival: boolean
  tags?: string
  isArchived: boolean
  createdAt: string
}

export interface CreateCakeRequest {
  name: string
  description: string
  imageUrl: string
  price: number
  categoryId: string
  isPopular?: boolean
  isNewArrival?: boolean
  tags?: string
}

export interface UpdateCakeRequest {
  name?: string
  description?: string
  imageUrl?: string
  price?: number
  categoryId?: string
  isPopular?: boolean
  isNewArrival?: boolean
  tags?: string
}

export interface UpdateCakeFlagsRequest {
  isPopular: boolean
  isNewArrival: boolean
}

export interface Order {
  id: string
  orderNumber: number
  orderDate: string
  deliveryDate: string
  deliveryAddress: string
  subtotal: number
  deliveryFee: number
  total: number
  status: string
  paymentMethod: string
  userId: string
  createdAt: string
  updatedAt: string
  items?: any[]
}

export interface UpdateOrderStatusRequest {
  status: string
  note?: string
}

export interface UpdateOrderRequest {
  deliveryDate?: string
  deliveryAddress?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl: string
  createdAt: string
}

export interface Address {
  id: string
  userId: string
  label: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean | null
}

export interface Favorite {
  id: string
  userId: string
  cakeId: string
}

export interface CustomerDetail {
  profile: Customer
  addresses: Address[]
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: Role
  isActive: boolean
  createdAt: string
}

export interface CreateAdminUserRequest {
  email: string
  password: string
  name: string
  role: Role
}

export interface UpdateAdminUserRequest {
  role?: Role
  isActive?: boolean
}

export interface AuditLog {
  id: string
  adminUserId: string | null
  adminUserName: string | null
  entityType: string
  entityId: string
  action: string
  createdAt: string
}

export interface DashboardMetrics {
  revenue: number
  orderCount: number
  avgOrderValue: number
  newCustomers: number
}

export interface TopCake {
  cakeId: string
  cakeName: string
  quantity: number
  revenue: number
}

export interface ReferenceRequest {
  name: string
  slug?: string
  label?: string
  basePrice?: number
  extraPrice?: number
}
