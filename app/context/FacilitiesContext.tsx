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

// 🎯 CONSISTENT NORMALIZATION FUNCTION
const normalizeLocationName = (locationName: string): string => {
  if (!locationName) return '';
  return locationName.toLowerCase().replace(/\s+/g, "_");
};

// --- Storage Keys ---
export const FACILITIES_STORAGE_KEY = "facilities";
export const COORDS_STORAGE_KEY = "coords";
export const LOCATION_NAME_STORAGE_KEY = "locationName";
export const FILTERS_STORAGE_KEY = "filters";

// 🎯 SINGLE SOURCE OF TRUTH: Cache key generation
const getPage1CacheKey = (locationName: string) => `facilities_page_1_${normalizeLocationName(locationName)}`;
const getTotalCacheKey = (locationName: string) => `facilities_total_${normalizeLocationName(locationName)}`;
const getRecommendationsCacheKey = (locationName: string) => `recommendations_${normalizeLocationName(locationName)}`;

// API Base URLs
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/facilities`;
const FACILITIES_WITH_REVIEWS_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/with-reviews`;

// --- Safe Local Storage Helpers ---
function saveToStorage<T>(key: string, value: T) {
  const data = { value, timestamp: Date.now() };
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object" && "value" in parsed) {
        return parsed.value as T;
      }
      // Handle legacy format (raw value)
      return parsed as T;
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
  fetchFacilitiesWithReviews: (searchQuery: string, currentCoords: Coords | null) => Promise<void>;
}

const FacilitiesContext = createContext<FacilitiesContextType | undefined>(
  undefined
);

