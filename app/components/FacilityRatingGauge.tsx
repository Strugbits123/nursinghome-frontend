import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Star } from 'lucide-react';
import React from 'react';

// 1. Define the type for the facility data used in this component
interface FacilityData {
    overall_rating?: string | number;
    health_inspection_rating?: string | number;
    staffing_rating?: string | number;
    quality_measure_rating?: string | number;
    qm_rating?: string | number;
}

// 2. Define the props interface for the component
interface FacilityRatingGaugeProps {
    facility: FacilityData; // Explicitly type the facility prop
}

// Utility to determine the color based on a 1-5 star rating
const getColorByRating = (rating: number): string => {
    if (rating >= 4) return '#10B981'; // Green (Excellent)
    if (rating >= 3) return '#F59E0B'; // Yellow (Good)
    if (rating >= 2) return '#F97316'; // Orange (Fair)
    return '#EF4444'; // Red (Poor)
};

/**
 * FacilityRatingGauge Component
 * Displays CMS overall star rating as a semi-circle gauge,
 * along with sub-metrics (Health, Staffing, Quality Measures).
 *
 * NOTE: This component assumes it is being placed INSIDE a card component 
 * that provides the necessary padding and background.
 * @param {FacilityRatingGaugeProps} props - The component props.
 */
const FacilityRatingGauge = ({ facility }: FacilityRatingGaugeProps) => {
    // Check for facility data before rendering
    if (!facility) {
        return <div className="text-center p-8 text-gray-500">Loading rating data...</div>;
    }

    // --- Data Mapping from Facility Prop ---

    // The CMS star ratings are strings ("1", "2", "5"), so we convert them to numbers.
    const overallScore = parseFloat(facility.overall_rating as string || '0'); 
    
    const OVERALL_RATING_DATA = {
        score: overallScore,
        max: 5.0,
        metrics: [
            { 
                name: 'Health Inspections', 
                score: parseFloat(facility.health_inspection_rating as string || '0'), 
                max: 5 
            },
            { 
                name: 'Staffing', 
                score: parseFloat(facility.staffing_rating as string || '0'), 
                max: 5 
            },
            { 
                name: 'Quality Measures', 
                // Using 'qm_rating' as per your data structure
                score: parseFloat(facility.qm_rating as string || '0'), 
                max: 5 
            },
        ]
    };

    // Determine color for the gauge score
    const gaugeColor = getColorByRating(OVERALL_RATING_DATA.score);


    // Data formatted for the Recharts RadialBarChart
    const gaugeData = [
        // 1. Background (gray bar) - render first so it's under the score
        { 
            name: 'Remaining', 
            // The value is the max (5.0)
            value: OVERALL_RATING_DATA.max, 
            fill: '#e5e7eb', // Light Gray (gray-200)
            fillOpacity: 0.8
        },
        // 2. Score (colored bar) - render second so it's on top of the background
        { 
            name: 'Overall Rating', 
            value: OVERALL_RATING_DATA.score,
            fill: gaugeColor, // Use dynamic color
        },
    ];

    // Domain for the PolarAngleAxis (0 to 5.0)
    const domain = [0, OVERALL_RATING_DATA.max];

    // --- Component Render ---
    return (
        // Renders only the content, no outer card structure.
        <div className="flex flex-col h-full w-full">
            
            {/* Chart Container: Flexible height for the chart area */}
            <div className="flex-grow w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                        cx="50%" 
                        cy="70%" 
                        innerRadius="70%" 
                        outerRadius="100%" 
                        barSize={30}
                        data={gaugeData}
                        startAngle={180} // Start at 180 (left)
                        endAngle={0} // End at 0 (right) for a semi-circle
                    >
                        
                        {/* PolarAngleAxis is used only to show the min/max labels (0 and 5.0) */}
                        <PolarAngleAxis 
                            type="number"
                            domain={domain}
                            angleAxisId={0}
                            tick={({ x, y, payload }) => (
                                <text 
                                    x={x} 
                                    y={y} 
                                    textAnchor={payload.value === 0 ? 'start' : 'end'} 
                                    fill="#4b5563"
                                    fontSize={14}
                                    fontWeight="bold"
                                >
                                    {payload.value.toFixed(1)}
                                </text>
                            )}
                        />
                        
                        {/* Render the two bars: the background and the score */}
                        <RadialBar 
                            dataKey="value" 
                            cornerRadius={15} 
                            isAnimationActive={false}
                        />

                        {/* Central Text Overlay for the Score */}
                        <text 
                            x="50%" 
                            y="75%" 
                            textAnchor="middle" 
                            fill="#1f2937" 
                            className="font-extrabold"
                        >
                            <tspan 
                                x="50%" 
                                dy="-0.5em" 
                                style={{ fontSize: '2.5rem', fill: gaugeColor }}
                            >
                                {OVERALL_RATING_DATA.score.toFixed(1)}
                            </tspan>
                            <tspan 
                                x="50%" 
                                dy="1.5em" 
                                style={{ fontSize: '1rem', fill: '#6b7280' }}
                            >
                                out of {OVERALL_RATING_DATA.max.toFixed(1)}
                            </tspan>
                        </text>
                        
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>

            {/* --- Sub-Metrics Display --- */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                <h4 className="font-semibold text-gray-800 mb-2">Detailed Ratings:</h4>
                {OVERALL_RATING_DATA.metrics.map((metric, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 flex items-center font-medium">
                            {/* Use dynamic color for the star based on sub-metric score */}
                            <Star className={`w-4 h-4 ${getColorByRating(metric.score as number).replace('#', 'text-')} fill-current mr-2 flex-shrink-0`}/>
                            {metric.name}
                        </span>
                        <span className="font-semibold text-gray-900 flex-shrink-0">
                            {(metric.score as number).toFixed(1)}/{metric.max.toFixed(1)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacilityRatingGauge;