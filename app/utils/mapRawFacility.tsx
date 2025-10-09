
import { Facility, Coords } from '../context/FacilitiesContext';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number | null => {
    return null;
};

const getStatus = (overallRating: string | number | undefined): Facility['status'] => {
    const rating = parseFloat(String(overallRating));
    if (rating >= 4) return 'Accepting';
    if (rating >= 3) return 'Waitlist';
    if (rating < 3) return 'Full';
    return 'Unknown';
};

export const mapRawFacilityToCard = (raw: any, searchCoords: Coords | null): Facility => {
    const getAddress = (r: any) =>
        `${r.provider_address || ''}, ${r.city_town || ''}, ${r.state || ''} ${r.zip_code || ''}`.trim().replace(/, ,/g, ',');

    const overallRating = raw.overall_rating ? parseFloat(raw.overall_rating) : 0;
    const finalRating = raw.rating || overallRating;

   return {
        _id: raw._id,
        id: raw._id,
        name: raw.googleName || raw.provider_name || 'N/A Facility',
        address: getAddress(raw),
        city: raw.city_town || '',
        state: raw.state || '',
        zip: raw.zip_code || '', 
        phone: raw.telephone_number || 'N/A',
        beds: raw.number_of_certified_beds || 0,
        isNonProfit: !(raw.ownership_type?.toLowerCase().includes('for profit')),

        lat: raw.lat ?? 0,
        lng: raw.lng ?? 0,

        provider_name: raw.provider_name || '',
        legal_business_name: raw.legal_business_name || '',

        pros: Array.isArray(raw.aiSummary?.pros) ? raw.aiSummary.pros.join(', ') : 'None listed',
        cons: Array.isArray(raw.aiSummary?.cons) ? raw.aiSummary.cons.join(', ') : 'None listed',
        imageUrl: raw.photo || null,
        isFeatured: finalRating >= 4.5,

        distance:
        raw.lat && raw.lng && searchCoords
            ? calculateDistance(raw.lat, raw.lng, searchCoords.lat, searchCoords.lng)
            : null,
        status: getStatus(raw.overall_rating),
        hours: 'Mon-Fri: 9am-5pm',
    };

};