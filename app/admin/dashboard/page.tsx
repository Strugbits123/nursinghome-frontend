'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import { apiService } from '@/lib/api'
import {
  Users,
  Building2,
  FileText,
  Newspaper,
  TrendingUp,
  Activity,
  Calendar,
  Eye
} from 'lucide-react'

interface DashboardStats {
  stats: {
    totalUsers: number
    totalFacilities: number
    totalBlogs: number
    totalNews: number
    totalSponsored: number
    publishedBlogs: number
    publishedNews: number
    activeSponsored: number
  }
  recentActivities: {
    blogs: Array<{ title: string; status: string; createdAt: string; views?: number }>
    news: Array<{ title: string; status: string; createdAt: string; views?: number }>
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const data = await apiService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadDashboardStats()
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center space-y-4 animate-in fade-in-90">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <p className="text-gray-600 font-medium">Loading Dashboard</p>
              <p className="text-gray-400 text-sm">Getting the latest insights...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in-90 slide-in-from-top-5 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your platform today.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 mt-4 sm:mt-0"
          >
            <Activity className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Facilities"
                value={stats.stats.totalFacilities.toLocaleString()}
                icon={<Building2 className="w-6 h-6" />}
                change="+12% from last month"
                changeType="positive"
                gradient="from-blue-500 to-blue-600"
              />
              <StatsCard
                title="Total Users"
                value={stats.stats.totalUsers.toLocaleString()}
                icon={<Users className="w-6 h-6" />}
                change="+5.2% from last week"
                changeType="positive"
                gradient="from-green-500 to-green-600"
              />
              <StatsCard
                title="Blog Posts"
                value={stats.stats.totalBlogs.toLocaleString()}
                icon={<FileText className="w-6 h-6" />}
                change={`${stats.stats.publishedBlogs} published`}
                changeType="positive"
                gradient="from-purple-500 to-purple-600"
              />
              <StatsCard
                title="News Articles"
                value={stats.stats.totalNews.toLocaleString()}
                icon={<Newspaper className="w-6 h-6" />}
                change={`${stats.stats.publishedNews} published`}
                changeType="positive"
                gradient="from-orange-500 to-orange-600"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Recent Blog Posts */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Recent Blog Posts</span>
                  </h2>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {stats.recentActivities.blogs.map((blog, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100 hover:border-purple-200 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                          {blog.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            blog.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.status}
                          </span>
                          <span className="flex items-center space-x-1 text-gray-500 text-sm">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </span>
                          {blog.views && (
                            <span className="flex items-center space-x-1 text-gray-500 text-sm">
                              <Eye className="w-3 h-3" />
                              <span>{blog.views}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent News */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                    <Newspaper className="w-5 h-5 text-orange-600" />
                    <span>Recent News</span>
                  </h2>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {stats.recentActivities.news.map((news, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100 hover:border-orange-200 transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <Newspaper className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-orange-700 transition-colors">
                          {news.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                            news.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {news.status}
                          </span>
                          <span className="flex items-center space-x-1 text-gray-500 text-sm">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                          </span>
                          {news.views && (
                            <span className="flex items-center space-x-1 text-gray-500 text-sm">
                              <Eye className="w-3 h-3" />
                              <span>{news.views}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sponsored Facilities</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.activeSponsored}</p>
                    <p className="text-xs text-green-600 font-medium">Active now</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Published Blogs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.publishedBlogs}</p>
                    <p className="text-xs text-green-600 font-medium">Live content</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Newspaper className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Published News</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.publishedNews}</p>
                    <p className="text-xs text-green-600 font-medium">Latest updates</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}