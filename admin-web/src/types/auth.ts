export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: Role
  isActive: boolean
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  user: AdminUser
}

export interface LoginRequest {
  email: string
  password: string
}
