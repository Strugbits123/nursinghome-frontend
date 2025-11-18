'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from '@/lib/api'
import { 
  LogIn, 
  UserPlus, 
  Building2, 
  Shield,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@carefinder.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSetup, setShowSetup] = useState(false)
  const [setupData, setSetupData] = useState({
    name: 'Admin User',
    email: 'admin@carefinder.com',
    password: 'admin123'
  })
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupSuccess, setSetupSuccess] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', { email, password })
      
      const response = await apiService.login(email, password)
      console.log('Login response:', response)
      
      // Store token and user info
      localStorage.setItem('adminToken', response.token)
      localStorage.setItem('adminUser', JSON.stringify({
        name: response.user.name,
        email: response.user.email,
        role: response.user.role
      }))
      
      console.log('Stored token, redirecting to dashboard...')
      
      // Force a hard navigation
      window.location.href = '/admin/dashboard'
      
    } catch (error: any) {
      console.error('Login error details:', error)
      setError(error.message || 'Invalid credentials')
      
      if (error.message.includes('not found') || error.message.includes('Invalid credentials')) {
        setShowSetup(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSetupLoading(true)
    setError('')

    try {
      console.log('Setting up admin with:', setupData)
      await apiService.setupAdmin(setupData.name, setupData.email, setupData.password)
      setSetupSuccess(true)
      
      setTimeout(() => {
        setShowSetup(false)
        setSetupSuccess(false)
        setEmail(setupData.email)
        setPassword(setupData.password)
      }, 1500)
    } catch (error: any) {
      console.error('Setup error details:', error)
      setError(error.message || 'Setup failed. Admin user may already exist.')
    } finally {
      setSetupLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#f3f4f6] bg-white p-8 shadow-2xl animate-in fade-in-90 zoom-in-95 z-[9999]">
        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              CareNav Admin
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Secure Administration Panel
            </p>
          </div>
        </div>

        {/* Setup Admin Form */}
        {showSetup && (
          <div className="mb-6 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 shadow-lg animate-in fade-in-90 slide-in-from-top-5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Setup Required</h3>
                <p className="text-amber-700 text-sm">
                  Create your admin account to get started
                </p>
              </div>
            </div>

            {setupSuccess ? (
              <div className="text-center py-6 animate-in fade-in-90">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-green-700 font-medium">Admin account created successfully!</p>
                <p className="text-green-600 text-sm mt-1">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSetupAdmin} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={setupData.name}
                      onChange={(e) => setSetupData({...setupData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={setupData.email}
                      onChange={(e) => setSetupData({...setupData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="admin@carefinder.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={setupData.password}
                      onChange={(e) => setSetupData({...setupData, password: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={setupLoading}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-amber-500/25"
                  >
                    {setupLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Admin Account'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSetup(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && !showSetup && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-3 animate-in fade-in-90 slide-in-from-top-5">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="admin@carefinder.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-red-500/25"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </div>
            )}
          </button>

          <div className="text-center">
            {/* <button
              type="button"
              onClick={() => setShowSetup(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 inline-flex items-center space-x-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Need to setup admin account?</span>
            </button> */}
          </div>

          {/* <div className="border-t border-gray-200 pt-4">
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p className="font-medium">Demo Credentials</p>
              <p>Email: admin@carefinder.com</p>
              <p>Password: admin123</p>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  )
}