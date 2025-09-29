"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Coords {
    lat: number;
    lng: number; 
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface Facility {
  // Core identifiers
  _id: string;                   // backend MongoDB id
  id?: string;                   // optional mapped id
  name: string;                  // provider_name or googleName
  legal_business_name?: string;
  
  // Address & location
  provider_address?: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  lat?: number | null;
  lng?: number | null;
  
  // Contact
  phone?: string;
  imageUrl?: string | null;

  // Ratings & CMS data
  rating?: number | null;
  overall_rating?: number | null;
  short_stay_qm_rating?: number | null;
  staffing_rating?: number | null;
  qm_rating?: string | null;
  
  // Beds & staff
  beds?: number;
  number_of_certified_beds?: number;
  number_of_administrators_who_have_left_the_nursing_home?: number;
  registered_nurse_hours_per_resident_per_day_on_the_weekend?: number;
  reported_licensed_staffing_hours_per_resident_per_day?: number;
  reported_lpn_staffing_hours_per_resident_per_day?: number;
  reported_nurse_aide_staffing_hours_per_resident_per_day?: number;
  reported_physical_therapist_staffing_hours_per_resident_per_day?: number;
  reported_rn_staffing_hours_per_resident_per_day?: number;
  reported_total_nurse_staffing_hours_per_resident_per_day?: number;

  // Ownership & type
  ownership_type?: string;
  isNonProfit?: boolean;
  provider_type?: string;

  // Other metadata
  pros?: string;
  cons?: string;
  status: 'Accepting' | 'Waitlist' | 'Full' | 'Unknown';
  hours?: string;
  distance?: number | null;
  isFeatured?: boolean;

  // Extra CMS / optional fields
  most_recent_health_inspection_more_than_2_years_ago?: string;
  provider_changed_ownership_in_last_12_months?: string;
  provider_resides_in_hospital?: string;
  provider_ssa_county_code?: string;
  rating_cycle_1_health_deficiency_score?: number;
  rating_cycle_1_total_health_score?: number;
  total_amount_of_fines_in_dollars?: number;
  updatedAt?: string; // ISO date
  [key: string]: any; // catch-all for other optional fields
}


interface FacilitiesContextType {
    facilities: Facility[];
    setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
    // 🏆 FIX 3: Coords type now uses 'lng'
    coords: Coords | null;
    setCoords: React.Dispatch<React.SetStateAction<Coords | null>>;
    locationName: string;
    setLocationName: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// Default value
const FacilitiesContext = createContext<FacilitiesContextType | undefined>(
    undefined
);

interface FacilitiesProviderProps {
    children: ReactNode;
}

export const FacilitiesProvider: React.FC<FacilitiesProviderProps> = ({
    children,
}) => {
    // State initializers remain the same
    const [facilities, setFacilities] = useState<Facility[]>([]);
    // 🏆 FIX 4: Coords state now adheres to the type with 'lng'
    const [coords, setCoords] = useState<Coords | null>(null);
    const [locationName, setLocationName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <FacilitiesContext.Provider
            value={{
                facilities,
                setFacilities,
                coords,
                setCoords,
                locationName,
                setLocationName,
                isLoading,
                setIsLoading,
                error,
                setError,
            }}
        >
            {children}
        </FacilitiesContext.Provider>
    );
};

export const useFacilities = (): FacilitiesContextType => {
    const context = useContext(FacilitiesContext);
    if (context === undefined) {
        throw new Error("useFacilities must be used within a FacilitiesProvider");
    }
    return context;
};