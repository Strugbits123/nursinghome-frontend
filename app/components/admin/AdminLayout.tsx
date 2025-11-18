'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
      } else {
        setIsAuthenticated(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 lg:ml-20">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}