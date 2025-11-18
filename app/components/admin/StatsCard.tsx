import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: string
  changeType?: 'positive' | 'negative'
  gradient?: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'positive',
  gradient = 'from-red-500 to-red-600'
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`inline-flex items-center space-x-1 text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}