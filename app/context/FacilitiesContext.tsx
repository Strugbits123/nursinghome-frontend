"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";

// --- Storage Keys ---
export const FACILITIES_STORAGE_KEY = "facilities";
export const COORDS_STORAGE_KEY = "coords";
export const LOCATION_NAME_STORAGE_KEY = "locationName";
export const FILTERS_STORAGE_KEY = "filters";

// API Base URL
const API_BASE_URL = "https://app.carenav.io/api/facilities";

// --- Cache Duration (7 days) ---
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7;

// --- Safe Local Storage Helpers ---
function saveToStorage<T>(key: string, value: T) {
  const data = { value, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(data));
}

function getInitialState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        if ("value" in parsed && "timestamp" in parsed) {
          const ts = parsed.timestamp as number;
          if (!ts || Date.now() - ts < CACHE_DURATION) {
            return parsed.value as T;
          }
        } else {
          // handle old format (raw array/object)
          return parsed as T;
        }
      }
    }
  } catch (err) {
    console.error(`Error reading localStorage for ${key}:`, err);
  }
  return defaultValue;
}

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
  _id: string;
  id?: string;
  name: string;
  legal_business_name?: string;
  provider_name?: string;
  provider_address?: string;
  address: string;
  city_town?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  lat?: number | null;
  lng?: number | null;
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
  overall_rating?: number | null;
  numeric_overall_rating?: number | null;
  number_of_certified_beds?: number;
  ownership_type?: string;
  status?: "Accepting" | "Waitlist" | "Full" | "Unknown";
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
  total: number;
  setTotal: (total: number) => void;

  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedFacilities: Facility[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  refetchFacilities: (newFilters?: FilterState) => void;
}

const FacilitiesContext = createContext<FacilitiesContextType | undefined>(
  undefined
);

export const FacilitiesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>(() =>
    getInitialState(FACILITIES_STORAGE_KEY, [])
  );
  const [coords, setCoords] = useState<Coords | null>(() =>
    getInitialState(COORDS_STORAGE_KEY, null)
  );

  const [locationName, setLocationName] = useState<string>(() => {
    const saved = getInitialState(LOCATION_NAME_STORAGE_KEY, "");
    return typeof saved === "string" && saved.trim()
      ? saved.trim().replace(/\s+/g, "_").toLowerCase()
      : "";
  });

  const [filters, setFilters] = useState<FilterState>(() =>
    getInitialState(FILTERS_STORAGE_KEY, {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(total / pageSize);

  // Cache key based on filters + location
  const cacheKey = useMemo(
    () =>
      `${FACILITIES_STORAGE_KEY}_${JSON.stringify(filters)}_${locationName}`,
    [filters, locationName]
  );

  // --- Fetch Facilities (with cache) ---
  const fetchFacilities = useCallback(
    async (currentFilters: FilterState) => {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const queryString = params.toString();
      if (!queryString) return;

      setIsLoading(true);
      setError(null);

      try {
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log("⚡ Loaded facilities from cache");
            setFacilities(data.facilities || []);
            setCoords(data.centerCoords || null);
            setTotal(data.total || data.totalCount || data.facilities?.length || 0);
            setIsLoading(false);
            return;
          }
        }

        // API call if no cache
        const url = `${API_BASE_URL}/filter-with-reviews?${queryString}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch facilities");

        const data = await response.json();
        setFacilities(data.facilities || []);
        setTotal(data.total || data.totalCount || data.facilities?.length || 0);

        if (data.centerCoords?.lat && data.centerCoords?.lng) {
          setCoords(data.centerCoords);
        }

        // Save in cache
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        );

        console.log(`✅ Cached ${data.facilities?.length || 0} facilities`);
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
        setFacilities([]);
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey]
  );

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

  // --- Pagination Logic ---
  const paginatedFacilities = useMemo(() => {
    const safeFacilities = Array.isArray(facilities) ? facilities : [];
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return safeFacilities.slice(start, end);
  }, [facilities, currentPage]);

  // --- Persist states ---
  useEffect(() => saveToStorage(FACILITIES_STORAGE_KEY, facilities), [facilities]);
  useEffect(() => saveToStorage(COORDS_STORAGE_KEY, coords), [coords]);
  useEffect(() => saveToStorage(LOCATION_NAME_STORAGE_KEY, locationName), [locationName]);
  useEffect(() => saveToStorage(FILTERS_STORAGE_KEY, filters), [filters]);

  // --- Auto-fetch if cache empty ---
  useEffect(() => {
    if (facilities.length === 0 && locationName) {
      fetchFacilities(filters);
    }
  }, [locationName]);

  return (
    <FacilitiesContext.Provider
      value={{
        facilities,
        setFacilities,
        coords,
        setCoords,
        locationName,
        setLocationName,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedFacilities,
        isLoading,
        setIsLoading,
        error,
        setError,
        filters,
        setFilters,
        refetchFacilities,
        total,
        setTotal,
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
