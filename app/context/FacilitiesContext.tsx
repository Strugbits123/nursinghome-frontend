"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Coords {
    lat: number;
    lng: number; 
}

// 🏆 UPDATED FACILITY INTERFACE BASED ON YOUR JSON RESPONSE
export interface Facility {
    // Core Data from API Response
    id: string; // Mapped from _id
    name: string; // Mapped from googleName or provider_name
    address: string; // Mapped from provider_address + city_town + state + zip_code
    phone: string; // Mapped from telephone_number
    beds: number; // Mapped from number_of_certified_beds
    isNonProfit: boolean; // Mapped from ownership_type

    // Location Data for Map Integration (Required)
    lat: number; // Mapped from lat
    lng: number; 
    
    provider_name: string; 
    legal_business_name: string; 

    pros: string;
    cons: string;
    imageUrl: string | null;
    isFeatured?: boolean;
    distance?: number | null; 
    status: 'Accepting' | 'Waitlist' | 'Full' | 'Unknown';
    hours: string;
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