export const FacilitiesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 🎯 FIXED: Initialize state from localStorage FIRST
  const [facilities, setFacilities] = useState<Facility[]>(() => 
    getFromStorage(FACILITIES_STORAGE_KEY, [])
  );
  const [recommendations, setRecommendations] = useState<Facility[]>([]);
  const [coords, setCoords] = useState<Coords | null>(() => 
    getFromStorage(COORDS_STORAGE_KEY, null)
  );
  const [locationName, setLocationName] = useState<string>(() => 
    getFromStorage(LOCATION_NAME_STORAGE_KEY, "")
  );
  const [filters, setFilters] = useState<FilterState>(() => 
    getFromStorage(FILTERS_STORAGE_KEY, {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotalState] = useState(0);

  // Custom setTotal that also saves to localStorage
  const setTotal = useCallback((newTotal: number) => {
    setTotalState(newTotal);
    localStorage.setItem("facilities_total_count", newTotal.toString());
  }, []);

  // 🎯 FIXED: Also initialize total from localStorage
  useEffect(() => {
    const savedTotal = localStorage.getItem("facilities_total_count");
    if (savedTotal) {
      try {
        const totalValue = parseInt(savedTotal);
        if (!isNaN(totalValue) && totalValue > 0) {
          setTotalState(totalValue);
        }
      } catch (err) {
        console.error("Error parsing total from localStorage:", err);
      }
    }
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.ceil(total / pageSize);

  // ✅ FIXED: Paginated facilities calculation
  const paginatedFacilities = useMemo(() => {
    const safeFacilities = Array.isArray(facilities) ? facilities : [];
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return safeFacilities.slice(start, end);
  }, [facilities, currentPage, pageSize]);

  // 🎯 FIXED: Get cached data for current location
  const getCachedData = useCallback((currentLocation: string) => {
    if (!currentLocation || typeof window === "undefined") return null;
    
    const normalized = normalizeLocationName(currentLocation);
    const page1CacheKey = getPage1CacheKey(normalized);
    const totalCacheKey = getTotalCacheKey(normalized);
    const recommendationsCacheKey = getRecommendationsCacheKey(normalized);
    
    console.log("🔍 Context: Looking for cache with keys:", { 
      page1CacheKey, 
      totalCacheKey,
      recommendationsCacheKey
    });
    
    try {
      const cachedPage1 = localStorage.getItem(page1CacheKey);
      const cachedTotal = localStorage.getItem(totalCacheKey);
      const cachedRecommendations = localStorage.getItem(recommendationsCacheKey);
      
      if (cachedPage1 && cachedTotal) {
        const facilities = JSON.parse(cachedPage1);
        const total = parseInt(cachedTotal);
        const recommendations = cachedRecommendations ? JSON.parse(cachedRecommendations) : [];
        
        if (Array.isArray(facilities) && facilities.length > 0 && total > 0) {
          console.log(`⚡ Context: Using cached data for ${normalized}`);
          return { facilities, total, recommendations };
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    
    return null;
  }, []);

  // 🎯 FIXED: Save data with consistent normalization
  const saveToLocationCache = useCallback((currentLocation: string, facilities: Facility[], total: number, recommendations: Facility[] = []) => {
    if (!currentLocation || typeof window === "undefined") return;
    
    const normalized = normalizeLocationName(currentLocation);
    
    try {
      const page1CacheKey = getPage1CacheKey(normalized);
      const totalCacheKey = getTotalCacheKey(normalized);
      const recommendationsCacheKey = getRecommendationsCacheKey(normalized);
      
      localStorage.setItem(page1CacheKey, JSON.stringify(facilities));
      localStorage.setItem(totalCacheKey, total.toString());
      localStorage.setItem(recommendationsCacheKey, JSON.stringify(recommendations));
      localStorage.setItem("facilities_total_count", total.toString());
      
      console.log(`💾 Context: Cached data for ${normalized}`, {
        facilitiesCount: facilities.length,
        total,
        recommendationsCount: recommendations.length
      });
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, []);

  // Helper: Fetch Top Recommendations
  const fetchTopRecommendations = async (state: string, city: string, top_n: number) => {
    if (!state && !city) return [];
    const token = localStorage.getItem("token") || "";
    const url = `http://localhost:8000/recommendations/top?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&limit=${top_n}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return [];
      const data = await res.json();
      return data.recommendations || [];
    } catch (err) {
      console.error("Failed to fetch top recommendations:", err);
      return [];
    }
  };

  /**
   * Extract state and city from a query string.
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

  // ✅ FIXED: Fetch facilities from filter API
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
        console.log("🌐 Context: Fetching filtered facilities:", url);
        
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch facilities");

        const data = await response.json();
        const facilitiesData = data.facilities || [];
        const totalCount = data.total || data.totalCount || facilitiesData.length;

        // --- Fetch Top Recommendations from FastAPI in parallel ---
        const { state, city } = parseQueryToStateCity(currentFilters.locationName || locationName);
        let topFacilities: Facility[] = [];
        
        if (state || city) {
          topFacilities = await fetchTopRecommendations(state, city, 5);
        }

        // Update state
        setFacilities(facilitiesData);
        setTotal(totalCount);
        setRecommendations(topFacilities);

        if (data.centerCoords?.lat && data.centerCoords?.lng) {
          setCoords(data.centerCoords);
        }

        // 🎯 SMART CACHE: Only cache page 1 data for this location (no filter cache)
        if (!Object.keys(currentFilters).some(key => 
          key !== 'locationName' && currentFilters[key]
        )) {
          saveToLocationCache(locationName, facilitiesData, totalCount, topFacilities);
        }

        console.log(`✅ Context: Loaded ${facilitiesData.length} facilities and ${topFacilities.length} recommendations`);

      } catch (err: any) {
        console.error("❌ Context: Fetch error:", err);
        setError(err.message);
        setFacilities([]);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    },
    [locationName, getCachedData, saveToLocationCache]
  );

  // ✅ FIXED: Refetch wrapper implementation
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

  // ✅ FIXED: Fetch facilities from with-reviews API (used by HeroSection)
  const fetchFacilitiesWithReviews = useCallback(async (
    searchQuery: string,
    currentCoords: Coords | null
  ) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      throw new Error("Please log in to search facilities");
    }

    if ((!searchQuery || searchQuery.trim() === "") && (!currentCoords?.lat || !currentCoords?.lng)) {
      throw new Error("Please enter a city, state, or ZIP code");
    }

    setIsLoading(true);
    setError(null);

    try {
      // ✅ Build query params for with-reviews API
      const params = new URLSearchParams();

      if (searchQuery && !currentCoords) {
        const normalizedQuery = searchQuery.trim().toLowerCase().replace(/\s+/g, "_");
        params.append("q", normalizedQuery);
      }

      if (currentCoords?.lat && currentCoords?.lng) {
        params.append("lat", currentCoords.lat.toString());
        params.append("lng", currentCoords.lng.toString());
      }

      params.append("page", "1");
      params.append("limit", "8");

      const url = `${FACILITIES_WITH_REVIEWS_URL}?${params.toString()}`;
      console.log("🔹 Context: Fetching from with-reviews API:", url);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      const rawFacilitiesList = Array.isArray(data.data) ? data.data : data?.facilities || [];

      // Map to usable structure
      const facilitiesList = rawFacilitiesList.map((raw: any) => ({
        ...raw,
        id: raw._id || raw.id,
        name: raw.name || raw.provider_name || "Unknown Facility",
        address: raw.address || raw.provider_address || "",
        city: raw.city || raw.city_town || "",
        state: raw.state || "",
        zip: raw.zip || raw.zip_code || "",
        lat: raw.lat || null,
        lng: raw.lng || null,
        rating: raw.rating || raw.overall_rating || null,
        beds: raw.beds || raw.number_of_certified_beds || 0,
        ownership: raw.ownership || raw.ownership_type || "",
        status: raw.status || "Unknown",
        phone: raw.phone || raw.telephone_number || "",
        hours: raw.hours || raw.operating_hours || "",
        imageUrl: raw.imageUrl || raw.photo || "",
        distance: raw.distance || raw.distance_km || null,
      }));

      // 🎯 FIXED: Fetch recommendations in parallel with facilities
      const { state, city } = parseQueryToStateCity(searchQuery);
      console.log("🔹 Context: Fetching top recommendations for:", state, city);
      
      const [topFacilities] = await Promise.all([
        fetchTopRecommendations(state, city, 5)
      ]);

      // Update state
      setFacilities(facilitiesList);
      setCoords(currentCoords);
      setLocationName(searchQuery || "");
      setTotal(data.total || 0);
      setRecommendations(topFacilities);

      // 🎯 CACHE: Save everything to location-based cache
      if (searchQuery) {
        saveToLocationCache(searchQuery, facilitiesList, data.total || 0, topFacilities);
      }

      // Save to localStorage for backward compatibility
      saveToStorage(FACILITIES_STORAGE_KEY, facilitiesList);
      saveToStorage(COORDS_STORAGE_KEY, currentCoords || null);
      saveToStorage(LOCATION_NAME_STORAGE_KEY, 
        searchQuery ? searchQuery.trim().replace(/\s+/g, "_").toLowerCase() : ""
      );

      console.log(`✅ Context: Loaded ${facilitiesList.length} facilities and ${topFacilities.length} recommendations`);

    } catch (err: any) {
      console.error("❌ Context: Fetch failed:", err);
      setError(err.message);
      
      // Clear state and cache on error
      setFacilities([]);
      setCoords(null);
      setLocationName("");
      setRecommendations([]);

      localStorage.removeItem(FACILITIES_STORAGE_KEY);
      localStorage.removeItem(COORDS_STORAGE_KEY);
      localStorage.removeItem(LOCATION_NAME_STORAGE_KEY);

      throw err; // Re-throw for component to handle
    } finally {
      setIsLoading(false);
    }
  }, [saveToLocationCache]);

  // 🎯 FIXED: Restore from cache on mount - IMPROVED
  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("🔄 Context: Checking for cached data on mount", {
      locationName,
      facilitiesLength: facilities.length,
      total
    });

    // If we have locationName but no facilities or total, try to restore from cache
    if (locationName && (facilities.length === 0 || total === 0)) {
      console.log("🔄 Context: Attempting to restore from cache for:", locationName);
      
      const cachedData = getCachedData(locationName);
      if (cachedData) {
        console.log("✅ Context: Restored facilities from cache on mount", {
          facilitiesCount: cachedData.facilities.length,
          total: cachedData.total,
          recommendationsCount: cachedData.recommendations.length
        });
        setFacilities(cachedData.facilities);
        setTotal(cachedData.total);
        setRecommendations(cachedData.recommendations);
        
        // Also restore coords if available in localStorage
        const savedCoords = getFromStorage(COORDS_STORAGE_KEY, null);
        if (savedCoords) {
          setCoords(savedCoords);
        }
      } else {
        console.log("❌ Context: No location-specific cache found for:", locationName);
        
        // 🎯 FIXED: Check legacy localStorage data
        const savedFacilities = getFromStorage(FACILITIES_STORAGE_KEY, []);
        const savedTotal = localStorage.getItem("facilities_total_count");
        
        if (savedFacilities.length > 0) {
          console.log("✅ Context: Restored facilities from localStorage", {
            facilitiesCount: savedFacilities.length,
            total: savedTotal
          });
          setFacilities(savedFacilities);
          if (savedTotal) {
            const totalValue = parseInt(savedTotal);
            if (!isNaN(totalValue) && totalValue > 0) {
              setTotal(totalValue);
            }
          }
        } else {
          console.log("❌ Context: No cached data found anywhere");
        }
      }
    }
  }, [locationName, facilities.length, total, getCachedData]);

  // 🎯 FIXED: Persist state changes to localStorage
  useEffect(() => {
    if (facilities.length > 0) {
      saveToStorage(FACILITIES_STORAGE_KEY, facilities);
    }
  }, [facilities]);

  useEffect(() => {
    if (coords) {
      saveToStorage(COORDS_STORAGE_KEY, coords);
    }
  }, [coords]);

  useEffect(() => {
    if (locationName) {
      saveToStorage(LOCATION_NAME_STORAGE_KEY, locationName);
    }
  }, [locationName]);

  useEffect(() => {
    saveToStorage(FILTERS_STORAGE_KEY, filters);
  }, [filters]);

  // 🎯 FIXED: Auto-fetch if cache empty - IMPROVED
  useEffect(() => {
    if (locationName && facilities.length === 0) {
      const cachedData = getCachedData(locationName);
      const savedFacilities = getFromStorage(FACILITIES_STORAGE_KEY, []);
      
      // Only fetch if we have NO cached data at all
      if (!cachedData && savedFacilities.length === 0) {
        console.log("🔄 Context: No cache found, fetching facilities for:", locationName);
        fetchFacilities(filters);
      } else {
        console.log("✅ Context: Using cached data, no fetch needed");
      }
    }
  }, [locationName, facilities.length, getCachedData, fetchFacilities, filters]);

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
        total: total,
        setTotal,
        fetchFacilitiesWithReviews,
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