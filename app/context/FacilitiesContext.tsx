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

// 🎯 SMART CACHE: Location-based cache keys
const getPage1CacheKey = (locationName: string) => `facilities_page_1_${locationName}`;
const getTotalCacheKey = (locationName: string) => `facilities_total_${locationName}`;
const getRecommendationsCacheKey = (locationName: string) => `recommendations_${locationName}`;

// API Base URL
const API_BASE_URL = "${process.env.NEXT_PUBLIC_API_URL}/api/facilities";

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

/**
 * Extract state and city from a query string.
 * Example:
 *   "Birmingham, AL" => { city: "Birmingham", state: "AL" }
 *   "AL" => { city: "", state: "AL" }
 */
const parseQueryToStateCity = (query: string | undefined) => {
  if (!query) return { state: "", city: "" };

  const parts = query.split(",").map((p) => p.trim());
  if (parts.length === 2) {
    return { city: parts[0], state: parts[1] };
  } else if (parts.length === 1) {
    return { city: "", state: parts[0] };
  } else {
    return { city: "", state: "" };
  }
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
  recommendations: Facility[];
  setRecommendations: React.Dispatch<React.SetStateAction<Facility[]>>;
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
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [recommendations, setRecommendations] = useState<Facility[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [normalizedLocation, setNormalizedLocation] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(total / pageSize);

  // 🎯 SMART CACHE: Get cached data for current location
  const getCachedData = useCallback((currentLocation: string) => {
    if (!currentLocation || typeof window === "undefined") return null;
    
    const page1CacheKey = getPage1CacheKey(currentLocation);
    const totalCacheKey = getTotalCacheKey(currentLocation);
    const recommendationsCacheKey = getRecommendationsCacheKey(currentLocation);
    
    try {
      const cachedPage1 = localStorage.getItem(page1CacheKey);
      const cachedTotal = localStorage.getItem(totalCacheKey);
      const cachedRecommendations = localStorage.getItem(recommendationsCacheKey);
      
      if (cachedPage1 && cachedTotal) {
        const facilities = JSON.parse(cachedPage1);
        const total = parseInt(cachedTotal);
        const recommendations = cachedRecommendations ? JSON.parse(cachedRecommendations) : [];
        
        if (Array.isArray(facilities) && facilities.length > 0 && total > 0) {
          console.log(`⚡ Using cached data for ${currentLocation}`);
          return { facilities, total, recommendations };
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    
    return null;
  }, []);

  // 🎯 SMART CACHE: Save data for current location
  const saveToLocationCache = useCallback((currentLocation: string, facilities: Facility[], total: number, recommendations: Facility[] = []) => {
    if (!currentLocation || typeof window === "undefined") return;
    
    try {
      const page1CacheKey = getPage1CacheKey(currentLocation);
      const totalCacheKey = getTotalCacheKey(currentLocation);
      const recommendationsCacheKey = getRecommendationsCacheKey(currentLocation);
      
      localStorage.setItem(page1CacheKey, JSON.stringify(facilities));
      localStorage.setItem(totalCacheKey, total.toString());
      localStorage.setItem(recommendationsCacheKey, JSON.stringify(recommendations));
      
      console.log(`💾 Cached data for ${currentLocation}`);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, []);

  // 🎯 SMART CACHE: Clear cache for a specific location
  const clearLocationCache = useCallback((locationToClear: string) => {
    if (typeof window === "undefined") return;
    
    try {
      const page1CacheKey = getPage1CacheKey(locationToClear);
      const totalCacheKey = getTotalCacheKey(locationToClear);
      const recommendationsCacheKey = getRecommendationsCacheKey(locationToClear);
      
      localStorage.removeItem(page1CacheKey);
      localStorage.removeItem(totalCacheKey);
      localStorage.removeItem(recommendationsCacheKey);
      
      console.log(`🗑️ Cleared cache for ${locationToClear}`);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, []);

  // --- Rehydrate locationName after mount ---
  useEffect(() => {
    if (typeof window === "undefined") return;
      try {
         const saved = localStorage.getItem(LOCATION_NAME_STORAGE_KEY);
          if (saved) {
            let parsed = JSON.parse(saved);

            // Handle nested Value structure
            if (parsed?.Value) {
              try {
                const inner = JSON.parse(parsed.Value);
                parsed = inner?.Value ?? inner; 
              } catch {
                parsed = parsed.Value;
              }
            }

            if (typeof parsed === "string") {
              setLocationName(parsed);
              setNormalizedLocation(parsed.trim().replace(/\s+/g, "_").toLowerCase());
              
              // 🎯 SMART CACHE: Load cached data for this location
              const cachedData = getCachedData(parsed);
              if (cachedData) {
                setFacilities(cachedData.facilities);
                setTotal(cachedData.total);
                setRecommendations(cachedData.recommendations);
              }
            } else {
              console.warn("Unexpected structure for location data:", parsed);
            }
          }
      } catch (err) {
      console.error("Failed to restore locationName:", err);
    }
  }, [getCachedData]);

  // --- Helper: Fetch Top Recommendations ---
  const fetchTopRecommendations = async (state: string, city: string, top_n: number) => {
    if (!state || !city) return [];
    const token = localStorage.getItem("token") || "";
    const url = `http://localhost:8000/top-facilities?state=${state}&city=${city}&top_n=${top_n}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return [];
      const data = await res.json();
      return data || [];
    } catch {
      return [];
    }
  };

  // --- Fetch Facilities (with smart caching) ---
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
        // 🎯 SMART CACHE: Check for cached data first
        const cachedData = getCachedData(locationName);
        if (cachedData && !Object.keys(currentFilters).some(key => 
          key !== 'locationName' && currentFilters[key]
        )) {
          console.log("⚡ Loaded facilities from location cache");
          setFacilities(cachedData.facilities);
          setTotal(cachedData.total);
          setRecommendations(cachedData.recommendations);
          setIsLoading(false);
          return;
        }

        // --- API call for main facilities ---
        const url = `${API_BASE_URL}/filter-with-reviews?${queryString}`;
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch facilities");

        const data = await response.json();
        const facilitiesData = data.facilities || [];
        const totalCount = data.total || data.totalCount || facilitiesData.length;

        setFacilities(facilitiesData);
        setTotal(totalCount);

        if (data.centerCoords?.lat && data.centerCoords?.lng) {
          setCoords(data.centerCoords);
        }

        // --- Fetch Top Recommendations from FastAPI ---
        const { state, city } = parseQueryToStateCity(currentFilters.locationName || locationName);
        let topFacilities: Facility[] = [];
        
        if (state && city) {
          topFacilities = await fetchTopRecommendations(state, city, 5);
        }
        
        setRecommendations(topFacilities);

        // 🎯 SMART CACHE: Only cache page 1 data for this location (no filter cache)
        if (!Object.keys(currentFilters).some(key => 
          key !== 'locationName' && currentFilters[key]
        )) {
          saveToLocationCache(locationName, facilitiesData, totalCount, topFacilities);
        }

        console.log(`✅ Loaded ${facilitiesData.length} facilities and ${topFacilities.length} recommendations`);

      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
        setFacilities([]);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    },
    [locationName, getCachedData, saveToLocationCache]
  );

  // --- Refetch wrapper ---
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
  useEffect(() => {
    if (!locationName) return;
    
    // 🎯 SMART CACHE: Clear old cache when location changes
    const previousLocation = localStorage.getItem(LOCATION_NAME_STORAGE_KEY);
    if (previousLocation && previousLocation !== locationName) {
      clearLocationCache(previousLocation);
    }
    
    saveToStorage(LOCATION_NAME_STORAGE_KEY, locationName);
    setNormalizedLocation(locationName.trim().replace(/\s+/g, "_").toLowerCase());
  }, [locationName, clearLocationCache]);

  useEffect(() => saveToStorage(FILTERS_STORAGE_KEY, filters), [filters]);

  // --- Auto-fetch if cache empty ---
  useEffect(() => {
    if (facilities.length === 0 && locationName) {
      const cachedData = getCachedData(locationName);
      if (!cachedData) {
        fetchFacilities(filters);
      }
    }
  }, [locationName]);

  return (
    <FacilitiesContext.Provider
      value={{
        facilities,
        setFacilities,
        recommendations,
        setRecommendations,
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