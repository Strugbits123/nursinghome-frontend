'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Bed,
  Activity,
  X,
  Save,
  CheckCircle,
  XCircle,
  Calendar,
  Target,
  Eye,
  TrendingUp,
  Menu,
  MoreVertical
} from 'lucide-react'
import { apiService } from '@/lib/api'

interface SponsoredFacility {
  _id: string
  facility: {
    _id: string
    provider_name: string
    city_town: string
    state: string
    zip_code: string
    telephone_number?: string
    overall_rating?: string
  }
  title: string
  description: string
  startDate: string
  endDate: string
  isActive: boolean
  priority: number
  clicks: number
  impressions: number
  createdAt: string
}

export default function SponsoredFacilitiesManagement() {
  const [sponsoredFacilities, setSponsoredFacilities] = useState<SponsoredFacility[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFacility, setEditingFacility] = useState<SponsoredFacility | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 1,
    isActive: false
  })
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Fetch sponsored facilities using ApiService
  const fetchSponsoredFacilities = async () => {
    try {
      setLoading(true)
      const response = await apiService.getSponsoredFacilities()
      
      if (response.success) {
        setSponsoredFacilities(response.sponsoredFacilities || response.data || [])
      }
    } catch (error) {
      console.error('Error fetching sponsored facilities:', error)
      alert('Failed to load sponsored facilities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsoredFacilities()
  }, [])

  // Responsive columns
  const columns = [
    { 
      key: 'facility', 
      label: 'Facility',
      render: (value: SponsoredFacility['facility']) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Building2 className="w-3 h-3 md:w-5 md:h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-900 block text-sm md:text-base truncate">
              {value.provider_name}
            </span>
            <span className="text-xs md:text-sm text-gray-500 truncate">
              {value.city_town}, {value.state}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: 'title', 
      label: 'Title',
      render: (value: string) => (
        <span className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">
          {isMobile ? (value.length > 20 ? `${value.substring(0, 20)}...` : value) : value}
        </span>
      ),
      hideOnMobile: true
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (value: string) => (
        <span className="text-gray-600 line-clamp-2 text-xs md:text-sm max-w-xs">
          {isMobile ? (value.length > 30 ? `${value.substring(0, 30)}...` : value) : value}
        </span>
      ),
      hideOnMobile: true
    },
    { 
      key: 'startDate', 
      label: 'Start',
      render: (value: string) => (
        <div className="flex items-center space-x-1 md:space-x-2 text-gray-600">
          <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
          <span className="text-xs md:text-sm">
            {new Date(value).toLocaleDateString(isMobile ? undefined : 'en-US', {
              month: 'short',
              day: 'numeric',
              year: isMobile ? undefined : 'numeric'
            })}
          </span>
        </div>
      )
    },
    { 
      key: 'endDate', 
      label: 'End',
      render: (value: string) => (
        <div className="flex items-center space-x-1 md:space-x-2 text-gray-600">
          <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
          <span className="text-xs md:text-sm">
            {new Date(value).toLocaleDateString(isMobile ? undefined : 'en-US', {
              month: 'short',
              day: 'numeric',
              year: isMobile ? undefined : 'numeric'
            })}
          </span>
        </div>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (value: number) => (
        <div className="flex items-center space-x-1 md:space-x-2">
          <Target className="w-3 h-3 md:w-4 md:h-4 text-purple-500 flex-shrink-0" />
          <span className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-semibold ${
            value >= 8 ? 'bg-red-100 text-red-800' :
            value >= 5 ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
            {value}
          </span>
        </div>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value: boolean) => (
        <div className="flex items-center space-x-1 md:space-x-2">
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
            value ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-semibold ${
            value 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            {isMobile ? (value ? '✓' : '✗') : (value ? 'Active' : 'Inactive')}
          </span>
        </div>
      )
    },
    { 
      key: 'clicks', 
      label: 'Clicks',
      render: (value: number, row: SponsoredFacility) => (
        <div className="flex items-center space-x-1 md:space-x-2">
          <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-900 block text-xs md:text-sm">{value}</span>
            {!isMobile && (
              <span className="text-xs text-gray-500">
                {row.impressions > 0 ? `${((value / row.impressions) * 100).toFixed(1)}% CTR` : '0% CTR'}
              </span>
            )}
          </div>
        </div>
      ),
      hideOnMobile: true
    },
    { 
      key: 'impressions', 
      label: 'Views',
      render: (value: number) => (
        <div className="flex items-center space-x-1 md:space-x-2">
          <Eye className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
          <span className="font-semibold text-gray-900 text-xs md:text-sm">{value}</span>
        </div>
      ),
      hideOnMobile: true
    }
  ]

  // Filter columns for mobile
  const visibleColumns = isMobile 
    ? columns.filter(col => !col.hideOnMobile)
    : columns

  const handleEdit = (facility: SponsoredFacility) => {
    setEditingFacility(facility)
    setFormData({
      title: facility.title,
      description: facility.description,
      startDate: facility.startDate.split('T')[0],
      endDate: facility.endDate.split('T')[0],
      priority: facility.priority,
      isActive: facility.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (facility: SponsoredFacility) => {
    if (confirm(`Are you sure you want to delete sponsorship for "${facility.facility.provider_name}"?`)) {
      try {
        const response = await apiService.deleteSponsoredFacility(facility._id)
        
        if (response.success) {
          setSponsoredFacilities(sponsoredFacilities.filter(f => f._id !== facility._id))
          alert('Sponsorship deleted successfully')
        } else {
          alert('Failed to delete sponsorship')
        }
      } catch (error) {
        console.error('Error deleting sponsorship:', error)
        alert('Error deleting sponsorship')
      }
    }
  }

  const handleApprove = async (facility: SponsoredFacility) => {
    try {
      const response = await apiService.approveSponsorship(facility._id, 30)
      
      if (response.success) {
        fetchSponsoredFacilities()
        alert('Sponsorship approved successfully')
      } else {
        alert('Failed to approve sponsorship')
      }
    } catch (error) {
      console.error('Error approving sponsorship:', error)
      alert('Error approving sponsorship')
    }
  }

  const handleDeactivate = async (facility: SponsoredFacility) => {
    try {
      const response = await apiService.deactivateSponsorship(facility._id)
      
      if (response.success) {
        fetchSponsoredFacilities()
        alert('Sponsorship deactivated successfully')
      } else {
        alert('Failed to deactivate sponsorship')
      }
    } catch (error) {
      console.error('Error deactivating sponsorship:', error)
      alert('Error deactivating sponsorship')
    }
  }

  const handleViewDetails = (facility: SponsoredFacility) => {
    alert(`Viewing details for: ${facility.facility.provider_name}`)
  }

  // Responsive actions
  const actions = [
    {
      label: 'View',
      icon: Eye,
      onClick: handleViewDetails,
      className: 'text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50',
      showOnMobile: true
    },
    {
      label: 'Approve',
      icon: CheckCircle,
      onClick: handleApprove,
      condition: (facility: SponsoredFacility) => !facility.isActive,
      className: 'text-green-600 hover:text-green-800 border border-green-200 hover:bg-green-50',
      showOnMobile: true
    },
    {
      label: 'Deactivate',
      icon: XCircle,
      onClick: handleDeactivate,
      condition: (facility: SponsoredFacility) => facility.isActive,
      className: 'text-orange-600 hover:text-orange-800 border border-orange-200 hover:bg-orange-50',
      showOnMobile: true
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: handleEdit,
      className: 'text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50',
      showOnMobile: true
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50',
      showOnMobile: true
    }
  ]

  // Filter actions for mobile (show only icons)
  const visibleActions = isMobile 
    ? actions.map(action => ({ ...action, label: '' }))
    : actions

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let response

      if (editingFacility) {
        response = await apiService.updateSponsoredFacility(editingFacility._id, formData)
      } else {
        response = await apiService.createSponsoredFacility(formData)
      }
      
      if (response.success) {
        setShowForm(false)
        setEditingFacility(null)
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          priority: 1,
          isActive: false
        })
        fetchSponsoredFacilities()
        alert(editingFacility ? 'Sponsorship updated successfully' : 'Sponsorship created successfully')
      } else {
        alert(response.error || 'Failed to save sponsorship')
      }
    } catch (error) {
      console.error('Error saving sponsorship:', error)
      alert('Error saving sponsorship')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading sponsored facilities...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8 animate-in fade-in-90 slide-in-from-top-5 duration-500 p-4 md:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              Sponsored Facilities
            </h1>
            <p className="text-gray-600 text-sm md:text-lg">
              Manage sponsored facility listings and approvals
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-purple-500/25 mt-4 sm:mt-0 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-semibold text-sm md:text-base">Add Sponsorship</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl md:rounded-2xl border border-purple-100 p-4 md:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{sponsoredFacilities.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl md:rounded-2xl border border-green-100 p-4 md:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Active</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {sponsoredFacilities.filter(f => f.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl md:rounded-2xl border border-blue-100 p-4 md:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Clicks</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {sponsoredFacilities.reduce((sum, facility) => sum + facility.clicks, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl md:rounded-2xl border border-orange-100 p-4 md:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Views</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {sponsoredFacilities.reduce((sum, facility) => sum + facility.impressions, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-8 shadow-xl animate-in fade-in-90 zoom-in-95 fixed inset-4 md:inset-20 z-50 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Target className="w-3 h-3 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {editingFacility ? 'Edit Sponsorship' : 'Add Sponsorship'}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    {editingFacility ? 'Update sponsorship details' : 'Create new sponsored listing'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingFacility(null)
                  setFormData({
                    title: '',
                    description: '',
                    startDate: '',
                    endDate: '',
                    priority: 1,
                    isActive: false
                  })
                }}
                className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1 md:space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sponsorship Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter sponsorship title"
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Priority (1-10) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="1-10"
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-1 md:space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter sponsorship description"
                  />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">
                      Active Sponsorship
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4 md:pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg md:rounded-xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg shadow-purple-500/25"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingFacility ? 'Update' : 'Create'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingFacility(null)
                    setFormData({
                      title: '',
                      description: '',
                      startDate: '',
                      endDate: '',
                      priority: 1,
                      isActive: false
                    })
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-2 md:px-8 md:py-3 border border-gray-300 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sponsored Facilities Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#f3f4f6]">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Sponsored Facilities ({sponsoredFacilities.length})</span>
            </h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <DataTable
              columns={columns}
              data={sponsoredFacilities}
              actions={actions}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}