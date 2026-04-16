import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Login from '../views/Login'
import Dashboard from '../views/dashboard'
import Category from '../views/category'
import Dish from '../views/dish'
import Order from '../views/order'
import Reservation from '../views/reservation'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'category', element: <Category /> },
      { path: 'dish', element: <Dish /> },
      { path: 'order', element: <Order /> },
      { path: 'reservation', element: <Reservation /> },
    ],
  },
])

export default router
