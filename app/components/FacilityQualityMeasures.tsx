import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet, Zap, Gauge } from 'lucide-react';

// Utility function to format percentages safely
// FIX: Add explicit type annotation for 'value' as string or number
const formatPercentage = (value: string | number): string => {
    // Note: parseFloat handles both strings and numbers, but it's safer to ensure the input type.
    const num = parseFloat(value as string); 
    return isNaN(num) ? '' : `${num.toFixed(1)}%`;
};

// Custom Tooltip for bar chart
// FIX: Add type annotation for CustomTooltip props
interface CustomTooltipProps {
    active?: boolean;
    payload?: any[]; // Recharts payload type is complex, using 'any[]' for simplicity here
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        // Ensure payload[0].value is treated as a number before toFixed
        const value = payload[0].value;
        const percentage = typeof value === 'number' ? value.toFixed(1) : '';
        
        return (
            <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-lg font-sans">
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <p className="text-sm text-gray-600 mt-1">
                    Rate: <span className="font-semibold text-red-600">{percentage}%</span>
                </p>
            </div>
        );
    }
    return null;
};

// FIX: Add type for facility prop if possible, using 'any' as a placeholder for unknown structure
interface FacilityQualityMeasuresProps {
    facility: any; 
}

export default function FacilityQualityMeasures({ facility }: FacilityQualityMeasuresProps) {

    // --- Extract relevant data (removed short stay) ---
    const data = {
        qm_rating: parseFloat(facility?.qm_rating) * 20 || 0, // 1–5 → %
        long_stay_qm_rating: parseFloat(facility?.long_stay_qm_rating) * 20 || 0,
        nurse_turnover: parseFloat(facility?.total_nursing_staff_turnover) || 0, // already a %
    };

    // --- Chart Data (only 3 categories) ---
    const qualityData = [
        { category: 'QM Rating', percentage: data.qm_rating },
        { category: 'Long Stay QM Rating', percentage: data.long_stay_qm_rating },
        { category: 'Nurse Turnover', percentage: data.nurse_turnover },
    ];

    // --- Summary Metrics (only 3) ---
    const keyMetrics = [
        {
            label: 'Overall QM Rating',
            value: formatPercentage(data.qm_rating),
            icon: Gauge,
            color: 'text-blue-600',
        },
        {
            label: 'Long Stay QM Rating',
            value: formatPercentage(data.long_stay_qm_rating),
            icon: Droplet,
            color: 'text-purple-600',
        },
        {
            label: 'Total Nursing Staff Turnover',
            value: formatPercentage(data.nurse_turnover),
            icon: Zap,
            color: 'text-red-600',
        },
    ];

    const maxPercentage = Math.max(...qualityData.map(d => d.percentage)) || 0;
    const xAxisMaxDomain = Math.ceil(maxPercentage / 5) * 5;

    return (
        <div className="flex flex-col h-full w-full font-sans">
            
            {/* Bar Chart */}
            <div className="flex-grow w-full h-[240px] p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={qualityData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                        <YAxis
                            dataKey="category"
                            type="category"
                            tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 'medium' }}
                            axisLine={false}
                            tickLine={false}
                            width={150}
                        />
                        <XAxis
                            type="number"
                            domain={[0, Math.max(100, xAxisMaxDomain)]}
                            tickFormatter={(value) => `${value}%`}
                            tick={{ fill: '#4b5563', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="percentage"
                            fill="#ef4444"
                            barSize={25}
                            radius={[0, 8, 8, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Metrics */}
           <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <h4 className="font-semibold text-gray-800 mb-2">Key Quality Metrics:</h4>
                {keyMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 flex items-center font-medium">
                            <metric.icon className={`w-4 h-4 mr-2 ${metric.color} flex-shrink-0`} />
                            {metric.label}
                        </span>
                        <span className="font-semibold text-gray-900 flex-shrink-0">
                            {metric.value}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}