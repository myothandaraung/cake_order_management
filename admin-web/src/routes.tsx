import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import CakesPage from './pages/CakesPage'
import CakeFormPage from './pages/CakeFormPage'
import CategoriesPage from './pages/CategoriesPage'
import SizesPage from './pages/SizesPage'
import FlavorsPage from './pages/FlavorsPage'
import ToppingsPage from './pages/ToppingsPage'
import CustomersPage from './pages/CustomersPage'
import CustomerDetailPage from './pages/CustomerDetailPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AuditLogPage from './pages/AuditLogPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Role } from './types/auth'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'orders',
        children: [
          { index: true, element: <OrdersPage /> },
          { path: ':id', element: <OrderDetailPage /> },
        ],
      },
      {
        path: 'cakes',
        children: [
          { index: true, element: <CakesPage /> },
          { path: 'new', element: <CakeFormPage /> },
          { path: ':id', element: <CakeFormPage /> },
        ],
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'sizes',
        element: <SizesPage />,
      },
      {
        path: 'flavors',
        element: <FlavorsPage />,
      },
      {
        path: 'toppings',
        element: <ToppingsPage />,
      },
      {
        path: 'customers',
        children: [
          { index: true, element: <CustomersPage /> },
          { path: ':id', element: <CustomerDetailPage /> },
        ],
      },
      {
        path: 'admin-users',
        element: (
          <ProtectedRoute requiredRoles={[Role.ADMIN]}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'audit',
        element: (
          <ProtectedRoute requiredRoles={[Role.ADMIN]}>
            <AuditLogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])
