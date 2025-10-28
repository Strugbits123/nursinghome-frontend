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
  recommendations: Facility[]; // ✅ Add recommendations
  setRecommendations: React.Dispatch<React.SetStateAction<Facility[]>>; // ✅ Add setter
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

  const [recommendations, setRecommendations] = useState<Facility[]>([]); // ✅ Add this

  const [coords, setCoords] = useState<Coords | null>(() =>
    getInitialState(COORDS_STORAGE_KEY, null)
  );

  // const [locationName, setLocationName] = useState<string>(() => {
  //   const saved = getInitialState(LOCATION_NAME_STORAGE_KEY, "");
  //   return typeof saved === "string" && saved.trim()
  //     ? saved.trim().replace(/\s+/g, "_").toLowerCase()
  //     : "";
  // });
  const [locationName, setLocationName] = useState<string>("");
  const [normalizedLocation, setNormalizedLocation] = useState<string>("");

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
                parsed = inner?.Value ?? inner; // inner.Value = "New York"
              } catch {
                parsed = parsed.Value; // fallback
              }
            }

            if (typeof parsed === "string") {
              setLocationName(parsed);
              setNormalizedLocation(parsed.trim().replace(/\s+/g, "_").toLowerCase());
            } else {
              console.warn("Unexpected structure for location data:", parsed);
            }
          }
      } catch (err) {
      console.error("Failed to restore locationName:", err);
    }
  }, []);

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
            setRecommendations(data.recommendations || []); // ✅ load cached recommendations
            setIsLoading(false);
            return;
          }
        }

        // --- API call for main facilities ---
        const url = `${API_BASE_URL}/filter-with-reviews?${queryString}`;
        const response = await fetch(url, {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch facilities");

        const data = await response.json();
        setFacilities(data.facilities || []);
        setTotal(data.total || data.totalCount || data.facilities?.length || 0);

        if (data.centerCoords?.lat && data.centerCoords?.lng) {
          setCoords(data.centerCoords);
        }

        // --- Fetch Top Recommendations from FastAPI ---
        const { state, city } = parseQueryToStateCity(filters.locationName || locationName);
        const topFacilities = await fetchTopRecommendations(state, city, 5);
        setRecommendations(topFacilities);

        // --- Save in cache including recommendations ---
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: {
              ...data,
              recommendations: topFacilities,
            },
            timestamp: Date.now(),
          })
        );

        console.log(`✅ Cached ${data.facilities?.length || 0} facilities and ${topFacilities.length} recommendations`);
      } catch (err: any) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
        setFacilities([]);
        setRecommendations([]); // ✅ clear recommendations on error
      } finally {
        setIsLoading(false);
      }
    },
    [cacheKey, filters, locationName]
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
        saveToStorage(LOCATION_NAME_STORAGE_KEY, locationName);
        setNormalizedLocation(locationName.trim().replace(/\s+/g, "_").toLowerCase());
  }, [locationName]);
  useEffect(() => saveToStorage(FACILITIES_STORAGE_KEY, facilities), [facilities]);
  useEffect(() => saveToStorage(COORDS_STORAGE_KEY, coords), [coords]);
  // useEffect(() => saveToStorage(LOCATION_NAME_STORAGE_KEY, locationName), [locationName]);
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
