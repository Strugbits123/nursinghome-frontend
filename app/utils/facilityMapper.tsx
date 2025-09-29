// src/utils/facilityMapper.ts (New file or place in your utility files)

import { Facility } from "../context/FacilitiesContext";

// Define the structure of the raw API object
interface RawFacility {
    _id: string;
    googleName: string;
    provider_name: string;
    location: string;
    provider_address: string;
    city_town: string;
    state: string;
    lat: string;
    lng: string;
    zip_code: string;
    number_of_certified_beds: number;
    ownership_type: string;
    telephone_number: string;
    photo?: string;
    aiSummary: {
        pros: string[]; 
        cons: string[];
        summary: string;
    };
}

export const mapRawFacilityToCard = (raw: RawFacility, distance: number | null = null): Facility => {
    const name = raw.googleName || raw.provider_name || 'Facility Name Unknown';
    const id = raw._id;

    const address = raw.location || 
                    `${raw.provider_address}, ${raw.city_town}, ${raw.state}, ${raw.zip_code}`;

    const isNonProfit = raw.ownership_type ? raw.ownership_type.toLowerCase().includes('non-profit') : false;
    const pros = raw.aiSummary?.pros?.join(', ') || 'No specific pros listed';
    const cons = raw.aiSummary?.cons?.join(', ') || 'No specific cons listed';
    
    const status: Facility['status'] = 'Accepting';

    return {
        id: id,
        name: name,
        distance: distance, 
        address: address,
        beds: raw.number_of_certified_beds || 0,
        isNonProfit: isNonProfit,
        status: status,
        pros: pros,
        cons: cons,
        phone: raw.telephone_number || 'N/A',
        hours: 'Open 24/7',
        imageUrl: raw.photo || null,
        isFeatured: false,
    };
};