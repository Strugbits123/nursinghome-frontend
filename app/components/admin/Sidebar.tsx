'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  FileText,
  Newspaper,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react'

interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600'
    },
    {
      name: 'Facilities',
      href: '/admin/facilities',
      icon: Building2,
      color: 'text-green-600'
    },
    {
      name: 'Blogs',
      href: '/admin/blogs',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      name: 'News',
      href: '/admin/news',
      icon: Newspaper,
      color: 'text-orange-600'
    }
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-gray-200/60
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/60 bg-white/80">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center space-x-3 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield className="w-3 h-3 text-red-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  CareNav
                </span>
                <span className="text-xs text-gray-500 font-medium">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                      : 'text-gray-700 hover:bg-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    active 
                      ? 'bg-white/20' 
                      : `bg-gray-100 group-hover:bg-white group-hover:shadow-sm ${item.color}`
                  }`}>
                    <IconComponent className={`w-4 h-4 ${active ? 'text-white' : item.color}`} />
                  </div>
                  <span className={`font-medium transition-colors duration-200 ${
                    active ? 'text-white' : 'group-hover:text-gray-900'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200/60 bg-white/50">
            <div className="px-4 py-3 text-xs text-gray-500 bg-gray-50 rounded-lg mb-3">
              <div className="font-medium text-gray-700">Admin User</div>
              <div className="truncate">admin@carefinder.com</div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-200"
            >
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-200">
                <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}