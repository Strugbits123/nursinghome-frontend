"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// --- Storage Keys ---
export  const FACILITIES_STORAGE_KEY = "facilities";
export  const COORDS_STORAGE_KEY = "coords";
export  const LOCATION_NAME_STORAGE_KEY = "locationName";
export  const FILTERS_STORAGE_KEY = "filters";

// Define the base URL for your backend API
const API_BASE_URL = "http://13.61.57.246:5000/api/facilities";

// --- Utility to safely get initial state from localStorage ---
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Error parsing stored data for ${key}:`, e);
        localStorage.removeItem(key);
      }
    }
  }
  return defaultValue;
};

// --- Interfaces ---
export interface Coords {
  lat: number;
  lng: number;
}

export interface FilterState {
  bedsMin?: string;
  bedsMax?: string;
  ownership?: string;
  ratingMin?: string;
  distanceKm?: string;
  userLat?: string;
  userLng?: string;
  locationName?: string;
  city?: string;
  state?: string;
  zip?: string;
  distanceFrom?: string;
  distanceTo?: string;
  beds?: string;
  price?: string;
  [key: string]: string | undefined;
}

export interface Facility {
  // Core identifiers
  _id: string;
  id?: string;
  name: string;
  legal_business_name?: string;
  provider_name?: string;

  // Address & location
  provider_address?: string;
  address: string;
  city_town?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  lat?: number | null;
  lng?: number | null;

  // API-added fields
  distance_m?: number | null;
  distance_km?: number | null;
  googleName?: string | null;
  rating?: number | null;
  photo?: string | null;
  aiSummary?: {
    summary: string;
    pros: string[];
    cons: string[];
  };

  // CMS fields
  overall_rating?: number | null;
  numeric_overall_rating?: number | null;
  number_of_certified_beds?: number;
  ownership_type?: string;

  // Status
  status?: 'Accepting' | 'Waitlist' | 'Full' | 'Unknown';

  // Additional fields
  telephone_number?: string;
  operating_hours?: string;

  [key: string]: any;
}

interface FacilitiesContextType {
  facilities: Facility[];
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
  coords: Coords | null;
  setCoords: React.Dispatch<React.SetStateAction<Coords | null>>;
  locationName: string;
  setLocationName: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  refetchFacilities: (newFilters?: FilterState) => void;
}

// Default context value
const FacilitiesContext = createContext<FacilitiesContextType | undefined>(undefined);

interface FacilitiesProviderProps {
  children: ReactNode;
}

export const FacilitiesProvider: React.FC<FacilitiesProviderProps> = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>(() =>
    getInitialState(FACILITIES_STORAGE_KEY, [])
  );
  const [coords, setCoords] = useState<Coords | null>(() =>
    getInitialState(COORDS_STORAGE_KEY, null)
  );
  const [locationName, setLocationName] = useState<string>(() =>
    getInitialState(LOCATION_NAME_STORAGE_KEY, "")
  );
  const [filters, setFilters] = useState<FilterState>(() =>
    getInitialState(FILTERS_STORAGE_KEY, {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch function ---
  const fetchFacilities = useCallback(
    async (currentFilters: FilterState) => {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const queryString = params.toString();
      if (!queryString) {
        console.warn("⚠️ No filters applied. Skipping API call.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}/filter-with-reviews?${queryString}`;
        console.log("🔍 Fetching facilities with URL:", url);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch facilities");

        const data = await response.json();
        setFacilities(data.facilities || []);

        if (data.centerCoords?.lat && data.centerCoords?.lng) {
          setCoords(data.centerCoords);
        }

        console.log(`✅ Loaded ${data.facilities?.length || 0} facilities`);
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
        setFacilities([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // --- Manual fetch trigger ---
  const refetchFacilities = useCallback(
    (newFilters?: FilterState) => {
      if (newFilters) {
        setFilters(newFilters);
        fetchFacilities(newFilters);
      } else {
        fetchFacilities(filters);
      }
    },
    [filters, fetchFacilities]
  );

  // --- Persistence ---
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(FACILITIES_STORAGE_KEY, JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords));
  }, [coords]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(LOCATION_NAME_STORAGE_KEY, JSON.stringify(locationName));
  }, [locationName]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

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
        filters,
        setFilters,
        refetchFacilities,
      }}
    >
      {children}
    </FacilitiesContext.Provider>
  );
};

export const useFacilities = (): FacilitiesContextType => {
  const context = useContext(FacilitiesContext);
  if (!context) {
    throw new Error("useFacilities must be used within a FacilitiesProvider");
  }
  return context;
};