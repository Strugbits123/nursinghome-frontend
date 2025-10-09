import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users, ArrowDownUp } from 'lucide-react'; // Icons for the metrics


interface FacilityStaffingData {
    rnHprd: number;
    lpnHprd: number;
    aideHprd: number;
    totalNurseHprd: number;
    rnTurnover: number;
    totalNurseTurnover: number;
    // Note: avg_resident_census is still missing, see Solution 2 below.
}


interface StaffingLevelsChartProps {
    facility: any; 
}

const formatHPRD = (value: string | number | undefined): string => {
    const num = parseFloat(String(value || 0));
    return isNaN(num) ? 'N/A' : num.toFixed(2);
};

const formatPercentage = (value: string | number | undefined): string => {
    const num = parseFloat(String(value || 0));
    return isNaN(num) ? 'N/A' : `${num.toFixed(1)}%`;
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        // payload[0].value contains the 'hours' dataKey value
        return (
            <div className="p-2 bg-white border border-gray-300 rounded shadow-md text-sm">
                <p className="font-semibold text-gray-700 mb-1">{label}</p>
                <p className="text-red-500">{`${payload[0].value.toFixed(2)} hours (HPRD)`}</p>
            </div>
        );
    }
    return null;
};

/**
 * StaffingLevelsChart Component
 * Displays staffing hours per resident day (HPRD) as a bar chart.
 * Also includes key staffing metrics below the chart.
 * @param {StaffingLevelsChartProps} props - The component props.
 */
const StaffingLevelsChart = ({ facility }: StaffingLevelsChartProps) => {
    
    // Fallback to empty object if facility is undefined for safety
    const safeFacility = facility || {};

    const staffingData = [
        { 
            category: 'RN', 
            hours: parseFloat(safeFacility.reported_rn_staffing_hours_per_resident_per_day as string || '0') 
        },
        { 
            category: 'LPN', 
            hours: parseFloat(safeFacility.reported_lpn_staffing_hours_per_resident_per_day as string || '0') 
        },
        { 
            category: 'CNA/NA', 
            hours: parseFloat(safeFacility.reported_nurse_aide_staffing_hours_per_resident_per_day as string || '0') 
        },
    ];
    
    // --- Key Metrics Data ---
    const keyMetrics = [
        { 
            label: 'Total Nurse HPRD', 
            value: formatHPRD(safeFacility.reported_total_nurse_staffing_hours_per_resident_per_day), 
            icon: Clock, 
            color: 'text-blue-600' // Adjusted to a darker shade for better contrast
        },
        { 
            label: 'Total Nurse Turnover Rate', 
            value: formatPercentage(safeFacility.total_nursing_staff_turnover), 
            icon: ArrowDownUp, 
            color: 'text-indigo-600' 
        },
        { 
            label: 'Resident Census', 
            value: safeFacility.avg_resident_census || 'N/A', 
            icon: Users, 
            color: 'text-green-600' 
        },
    ];

    return (
        <div className="flex flex-col h-full w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Staffing Levels (Hours per Resident Day)</h3>

            <div className="flex-grow w-full h-[300px] p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={staffingData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }} 
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        
                        <XAxis 
                            dataKey="category" 
                            tick={{ fill: '#4b5563', fontSize: 14, fontWeight: 'medium' }}
                            axisLine={true}
                            tickLine={false}
                        />
                        
                        <YAxis
                            label={{ 
                                value: 'Hours per Resident Day', 
                                angle: -90, 
                                position: 'insideLeft', 
                                fill: '#4b5563',
                                style: { textAnchor: 'middle', fontSize: '12px' }
                            }}
                            tick={{ fill: '#4b5563', fontSize: 12 }}
                            domain={[0, 'auto']} 
                        />
                        
                        <Tooltip content={<CustomTooltip />} />
                        
                        <Bar 
                            dataKey="hours" 
                            fill="#ef4444" // Bright red for strong visibility
                            barSize={35}
                            radius={[8, 8, 0, 0]} // Rounded top corners
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-2">Key Staffing Metrics:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {keyMetrics.map((metric, index) => (
                        <div key={index} className="flex flex-col items-start p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
                            <div className={`flex items-center mb-1 ${metric.color}`}>
                                <metric.icon className={`w-5 h-5 mr-2 flex-shrink-0`}/>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{metric.label}</span>
                            </div>
                            <span className="text-2xl font-extrabold text-gray-900">
                                {metric.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffingLevelsChart;
