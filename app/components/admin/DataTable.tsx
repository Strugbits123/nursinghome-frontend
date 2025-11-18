import { Edit, Trash2 } from 'lucide-react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface Action {
  label: string
  icon?: React.ComponentType<any>
  onClick: (item: any) => void
  condition?: (item: any) => boolean
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  actions?: Action[]
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
}

export default function DataTable({ columns, data, actions, onEdit, onDelete }: DataTableProps) {
  const hasActions = actions && actions.length > 0 || onEdit || onDelete

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* Custom actions */}
                      {actions && actions.map((action, actionIndex) => {
                        if (action.condition && !action.condition(row)) {
                          return null
                        }
                        const IconComponent = action.icon
                        return (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md transition-colors duration-200 ${action.className || 'text-blue-600 hover:text-blue-900'}`}
                            title={action.label}
                          >
                            {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
                            {action.label}
                          </button>
                        )
                      })}
                      
                      {/* Legacy edit/delete buttons for backward compatibility */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  )
}