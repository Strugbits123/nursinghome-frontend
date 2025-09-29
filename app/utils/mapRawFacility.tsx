// app/utils/mapRawFacility.ts (New Helper File - Recommended)

import { Facility, Coords } from '../context/FacilitiesContext';

// Helper to calculate distance (Placeholder implementation)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number | null => {
    // Implement actual Haversine formula here if needed, or rely on API's distance field.
    // Since your API response didn't include a distance field, we return null.
    return null;
};

// Helper to determine status based on rating/data
const getStatus = (overallRating: string | number | undefined): Facility['status'] => {
    const rating = parseFloat(String(overallRating));
    if (rating >= 4) return 'Accepting';
    if (rating >= 3) return 'Waitlist';
    if (rating < 3) return 'Full';
    return 'Unknown';
};

// 🏆 CRITICAL MAPPING FUNCTION
export const mapRawFacilityToCard = (raw: any, searchCoords: Coords | null): Facility => {
    // Helper to format address
    const getAddress = (r: any) =>
        `${r.provider_address || ''}, ${r.city_town || ''}, ${r.state || ''} ${r.zip_code || ''}`.trim().replace(/, ,/g, ',');

    const overallRating = raw.overall_rating ? parseFloat(raw.overall_rating) : 0;
    const finalRating = raw.rating || overallRating;

    return {
        id: raw._id,
        name: raw.googleName || raw.provider_name || 'N/A Facility',
        address: getAddress(raw),
        phone: raw.telephone_number || 'N/A',
        beds: raw.number_of_certified_beds || 0,
        isNonProfit: raw.ownership_type?.toLowerCase().includes('for profit') === false,

        // 🏆 LOCATION FIX: Map raw.lat and raw.lng to Facility.lat and Facility.lon
        lat: raw.lat || 0,
        lon: raw.lng || 0, // <--- Maps API's 'lng' (longitude) to Facility's 'lon'

        // Display Data
        rating: finalRating,
        imageUrl: raw.photo || null,
        isFeatured: finalRating >= 4.5, // Example logic

        // AI Summary (safely joining arrays)
        pros: Array.isArray(raw.aiSummary?.pros) ? raw.aiSummary.pros.join(', ') : 'None listed',
        cons: Array.isArray(raw.aiSummary?.cons) ? raw.aiSummary.cons.join(', ') : 'None listed',

        // Computed/Placeholder
        distance: (raw.lat && raw.lng && searchCoords) 
            ? calculateDistance(raw.lat, raw.lng, searchCoords.lat, searchCoords.lon) 
            : null,
        status: getStatus(raw.overall_rating),
        hours: 'Mon-Fri: 9am-5pm', // Placeholder
    };
};