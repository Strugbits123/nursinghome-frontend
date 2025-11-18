'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { apiService } from '@/lib/api'
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  Eye,
  TrendingUp,
  Save,
  X,
  Clock
} from 'lucide-react'
import RichTextEditor from '../../components/admin/RichTextEditor'

interface News {
  _id: string
  title: string
  summary: string
  content: string
  category: string
  author: string
  status: 'published' | 'draft'
  publishedAt?: string
  expiryDate?: string
  isFeatured: boolean
  tags: string[]
  views: number
  createdAt: string
  updatedAt: string
}

export default function NewsManagement() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'announcement',
    author: 'Admin',
    status: 'draft' as 'draft' | 'published',
    expiryDate: '',
    isFeatured: false,
    tags: [] as string[]
  })
  const [newTag, setNewTag] = useState('')

  const columns = [
    { 
      key: 'title', 
      label: 'Title',
      render: (value: string, row: News) => (
        <div className="flex items-center space-x-3">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Newspaper className="w-5 h-5 text-white" />
          </div> */}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate">{value}</p>
            {row.isFeatured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                Featured
              </span>
            )}
          </div>
        </div>
      )
    },
    { 
      key: 'summary', 
      label: 'Summary',
      render: (value: string) => (
        <p className="max-w-xs text-gray-600 text-sm line-clamp-2">{value}</p>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: string) => (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
          {value}
        </span>
      )
    },
    { 
      key: 'author', 
      label: 'Author',
      render: (value: string) => (
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="w-4 h-4" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            value === 'published' ? 'bg-green-500' : 'bg-amber-500'
          }`} />
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            value === 'published' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {value === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
      )
    },
    { 
      key: 'publishedAt', 
      label: 'Publish Date',
      render: (value: string) => (
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {value ? new Date(value).toLocaleDateString() : 'Not published'}
          </span>
        </div>
      )
    },
    { 
      key: 'views', 
      label: 'Views',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-900">{value.toLocaleString()}</span>
        </div>
      )
    }
  ]

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const response = await apiService.getNews()
      setNews(response.news || [])
    } catch (error) {
      console.error('Failed to load news:', error)
      alert('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title,
      summary: newsItem.summary,
      content: newsItem.content,
      category: newsItem.category,
      author: newsItem.author,
      status: newsItem.status,
      expiryDate: newsItem.expiryDate || '',
      isFeatured: newsItem.isFeatured || false,
      tags: newsItem.tags || []
    })
    setShowForm(true)
  }

  const handleDelete = async (newsItem: News) => {
    if (confirm(`Are you sure you want to delete "${newsItem.title}"?`)) {
      try {
        await apiService.deleteNews(newsItem._id)
        await loadNews()
        alert('News deleted successfully')
      } catch (error) {
        console.error('Failed to delete news:', error)
        alert('Failed to delete news')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const newsData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        status: formData.status,
        expiryDate: formData.expiryDate,
        isFeatured: formData.isFeatured,
        tags: formData.tags
      }

      if (editingNews) {
        await apiService.updateNews(editingNews._id, newsData)
        alert('News updated successfully')
      } else {
        await apiService.createNews(newsData)
        alert('News created successfully')
      }

      setShowForm(false)
      setEditingNews(null)
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: 'announcement',
        author: 'Admin',
        status: 'draft',
        expiryDate: '',
        isFeatured: false,
        tags: []
      })
      
      await loadNews()
    } catch (error) {
      console.error('Failed to save news:', error)
      alert('Failed to save news')
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center space-y-4 animate-in fade-in-90">
            <div className="w-16 h-16 border-4 border-[#c71f37] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <p className="text-gray-600 font-medium">Loading News</p>
              <p className="text-gray-400 text-sm">Fetching latest news articles...</p>
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
              News Management
            </h1>
            <p className="text-gray-600 text-lg">
              Create and manage news articles and announcements
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-[#a51a2f] hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-[#c71f37]/25 mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add News Article</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-[#f3f4f6] to-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total News</p>
                <p className="text-2xl font-bold text-gray-900">{news.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#f3f4f6] to-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {news.filter(item => item.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#f3f4f6] to-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {news.filter(item => item.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#f3f4f6] to-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {news.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl animate-in fade-in-90 zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-white" />
                </div> */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingNews ? 'Edit News Article' : 'Create News Article'}
                  </h2>
                  <p className="text-gray-600">
                    {editingNews ? 'Update your news content' : 'Write and publish breaking news'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingNews(null)
                  setFormData({
                    title: '',
                    summary: '',
                    content: '',
                    category: 'announcement',
                    author: 'Admin',
                    status: 'draft',
                    expiryDate: '',
                    isFeatured: false,
                    tags: []
                  })
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    News Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200"
                    placeholder="Enter news headline"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="regulation">Regulation</option>
                    <option value="partnership">Partnership</option>
                    <option value="event">Event</option>
                    <option value="update">Update</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Summary *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200"
                  placeholder="Brief summary of the news article"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200"
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tags
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-[#f3f4f6] text-gray-700 rounded-full text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-[#c71f37] transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-[#f3f4f6] rounded-xl">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-4 h-4 text-[#c71f37] border-gray-300 rounded focus:ring-[#c71f37]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                  Feature this news article (show as highlighted)
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Content *
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({...formData, content})}
                  placeholder="Write your blog content here..."
                  required
                />
                {/* <textarea
                  required
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:border-transparent transition-all duration-200 font-mono text-sm"
                  placeholder="Write your news content here... (Markdown supported)"
                /> */}
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-[#a51a2f] hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-[#c71f37] focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg shadow-[#c71f37]/25"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingNews ? 'Update News' : 'Publish News'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingNews(null)
                    setFormData({
                      title: '',
                      summary: '',
                      content: '',
                      category: 'announcement',
                      author: 'Admin',
                      status: 'draft',
                      expiryDate: '',
                      isFeatured: false,
                      tags: []
                    })
                  }}
                  className="inline-flex items-center space-x-2 px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-[#f3f4f6]">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              {/* <Newspaper className="w-5 h-5 text-blue-600" /> */}
              <span>All News Articles ({news.length})</span>
            </h3>
          </div>
          <DataTable
            columns={columns}
            data={news}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AdminLayout>
  )
}