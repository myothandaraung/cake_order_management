import { api } from './api'
import {
  AdminUser, AuditLog, Cake, CakeFlavor, CakeSize, Category, CreateAdminUserRequest, CreateCakeRequest,
  Customer, CustomerDetail, DashboardMetrics, Favorite, Order, PageResponse, ReferenceRequest, Topping, UpdateAdminUserRequest, UpdateCakeFlagsRequest, UpdateCakeRequest, UpdateOrderStatusRequest, UploadedFile
} from '@/types'

export const categoriesService = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: ReferenceRequest) => api.post<Category>('/categories', data),
  update: (id: string, data: ReferenceRequest) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

export const sizesService = {
  getAll: () => api.get<CakeSize[]>('/cake-sizes'),
  create: (data: ReferenceRequest) => api.post<CakeSize>('/cake-sizes', data),
  update: (id: number, data: ReferenceRequest) => api.put<CakeSize>(`/cake-sizes/${id}`, data),
  delete: (id: number) => api.delete(`/cake-sizes/${id}`),
}

export const flavorsService = {
  getAll: () => api.get<CakeFlavor[]>('/cake-flavors'),
  create: (data: ReferenceRequest) => api.post<CakeFlavor>('/cake-flavors', data),
  update: (id: string, data: ReferenceRequest) => api.put<CakeFlavor>(`/cake-flavors/${id}`, data),
  delete: (id: string) => api.delete(`/cake-flavors/${id}`),
}

export const toppingsService = {
  getAll: () => api.get<Topping[]>('/toppings'),
  create: (data: ReferenceRequest) => api.post<Topping>('/toppings', data),
  update: (id: string, data: ReferenceRequest) => api.put<Topping>(`/toppings/${id}`, data),
  delete: (id: string) => api.delete(`/toppings/${id}`),
}

export const cakesService = {
  getAll: (params?: any) => api.get<PageResponse<Cake>>('/cakes', { params }),
  get: (id: string) => api.get<Cake>(`/cakes/${id}`),
  create: (data: CreateCakeRequest) => api.post<Cake>('/cakes', data),
  update: (id: string, data: UpdateCakeRequest) => api.put<Cake>(`/cakes/${id}`, data),
  delete: (id: string) => api.delete(`/cakes/${id}`),
  updateFlags: (id: string, data: UpdateCakeFlagsRequest) => api.patch<Cake>(`/cakes/${id}/flags`, data),
}

export const ordersService = {
  getAll: (params?: any) => api.get<PageResponse<Order>>('/orders', { params }),
  get: (id: string) => api.get<Order>(`/orders/${id}`),
  updateStatus: (id: string, data: UpdateOrderStatusRequest) => api.patch<Order>(`/orders/${id}/status`, data),
  update: (id: string, data: any) => api.put<Order>(`/orders/${id}`, data),
  cancel: (id: string, reason: string) => api.post<Order>(`/orders/${id}/cancel`, { reason }),
}

export const customersService = {
  getAll: (params?: any) => api.get<PageResponse<Customer>>('/customers', { params }),
  get: (id: string) => api.get<CustomerDetail>(`/customers/${id}`),
  getOrders: (id: string) => api.get<Order[]>(`/customers/${id}/orders`),
  getFavorites: (id: string) => api.get<Favorite[]>(`/customers/${id}/favorites`),
}

export const adminUsersService = {
  getAll: (params?: any) => api.get<PageResponse<AdminUser>>('/admin-users', { params }),
  create: (data: CreateAdminUserRequest) => api.post<AdminUser>('/admin-users', data),
  update: (id: string, data: UpdateAdminUserRequest) => api.patch<AdminUser>(`/admin-users/${id}`, data),
  delete: (id: string) => api.delete(`/admin-users/${id}`),
}

export const auditService = {
  getAll: (params?: any) => api.get<PageResponse<AuditLog>>('/audit', { params }),
}

export const dashboardService = {
  getMetrics: (params?: any) => api.get<DashboardMetrics>('/dashboard/metrics', { params }),
  getRecentOrders: (limit = 10) => api.get<Order[]>(`/dashboard/recent-orders`, { params: { limit } }),
  getOrdersByStatus: (params?: any) => api.get<Record<string, number>>('/dashboard/orders-by-status', { params }),
  getTopCakes: (params?: any) => api.get<any[]>('/dashboard/top-cakes', { params }),
}

export const filesService = {
  /** Uploads an image to Supabase Storage and returns its public URL. */
  upload: (
    file: File,
    options?: { folder?: string; onProgress?: (percent: number) => void },
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<UploadedFile>('/files', formData, {
      params: options?.folder ? { folder: options.folder } : undefined,
      onUploadProgress: (event) => {
        if (!options?.onProgress || !event.total) return
        options.onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)))
      },
    })
  },
}

export const reportsService = {
  exportSalesCsv: (params?: any) => api.get('/reports/sales.csv', { params, responseType: 'blob' }),
  exportOrdersCsv: (params?: any) => api.get('/reports/orders.csv', { params, responseType: 'blob' }),
}
