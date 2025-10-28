'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import { useFacilities, Facility } from "../context/FacilitiesContext";
import MapView from '../components/MapView';
import FacilityReviewSkeleton from '../components/ReviewSkeleton';
import { FilterButton } from '../components/FilterButton';
import { motion } from "framer-motion";
import { SearchNursing } from '../components/SearchNursing';
import { Footer } from '../components/Footer';
import AdUnit from "../components/AdUnit";
import { mapRawFacilityToCard, RawFacility } from '../utils/facilityMapper';
import Link from "next/link";
import HeaderFacility from '../components/HeaderFacility';


const API_URL = "https://app.carenav.io/api/facilities/with-reviews";
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7;


// export const mapRawFacilityToCard = (raw: any, coords: { lat: number; lng: number } | null) => {
//   return {
//     id: raw._id || raw.id,
//     name: raw.googleName || raw.name,
//     address: raw.provider_address || raw.address,
//     city: raw.city_town || raw.city,
//     state: raw.state,
//     zip: raw.zip_code || raw.zip,
//     phone: raw.telephone_number || raw.phone,
//     beds: raw.number_of_certified_beds || raw.beds,
//     lat: raw.lat || raw.latitude || raw.geoLocation?.coordinates?.[1] || 0,
//     lng: raw.lng || raw.longitude || raw.geoLocation?.coordinates?.[0] || 0,
//     isNonProfit: raw.ownership_type?.toLowerCase().includes("non") || false,
//     provider_name: raw.provider_name,
//     pros: raw.aiSummary?.pros?.join(", ") || "No specific pros listed",
//     cons: raw.aiSummary?.cons?.join(", ") || "No specific cons listed",
//     imageUrl: raw.photo || "/default_facility_image.png",
//     status: raw.status || "Unknown",
//     hours: raw.operating_hours || "",
//     rating: raw.rating || raw.overall_rating || 0,
//     distance: coords && raw.lat && raw.lng
//       ? getDistanceFromCoords(coords.lat, coords.lng, raw.lat, raw.lng)
//       : null,
//   };
// };

// page.ts





// export const getDistanceFromCoords = (
//   lat1: number,
//   lng1: number,
//   lat2: number,
//   lng2: number
// ) => {
//   const toRad = (x: number) => (x * Math.PI) / 180;
//   const R = 6371; // km
//   const dLat = toRad(lat2 - lat1);
//   const dLng = toRad(lng2 - lng1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // distance in km
// };



// function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
//   const delta = 1; // number of pages to show around current page
//   const range: (number | string)[] = [];
//   let left = currentPage - delta;
//   let right = currentPage + delta;

//   if (left < 1) {
//     left = 1;
//     right = Math.min(1 + 2 * delta, totalPages);
//   }

//   if (right > totalPages) {
//     right = totalPages;
//     left = Math.max(1, totalPages - 2 * delta);
//   }

//   // Add first page
//   if (left > 1) {
//     range.push(1);
//     if (left > 2) range.push("...");
//   }

//   // Add middle pages
//   for (let i = left; i <= right; i++) {
//     range.push(i);
//   }

//   // Add last page
//   if (right < totalPages) {
//     if (right < totalPages - 1) range.push("...");
//     range.push(totalPages);
//   }

//   return range;
// }

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const windowSize = 3; // number of pages in sliding window

  if (totalPages <= windowSize + 1) {
    // If total pages are small, show all
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    // Determine start of window
    let start = currentPage;
    let end = start + windowSize - 1;

    // Make sure we don’t exceed totalPages - 1 (last page reserved)
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - windowSize + 1;
    }

    // Add window pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}




// function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
//   const pages: (number | string)[] = [];
//   if (totalPages <= 6) {
//     for (let i = 1; i <= totalPages; i++) pages.push(i);
//   } else {
//     if (currentPage <= 3) pages.push(1, 2, 3, "...", totalPages);
//     else if (currentPage >= totalPages - 2)
//       pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
//     else pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
//   }
//   return pages;
// }


const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const extractFacilityCoords = (facilities: Facility[]) => {
  return facilities
    .filter((f) => f.lat && f.lng)
    .map((f) => ({
      lat: f.lat!,
      lng: f.lng!,
      name:
        (f as any).provider_name ||
        (f as any).legal_business_name ||
        f.name ||
        "Unknown Facility",
    }));
};



const calculateMapCenter = (
  facilities: Facility[],
  searchCoords: { lat: number; lng: number } | null
) => {
  if (searchCoords) return searchCoords;

  const valid = facilities.filter((f) => f.lat && f.lng);
  if (valid.length === 0) return { lat: 34.0522, lng: -118.2437 }; // Default LA

  const totalLat = valid.reduce((sum, f) => sum + (f.lat ?? 0), 0);
  const totalLng = valid.reduce((sum, f) => sum + (f.lng ?? 0), 0);
  return { lat: totalLat / valid.length, lng: totalLng / valid.length };
};

const getStatusColor = (status: Facility['status']): string => {
  switch (status) {
    case 'Accepting': return 'text-[#16A34A]';
    case 'Waitlist': return 'text-[#FACC15]';
    case 'Full': return 'text-[#DC2626]';
    default: return 'text-[#4B5563]';
  }
};


type ViewMode = "both" | "mapOnly";

export default function FacilitySearchPage() {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>("both");


 
  const [openAuth, setOpenAuth] = React.useState(false);
  const {
    facilities: initialFacilities,
    locationName,
    total: totalCountFromProvider = 0,
    isLoading,
    coords,
    totalPages,
    error,
    recommendations
  } = useFacilities();

  const [filters, setFilters] = useState({
      city: "",
      state: "",
      ratingMin: "",
      ownership: "",
      locationName: "",
      distance: "",
      beds: "",
    });
  console.log('locationName from context',locationName);

  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showSkeletonTimer, setShowSkeletonTimer] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingFacilityId, setLoadingFacilityId] = useState<string | null>(null);
  const [allFacilities, setAllFacilities] = useState<Facility[]>(initialFacilities);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>(initialFacilities);
  const [usingFilters, setUsingFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [totalFacilities, setTotalFacilities] = useState(totalCountFromProvider || 0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  // =====================
  const [paginatedFacilities, setPaginatedFacilities] = useState<Facility[]>([]);
  const [hasRestoredFromCache, setHasRestoredFromCache] = useState(false);




console.log('recommendations',recommendations);

// =====================
// 💾 Restore from cache on mount
// =====================
useEffect(() => {
  if (typeof window === "undefined") return;

  const cachedMeta = localStorage.getItem("facilities_meta");
  const cachedPage1 = localStorage.getItem("facilities_page_1");

  if (cachedPage1) {
    try {
      const parsed = JSON.parse(cachedPage1);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("✅ Restored page 1 from cache");
        setAllFacilities(parsed);
        setFilteredFacilities(parsed);
        setPaginatedFacilities(parsed);
        setHasRestoredFromCache(true); 
      }
    } catch (e) {
      console.error("Failed to parse cached page 1:", e);
    }
  }
  if (cachedMeta) {
    try {
      const meta = JSON.parse(cachedMeta);
      if (meta.totalFacilities) setTotalFacilities(meta.totalFacilities);
    } catch (e) {
      console.error("Failed to parse cached meta:", e);
    }
  }
}, []);

// =====================
// 💾 Save first page cache when initialFacilities loads
// =====================
useEffect(() => {
  if (typeof window === "undefined") return;
  if (!initialFacilities || initialFacilities.length === 0) return;

  // 🧠 Skip caching on first load if we already restored from cache
  if (hasRestoredFromCache && currentPage === 1) {
    console.log("⚠️ Skipping cache overwrite after restore");
    return;
  }

  console.log("💾 Caching first page facilities",initialFacilities);
  localStorage.setItem("facilities_page_1", JSON.stringify(initialFacilities));
  localStorage.setItem(
    "facilities_meta",
    JSON.stringify({
      totalFacilities: totalCountFromProvider || initialFacilities.length,
      totalPages: Math.ceil(
        (totalCountFromProvider || initialFacilities.length) / ITEMS_PER_PAGE
      ),
    })
  );

  setAllFacilities(initialFacilities);
  setFilteredFacilities(initialFacilities);
  if (currentPage === 1) setPaginatedFacilities(initialFacilities);
}, [initialFacilities, totalCountFromProvider, currentPage, hasRestoredFromCache]);

// =====================
// 🔁 Get facilities by page — cache first
// =====================
const getPaginatedFacilities = (page: number): Facility[] => {
  const cacheKey = `facilities_page_${page}`;
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`⚡ Using cached page ${page}`);
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse cache for page", page, e);
        localStorage.removeItem(cacheKey);
      }
    }
  }

  // fallback: slice filteredFacilities for pages 1–6
  const start = (page - 1) * ITEMS_PER_PAGE;
  return filteredFacilities.slice(start, start + ITEMS_PER_PAGE);
};

// =====================
// 🔄 Load page effect
// =====================
useEffect(() => {
  const pageData = getPaginatedFacilities(currentPage);
  if (pageData.length > 0) {
    setPaginatedFacilities(pageData);
  } else if (currentPage > 1) {
    loadPage(currentPage);
  }
}, [currentPage, filteredFacilities]);

// const [paginatedFacilities, setPaginatedFacilities] = useState<Facility[]>(() => {
//   if (typeof window !== "undefined") {
//     const cached = localStorage.getItem("facilities_page_1");
//     if (cached) {
//       try {
//         const parsed = JSON.parse(cached);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           console.log("⚡ Instant restore from cache (before render)");
//           return parsed;
//         }
//       } catch (e) {
//         console.error("Failed to parse cache:", e);
//       }
//     }
//   }
//   return initialFacilities || [];
// });


// // ✅ Get facilities by page — cached (1–6) or from localStorage (7+)
// const getPaginatedFacilities = (page: number): Facility[] => {
//   const start = (page - 1) * ITEMS_PER_PAGE;

//   if (page <= 6) {
//     return filteredFacilities.slice(start, start + ITEMS_PER_PAGE);
//   }

//   if (typeof window !== "undefined") {
//     const cached = localStorage.getItem(`facilities_page_${page}`);
//     return cached ? JSON.parse(cached) : [];
//   }

//   return [];
// };
// // 🧠 Restore all cached pages on mount
// useEffect(() => {
//   if (typeof window === "undefined") return;

//   const cachedMeta = localStorage.getItem("facilities_meta");
//   const cachedFacilities = localStorage.getItem("facilities_page_1");

//   if (cachedFacilities) {
//     try {
//       const parsed = JSON.parse(cachedFacilities);
//       setAllFacilities(parsed);
//       setFilteredFacilities(parsed);
//       setPaginatedFacilities(parsed);
//       console.log("✅ Restored from cache");
//     } catch (e) {
//       console.error("Failed to restore cache:", e);
//     }
//   } else if (initialFacilities && initialFacilities.length > 0) {
//     // First-time load — cache immediately
//     console.log("💾 First-time cache save");
//     localStorage.setItem("facilities_page_1", JSON.stringify(initialFacilities));
//     localStorage.setItem(
//       "facilities_meta",
//       JSON.stringify({
//         totalFacilities: totalCountFromProvider || initialFacilities.length,
//         totalPages: Math.ceil(
//           (totalCountFromProvider || initialFacilities.length) / ITEMS_PER_PAGE
//         ),
//       })
//     );
//   }
// }, [initialFacilities, totalCountFromProvider]);


// // 🔁 When currentPage changes, show cached or fetch
// useEffect(() => {
//   const pageData = getPaginatedFacilities(currentPage);
//   if (pageData.length > 0) {
//     setPaginatedFacilities(pageData);
//   } else {
//     loadPage(currentPage);
//   }
// }, [currentPage, filteredFacilities]);




const ITEMS_PER_PAGE = 8;

useEffect(() => {
  setAllFacilities(initialFacilities);
  if (!usingFilters) {
    setFilteredFacilities(initialFacilities);
  }
}, [initialFacilities, usingFilters]);

// ✅ Keep filtered facilities in sync
useEffect(() => {
  if (!usingFilters) {
    setFilteredFacilities(allFacilities);
  }
}, [allFacilities, usingFilters]);





const handleViewDetails = async (facility: any) => {
  setLoadingFacilityId(facility.id);
  const facilitySlug = slugify(facility.name);
  router.push(`/facility/${facility.id}/${facilitySlug}`);

};


const loadPage = useCallback(
  async (page: number) => {
    console.log("🟡 loadPage triggered for page:", page);

    const cacheKey = `facilities_page_${page}`;
    try {
      // 🗃️ 1️⃣ Try local cache first
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log("✅ Using cached data for", cacheKey);
              setPaginatedFacilities(parsed as Facility[]);
              return;
            } else {
              console.warn("⚠️ Cache invalid or empty:", cacheKey);
            }
          }
        } catch (cacheErr) {
          console.error("❌ Cache parsing error for", cacheKey, cacheErr);
          localStorage.removeItem(cacheKey);
        }
      }

      // 🚫 2️⃣ Validate input
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ Missing token — skipping fetch");
        return;
      }

      if (!locationName?.trim()) {
        console.warn("⚠️ Missing location name — skipping fetch");
        return;
      }

      // 🌐 3️⃣ Prepare API request
      const params = new URLSearchParams();
      const normalizedQuery = locationName.trim().replace(/\s+/g, "_");
      params.append("q", normalizedQuery);
      params.append("page", page.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());

      if (coords?.lat && coords?.lng) {
        params.append("lat", coords.lat.toString());
        params.append("lng", coords.lng.toString());
      }

      const url = `${API_URL}/?${params.toString()}`;
      console.log("🌐 Fetching:", url);
      setIsPageLoading(true);

      // 🧠 4️⃣ Fetch API
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();
      console.log("✅ API Response:", data);

      // 🧩 5️⃣ Validate structure
      if (!data || typeof data !== "object" || !Array.isArray(data.data)) {
        console.warn("⚠️ Unexpected response: missing facilities array");
        setPaginatedFacilities([]);
        return;
      }

      const { data: facilityList } = data;

      // 🧭 6️⃣ Map raw → typed Facility
      const mapped: Facility[] = facilityList.map((f: RawFacility) =>
        mapRawFacilityToCard(f, coords)
      );

      // 🧮 7️⃣ Update state
      setPaginatedFacilities(mapped);

      // 💾 8️⃣ Cache result
      // if (typeof window !== "undefined" && mapped.length > 0) {
      //   localStorage.setItem(cacheKey, JSON.stringify(mapped));
      //   console.log(`💾 Cached ${mapped.length} facilities for page ${page}`);
      // }

      // 💾 8️⃣ Cache result + meta
      if (typeof window !== "undefined" && mapped.length > 0) {
        localStorage.setItem(cacheKey, JSON.stringify(mapped));
        localStorage.setItem(
          "facilities_meta",
          JSON.stringify({
            totalFacilities: data?.total ?? mapped.length,
            totalPages: data?.totalPages ?? Math.ceil((data?.total ?? mapped.length) / ITEMS_PER_PAGE),
          })
        );
        console.log(`💾 Cached ${mapped.length} facilities for page ${page}`);
      }

      // 🧾 9️⃣ Log cache-layer hits
      if (data.cached || data.from === "cache-only") {
        console.log("⚡ Data served from API cache layer");
      }
    } catch (err: any) {
      console.error("❌ loadPage failed:", err?.message || err);
      setPaginatedFacilities([]);
    } finally {
      setIsPageLoading(false);
    }
  },
  [coords, locationName]
);



// =====================
// 🧭 PAGINATION HANDLERS
// =====================
const goToPage = (page: number) => {
  if (page < 1 || page > totalFacilityPages) return;

  console.log("📄 Switching to page:", page);
  setCurrentPage(page);

  // 🟢 Only call loadPage for page > 1 (page 1 is already in provider)
  if (page > 1) loadPage(page);
};

const goToNextPage = () => {
  if (currentPage < totalFacilityPages) {
    const nextPage = currentPage + 1;
    goToPage(nextPage);
  }
};

const goToPrevPage = () => {
  if (currentPage > 1) {
    const prevPage = currentPage - 1;
    goToPage(prevPage);
  }
};

// =====================
// 🧩 AUTO LOAD PAGE 1 (INITIAL)
// =====================
useEffect(() => {
  if (currentPage === 1 && initialFacilities.length > 0) {
    console.log("🔹 Using initial facilities for page 1");
    setPaginatedFacilities(initialFacilities);
  } else if (currentPage > 1) {
    console.log("🔹 Fetching facilities for page", currentPage);
    loadPage(currentPage);
  }
}, [currentPage, initialFacilities, loadPage]);

// =====================
// 🧮 RANGE + PAGE GROUPS
// =====================
const startFacility =
  totalFacilities > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
const endFacility = Math.min(startFacility + ITEMS_PER_PAGE - 1, totalFacilities);

const totalFacilityPages = Math.ceil(totalFacilities / ITEMS_PER_PAGE);
// const totalFacilityPages = Math.ceil(totalFacilities / ITEMS_PER_PAGE);

const getVisiblePageNumbers = (
  currentPage: number,
  totalPages: number,
  groupSize = 6
): number[] => {
  // Determine which group the current page is in
  const groupIndex = Math.floor((currentPage - 1) / groupSize);
  const startPage = groupIndex * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  // Return array of page numbers in the current group
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};



// const fetchFilteredFacilities = async (newFilters?: typeof filters) => {
//   const appliedFilters = newFilters || filters;
//   setIsFiltering(true);

//   try {
//     const params = new URLSearchParams();

//     Object.entries(appliedFilters).forEach(([key, value]) => {
//       if (value.trim()) params.append(key, value.trim());
//     });


//     if (coords?.lat && coords?.lng) {
//       params.append("userLat", coords.lat.toString());
//       params.append("userLng", coords.lng.toString());
//     }

//     const hasFilters = [...params].length > 0;

//     if (!hasFilters) {
//       setFilteredFacilities(initialFacilities);
//       setUsingFilters(false);
//       setCurrentPage(1);
//       setIsFiltering(false);
//       return;
//     }

//     if (!appliedFilters.locationName) {
//       if (locationName) {
//         params.set("locationName", locationName);
//       } else {
//         const facilityCoords = extractFacilityCoords(initialFacilities);
//         if (facilityCoords.length > 0) params.set("locationName", facilityCoords[0].name);
//       }
//     }

//     const apiUrl = `https://app.carenav.io/api/facilities/filter-with-reviews?${params.toString()}`;
//     const res = await fetch(apiUrl);
//     const data = await res.json();

//     if (!res.ok || !data.facilities || data.facilities.length === 0) {
//       setFilteredFacilities([]);
//       setUsingFilters(true);
//       setIsFiltering(false);
//       toast.error("No Facilities Found");
//       return;
//     }

//     const mappedFacilities = (data.facilities || []).map((f: any) => ({
//       id: f._id || f.id,
//       name: f.googleName || f.name,
//       address: f.provider_address || f.address,
//       city: f.city_town || f.city,
//       state: f.state,
//       zip: f.zip_code || f.zip,
//       phone: f.telephone_number || f.phone,
//       beds: f.number_of_certified_beds || f.beds,
//       lat: f.lat || f.latitude || f.geoLocation?.coordinates[1],
//       lng: f.lng || f.longitude || f.geoLocation?.coordinates[0],
//       isNonProfit: (f.ownership_type?.toLowerCase().includes("non") || false),
//       provider_name: f.provider_name,
//       pros: f.aiSummary?.pros?.join(", ") || "No specific pros listed",
//       cons: f.aiSummary?.cons?.join(", ") || "No specific cons listed",
//       imageUrl: f.photo || "/Default_image.png",
//       status: f.status || "Unknown",
//       hours: f.operating_hours || "",
//       rating: f.rating || f.overall_rating || 0,
//     }));

//     setFilteredFacilities(mappedFacilities);
//     setUsingFilters(true);
//     setCurrentPage(1);
//     toast.success("Filters applied!");
//   } catch (err: any) {
//     setFilteredFacilities([]);
//     toast.error(err.message || "Error applying filters");
//   } finally {
//     setIsFiltering(false);
//   }
// };

const fetchFilteredFacilities = async (newFilters?: typeof filters) => {
  const appliedFilters = newFilters || filters;
  setIsFiltering(true);

  try {
    const params = new URLSearchParams();

    // 🧩 1️⃣ Build query params from filters (clean strings)
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) {
        // Trim spaces and replace internal spaces with underscores
        const cleanValue = value.trim().replace(/^\+/, "").replace(/\s+/g, "_");
        params.append(key, cleanValue);
      }
    });

    // 🧭 2️⃣ Add user coordinates if available
    if (coords?.lat && coords?.lng) {
      params.append("userLat", coords.lat.toString());
      params.append("userLng", coords.lng.toString());
    }

    const hasFilters = [...params].length > 0;

    // 🔄 3️⃣ No filters → reset to initial data
    if (!hasFilters) {
      setFilteredFacilities(initialFacilities);
      setUsingFilters(false);
      setCurrentPage(1);
      setIsFiltering(false);
      return;
    }

    // 🏙️ 4️⃣ Ensure locationName is present
    if (!params.has("locationName")) {
      let location = locationName?.trim() || "";
      if (!location) {
        const facilityCoords = extractFacilityCoords(initialFacilities);
        location = facilityCoords.length > 0 ? facilityCoords[0].name.trim() : "";
      }
      if (location) {
        // ✅ normalize: remove leading +, replace spaces with _
        params.set("locationName", location.replace(/^\+/, "").replace(/\s+/g, "_"));
      }
    }

    // 🌐 5️⃣ Build final API URL
    const apiUrl = `https://app.carenav.io/api/facilities/filter-with-reviews?${params.toString()}`;
    console.log("🌐 Fetching filtered facilities:", apiUrl);

    const res = await fetch(apiUrl);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();

    if (!data.facilities || data.facilities.length === 0) {
      setFilteredFacilities([]);
      setUsingFilters(true);
      setIsFiltering(false);
      toast.error("No facilities found");
      return;
    }

    // 🧭 6️⃣ Map raw → typed Facility
    const mappedFacilities: Facility[] = data.facilities.map((f: RawFacility) =>
      mapRawFacilityToCard(f, coords)
    );

    // 🧮 7️⃣ Update state
    setFilteredFacilities(mappedFacilities);
    setUsingFilters(true);
    setCurrentPage(1);

    toast.success("Filters applied!");
  } catch (err: any) {
    console.error("❌ Filter fetch failed:", err);
    setFilteredFacilities([]);
    toast.error(err.message || "Error applying filters");
  } finally {
    setIsFiltering(false);
  }
};

 


// const fetchFilteredFacilities = async (newFilters?: typeof filters) => {
//   const appliedFilters = newFilters || filters;
//   setIsFiltering(true);

//   try {
//     const params = new URLSearchParams();

//     // 🧩 1️⃣ Build query params from filters
//     Object.entries(appliedFilters).forEach(([key, value]) => {
//       if (typeof value === "string" && value.trim()) {
//         params.append(key, value.trim());
//       }
//     });

//     // 🧭 2️⃣ Add user coordinates
//     if (coords?.lat && coords?.lng) {
//       params.append("userLat", coords.lat.toString());
//       params.append("userLng", coords.lng.toString());
//     }

//     const hasFilters = [...params].length > 0;
//     if (!hasFilters) {
//       // 🔄 Reset filters and use initial data
//       setFilteredFacilities(initialFacilities);
//       setUsingFilters(false);
//       setCurrentPage(1);
//       setIsFiltering(false);
//       return;
//     }

//     // 🏙️ 3️⃣ Ensure locationName is present
//     if (!appliedFilters.locationName) {
//       if (locationName) {
//         params.set("locationName", locationName);
//       } else {
//         const facilityCoords = extractFacilityCoords(initialFacilities);
//         if (facilityCoords.length > 0)
//           params.set("locationName", facilityCoords[0].name);
//       }
//     }

//     // 🌐 4️⃣ Fetch filtered data
//     const apiUrl = `https://app.carenav.io/api/facilities/filter-with-reviews?${params.toString()}`;
//     console.log("🌐 Fetching filtered facilities:", apiUrl);

//     const res = await fetch(apiUrl);
//     const data = await res.json();

//     if (!res.ok || !data.facilities || data.facilities.length === 0) {
//       setFilteredFacilities([]);
//       setUsingFilters(true);
//       setIsFiltering(false);
//       toast.error("No facilities found");
//       return;
//     }

//     // 🧭 5️⃣ Map raw → typed Facility
//     const mappedFacilities: Facility[] = (data.facilities || []).map((f: RawFacility) =>
//       mapRawFacilityToCard(f, coords)
//     );

//     // 🧮 6️⃣ Update state
//     setFilteredFacilities(mappedFacilities);
//     setUsingFilters(true);
//     setCurrentPage(1);
//     toast.success("Filters applied!");
//   } catch (err: any) {
//     console.error("❌ Filter fetch failed:", err);
//     setFilteredFacilities([]);
//     toast.error(err.message || "Error applying filters");
//   } finally {
//     setIsFiltering(false);
//   }
// };



// Scroll to recommendations once loaded
useEffect(() => {
  if (recommendations.length) {
    document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
  }
}, [recommendations]);


const mapCenter = useMemo(
  () => calculateMapCenter(filteredFacilities, selectedCoords || coords),
  [filteredFacilities, selectedCoords, coords]
);

const facilityCoords = useMemo(
  () => extractFacilityCoords(filteredFacilities),
  [filteredFacilities]
);



  const handleCardClick = (facility: any) => {
    setSelectedFacilityId(facility.id);
    if (facility.lat && facility.lng) {
      setSelectedCoords({ lat: facility.lat, lng: facility.lng });
    }
  };

  useEffect(() => {
    // Scroll smoothly to top of the facility list section
    const facilityList = document.getElementById("facility-list");
    if (facilityList) {
      facilityList.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // fallback: scroll window to top if element not found
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeletonTimer(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      if (initialFacilities.length === 0 && !isLoading) router.push("/");
    }
  }, [router, initialFacilities.length, isLoading]);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    setCurrentPage(1);
  }, [filteredFacilities]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    router.push('/');
  };

  console.log('NEWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',locationName)
  
  console.log(`DEBUG 2: Facilities in Search Page: ${initialFacilities.length}`);
  console.log(`DEBUG 3: Facility Coords for MapView: ${facilityCoords.length}`, facilityCoords);
  console.log("DEBUG 4: Calculated Map Center:", mapCenter);

  {
    isPrefetching && (
      <div className="flex justify-center items-center w-full py-10">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p className="ml-4 text-gray-600">Fetching remaining facilities...</p>
      </div>
    )
  }

  // if (isLoading || showSkeletonTimer) {
  //   return <FacilityReviewSkeleton />;
  // }

  if (error) {
    return (
      <div className="p-10 text-center text-xl font-medium text-red-600">
        Error loading facilities: {error}
      </div>
    );
  }

  // // ✅ Case 1: No facilities at all (initial load or context empty)
  // if (initialFacilities.length === 0 && !isLoading) {
  //   return (
  //     <div className="p-10 text-center text-xl">
  //       <h2 className="text-2xl font-bold mb-2">No Facilities Found</h2>
  //       <p className="text-gray-600">
  //         We couldn’t find any facilities matching your location.
  //       </p>
  //       <Button
  //         onClick={() => router.push('/')}
  //         className="mt-4 bg-red-600 hover:bg-red-700"
  //       >
  //         Start a New Search
  //       </Button>
  //     </div>
  //   );
  // }

 


  const slugify = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  return (
    <>

    
      <HeaderFacility />
      {isLoading || showSkeletonTimer ? (
          <FacilityReviewSkeleton />
        ) : (
        <>
      <section className="w-full min-h-[60px] bg-[#F5F5F5] flex items-center justify-start  px-4 sm:px-6">
        <div className="flex items-center gap-x-1 sm:gap-x-2 text-[#4B5563] mx-2 sm:mx-13 font-inter font-normal text-[14px] sm:text-[16.28px] leading-[20px] sm:leading-[23.26px] md:mx-37">
          {/* <span className="align-middle">Home</span> */}
          <Link
            href="/"
            className="align-middle"
          >
            Home
          </Link>
          <img
            src="/icons/search_fac_right_icon.png"
            alt="Arrow"
            className="w-[6px] h-[10px] sm:w-[8.72px] sm:h-[13.95px] align-middle"
          />
          <Link
            href="/facility-search"
            className="align-middle"
          >
            Search Results
          </Link>
          {/* <span className="align-middle">Search Results</span> */}
          <img
            src="/icons/search_fac_right_icon.png"
            alt="Arrow"
            className="w-[6px] h-[10px] sm:w-[8.72px] sm:h-[13.95px] align-middle"
          />
          <span className="font-inter font-medium text-[14px] sm:text-[16.71px] leading-[20px] sm:leading-[23.87px] text-[#111827] align-middle truncate max-w-[200px] sm:max-w-none">
            {/* {locationName
              ?.toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())} */}
              {locationName &&
                  locationName
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}

          </span>
        </div>
      </section>

      {/* --------------------- Top Recommendations --------------------- */}
      {/* <section className="w-full p-4 sm:p-6 bg-white" id="recommendations">
        <h2 className="text-2xl font-bold mb-4">Top Recommendations</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map((facility) => (
            <motion.div
              key={facility.id}
              layout
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              onClick={() => handleCardClick(facility)}
            >
              <div className="relative h-40 w-full bg-gray-200">
                {facility.photo ? (
                  <img
                    src={facility.photo}
                    alt={facility.provider_name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">{facility.provider_name}</h3>
                <p className="text-gray-600 text-sm truncate">{facility.city_town}, {facility.state}</p>
                {facility.rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="text-gray-800">{facility.rating}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}


      <section className="w-full min-h-[148px] mx-auto bg-white flex flex-col justify-center px-4 sm:px-6 py-4 ">
        <div className="flex flex-col md:flex-col md:items-start w-full mb-4 gap-4">

          {/* Top Row - Info + Toggle */}
          <div className="flex flex-row items-center justify-between flex-wrap gap-y-2 w-full mb-2 md:mb-0">

            {/* Info Section */}
            <div className="flex flex-col items-start flex-wrap gap-x-0 sm:gap-x-4 ml-0 md:ml-[90px] md:flex-1 md:min-w-[150px] lg:min-w-[250px]">
              <span className="font-inter font-medium text-[15px] sm:text-[17px] leading-[22px] sm:leading-[26px] text-[#111827] ml-2 sm:ml-[55px]">
                {totalFacilities} Facilities Found in{" "}
                {locationName &&
                  locationName
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}

                {/* {locationName?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())} */}
              </span>

              <div className="flex items-center gap-2 ml-2 sm:ml-13 mt-[2px] flex-shrink-0 md:ml-14">
                <img
                  src="/icons/location_icon_new.png"
                  alt="Location Icon"
                  className="w-[12px] h-[16px] sm:w-[14px] sm:h-[18px]"
                />
                <span className="font-inter font-normal text-[13px] sm:text-[15px] text-[#6B7280]">
                  Within 25 miles
                </span>
              </div>
            </div>

            {/* List/Map Toggle */}
            <div className="flex items-center justify-end ml-2 w-auto sm:mt-0 mt-0">
              <button
                type="button"
                className="relative flex items-center justify-between w-[88px] sm:w-[100px] h-[40px] sm:h-[48px] border border-[#D1D5DB] rounded-[9.3px] bg-white overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 bottom-0 w-1/2 bg-[#D02B38] rounded-[9.3px]"
                  animate={{ x: viewMode === "both" ? 0 : "100%" }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />

                <div
                  className="flex items-center justify-center w-1/2 h-full z-10 cursor-pointer"
                  onClick={() => setViewMode('both')}
                >
                  <img
                    src="/icons/list_icon.png"
                    alt="List Icon"
                    className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] transition-all duration-200 ${viewMode === 'both' ? 'brightness-200' : 'brightness-0 opacity-80'
                      }`}
                  />
                </div>

                <div
                  className="flex items-center justify-center w-1/2 h-full z-10 cursor-pointer"
                  onClick={() => setViewMode('mapOnly')}
                >
                  <img
                    src="/icons/map_icon.png"
                    alt="Map Icon"
                    className={`w-[16px] h-[14px] sm:w-[18px] sm:h-[16px] transition-all duration-200 ${viewMode === 'mapOnly' ? 'brightness-200' : 'brightness-0 opacity-80'
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* ✅ Ads Section */}
          <div className="w-full flex flex-col items-center justify-center relative z-10">
            <div className="block md:hidden w-[250px] h-[200px] max-sm:w-[250px] max-sm:h-[200px] sm:w-[300px] sm:h-[250px] mx-auto">
              <AdUnit adSlot="1234567890" layout="square" />
            </div>

            {/* ✅ md+ screens: Banner Ad */}
            <div className="hidden md:flex w-full justify-start px-4 sm:px-8 md:px-10 lg:px-24 xl:px-32 mt-6 ">
              <div className="w-full sm:w-[700px] md:w-[1000px] lg:w-[1200px] xl:w-[1600px] h-[90px] lg:mx-8">
                <AdUnit adSlot="1234567890" layout="banner" />
              </div>
            </div>

          </div>

        </div>




        <div id="facility-list" className="w-full max-w-[calc(100%-100px)] mx-auto px-4 sm:px-6 md:mx-30 lg:px-8 relative z-10">
          <div
            className="
              flex flex-wrap md:flex-wrap filter-grid items-center justify-start sm:justify-start
              gap-x-3 sm:gap-x-4 gap-y-4 sm:gap-y-5 md:gap-y-0
              mt-2 sm:mt-4 md:mt-6
              w-full
              overflow-x-auto md:overflow-visible
              overflow-y-hidden
              pt-2 sm:pt-3 md:pt-0 filter-button
              relative z-10
            "
          >


            {/* Star Filter */}
            <FilterButton
              iconLeft="/icons/stars_icon.png"
              label={filters.ratingMin ? `${filters.ratingMin}+ Stars` : "Stars"}
              options={[5, 4, 3, 2, 1]}
              value={filters.ratingMin}
              onSelect={(val) => {
                const newFilters = { ...filters, ratingMin: val.toString() };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              onClear={() => {
                const newFilters = { ...filters, ratingMin: "" };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              className="flex items-center justify-center gap-2 w-[130px] h-[43px] rounded-[9.56px] bg-[#D02B38] px-3 font-inter font-medium text-[16.72px] leading-[23.89px] text-white"
              textWhite
              iconLeftWidth="18px"
              iconLeftHeight="16px"
              redButton={true}
            />

            {/* Distance Filter */}
            <FilterButton
              iconLeft="/icons/location_icon_new.png"
              iconRight="/icons/down_icon.png"
              label="Distance Km"
              options={["1", "5", "10", "20", "50"]}
              value={filters.distance}
              onSelect={(val) => {
                const newFilters = { ...filters, distance: val.toString() };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              onClear={() => {
                const newFilters = { ...filters, distance: "" };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              iconLeftWidth="14px"
              iconLeftHeight="18px"
              iconRightWidth="12px"
              iconRightHeight="10px"
            />

            {/* Bed Capacity Filter */}
            <FilterButton
              iconLeft="/icons/Bed_icon.png"
              iconRight="/icons/down_icon.png"
              label="Bed Capacity"
              options={["<20", "20-50", "50-100", "100+"]}
              value={filters.beds}
              onSelect={(val) => {
                const newFilters = { ...filters, beds: val.toString() };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              onClear={() => {
                const newFilters = { ...filters, beds: "" };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              iconLeftWidth="23px"
              iconLeftHeight="18px"
              iconRightWidth="12px"
              iconRightHeight="10px"
            />

            {/* Ownership Filter */}
            <FilterButton
              iconLeft="/icons/building_icon.png"
              iconRight="/icons/down_icon.png"
              label="Ownership"
              options={["Non-Profit", "Private", "Government"]}
              value={filters.ownership}
              onSelect={(val) => {
                const newFilters = { ...filters, ownership: val.toString() };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              onClear={() => {
                const newFilters = { ...filters, ownership: "" };
                setFilters(newFilters);
                fetchFilteredFacilities(newFilters);
              }}
              iconLeftWidth="14px"
              iconLeftHeight="18px"
              iconRightWidth="10px"
              iconRightHeight="10px"
            />

            {/* More Filters (Custom Children) */}
            <FilterButton
              label="More Filters"
              iconLeft="/icons/filter_icon.png"
              iconRight="/icons/down_icon.png"
              iconRightWidth="12px"
              iconRightHeight="10px"
              onClear={() => {
                setFilters(f => ({ ...f, city: "", state: "" }));
                fetchFilteredFacilities();
              }}
              value={filters.city || filters.state}
            >
              <div className="flex flex-col gap-2 p-4 bg-white border border-gray-300 shadow-lg rounded-lg min-w-[200px]">
                <input
                  type="text"
                  placeholder="City"
                  className="border p-2 rounded-lg"
                  value={filters.city}
                  onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && fetchFilteredFacilities()}

                />
                <input
                  type="text"
                  placeholder="State"
                  className="border p-2 rounded-lg"
                  value={filters.state}
                  onChange={(e) => setFilters(f => ({ ...f, state: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && fetchFilteredFacilities()}
                />
                <Button
                  onClick={() => {
                    fetchFilteredFacilities();
                    toast.success("Filters applied!");
                  }}
                  className="bg-[#D02B38] text-white mt-2 p-2 rounded-lg hover:bg-[#af404a] transition"
                >
                  Apply
                </Button>
              </div>
            </FilterButton>
          </div>
        </div>
      </section>

      <section
        className={`flex flex-col md:mx-46 lg:flex-row gap-6 mx-4 sm:mx-6 lg:mx-2 mt-10 px-4 sm:px-6 lg:px-8 min-h-screen ${viewMode === "mapOnly" ? "lg:h-[677px]" : "min-h-[2368px]"
          }`}
      >
        <div className="hidden md:flex justify-center items-start w-[120px] my-18 lg:w-[120px]">
          <AdUnit adSlot="right-skyscraper" layout="skyscraper" />
        </div>
        {isFiltering || showSkeletonTimer ? (
          <FacilityReviewSkeleton />
        ) : filteredFacilities.length === 0 ? (
          <div className="flex justify-center items-center w-full h-[300px] text-gray-500 text-lg font-medium">
            No Facilities Found
          </div>
        ) : (
          <>
            {viewMode === "both" && (
              <>
                {isLoading || isPageLoading  ? (
                  <FacilityReviewSkeleton />
                ) : (
                  <div className="w-full lg:w-[720px] min-h-[400px] overflow-hidden space-y-4">
                    {paginatedFacilities.map((facility: Facility) => (
                      <div
                        key={facility.id}
                        onClick={() => handleCardClick(facility)}
                        className={`w-full bg-[#F9F9F9] rounded-[9.56px] shadow p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${selectedFacilityId?.toString() === facility.id
                          ? "border-l-[4.78px] border-t border-r border-b border-[#FACC15] border-l-[#FACC15]"
                          : ""
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Image */}
                          <div className="w-full sm:w-1/4 flex justify-center sm:justify-start mb-4 sm:mb-0">
                            <img
                              src={facility.imageUrl || "/Default_image.png"}
                              alt={facility.name}
                              className="w-[114px] h-[114px] object-cover rounded-[9.56px]"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 sm:ml-5">
                            <h3 className="text-[#111827] font-bold text-[20px] sm:text-[23.89px] leading-[28px] sm:leading-[33.45px]">
                              {facility.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-2">
                              <img
                                src="/icons/location_icon_new.png"
                                alt="Location Icon"
                                className="w-[12px] h-[16px]"
                              />
                              <span className="text-[#4B5563] text-sm sm:text-base">
                                {facility.distance != null
                                  ? `${facility.distance.toFixed(1)} miles`
                                  : ""}
                                {facility.address ? ` • ${facility.address}` : ""}
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3">
                              <div className="flex items-center gap-2">
                                <img
                                  src="/icons/bed_icon.png"
                                  alt="Beds Icon"
                                  className="w-[18px] h-[12px]"
                                />
                                <span className="text-[#4B5563] text-sm sm:text-base">
                                  {facility.beds} beds
                                </span>
                              </div>

                              <div className="flex flex-row items-center gap-2 sm:gap-3">
                                <span className="text-[#4B5563] text-sm sm:text-base">
                                  {facility.isNonProfit ? "Non-Profit" : "For-Profit"}
                                </span>
                                <span
                                  className={`text-sm sm:text-base font-medium ${getStatusColor(facility.status)}`}
                                >
                                  {facility.status}
                                </span>
                              </div>
                            </div>

                            {/* Pros & Cons */}
                            <div className="bg-[#F5F5F5] rounded-md p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 font-medium">✓</span>
                                <p className="text-green-600 text-sm leading-5">
                                  Pros:{" "}
                                  {facility.pros
                                    ? facility.pros.split(" ").length > 10
                                      ? facility.pros.split(" ").slice(0, 10).join(" ") + "..."
                                      : facility.pros
                                    : "No pros available"}
                                </p>
                              </div>

                              <div className="flex items-start gap-2">
                                <span className="text-red-600 font-medium">✗</span>
                                <p className="text-red-600 text-sm leading-5">
                                  Cons:{" "}
                                  {facility.cons
                                    ? facility.cons.split(" ").length > 10
                                      ? facility.cons.split(" ").slice(0, 10).join(" ") + "..."
                                      : facility.cons
                                    : "No cons available"}
                                </p>
                              </div>
                            </div>

                            {/* Contact + Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-3">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <img
                                    src="/icons/phone_icon.png"
                                    alt="Phone"
                                    className="w-[12px] h-[12px]"
                                  />
                                  <span className="text-[#4B5563] text-sm sm:text-base">
                                    {facility.phone}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <img
                                    src="/icons/clock_icon.png"
                                    alt="Clock"
                                    className="w-[12px] h-[12px]"
                                  />
                                  <span className="text-[#4B5563] text-sm sm:text-base">
                                    {facility.hours}
                                  </span>
                                </div>
                              </div>

                              <button
                                className="w-full sm:w-[136.76px] h-[43px] bg-[#D02B38] rounded-[4.78px] text-white font-inter font-medium text-[16.72px] leading-[23.89px] flex items-center justify-center text-center disabled:opacity-70"
                                onClick={() => handleViewDetails(facility)}
                                disabled={loadingFacilityId === facility.id}
                              >
                                {loadingFacilityId === facility.id ? (
                                  <div className="loader border-t-2 border-white border-solid rounded-full w-[18px] h-[18px] animate-spin"></div>
                                ) : (
                                  "View Details"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}


                    {/* {totalFacilityPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md shadow-sm p-4 mt-4 w-full">
                        <p className="text-[#4B5563] text-sm sm:text-base mb-2 sm:mb-0">
                          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalFacilities)} of {totalFacilities} facilities
                        </p>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-center sm:justify-end w-full sm:w-auto">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
                            className="px-3 py-2 border rounded-md text-sm sm:text-base hover:bg-gray-100 disabled:opacity-50"
                          >
                            Prev
                          </button>

                          {getPageNumbers(currentPage, totalFacilityPages).map((page, index) =>
                            typeof page === "number" ? (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-2 rounded-md text-sm sm:text-base ${currentPage === page
                                  ? "bg-[#D02B38] text-white"
                                  : "border hover:bg-gray-100"
                                  }`}
                              >
                                {page}
                              </button>
                            ) : (
                              <span key={`ellipsis-${index}`} className="px-2 text-gray-400 select-none">
                                ...
                              </span>
                            )
                          )}

                          <button
                            disabled={currentPage === totalFacilityPages}
                            onClick={() => goToPage(currentPage + 1)}
                            className="px-3 py-2 border rounded-md text-sm sm:text-base hover:bg-gray-100 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )} */}

                    {totalFacilityPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md shadow-sm p-4 mt-4 w-full">
                        <p className="text-[#4B5563] text-sm sm:text-base mb-2 sm:mb-0">
                          Showing {startFacility}–{endFacility} of {totalFacilities} facilities
                        </p>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-center sm:justify-end w-full sm:w-auto">
                          {/* Prev */}
                          <button
                            disabled={currentPage === 1}
                            onClick={goToPrevPage}
                            className="px-3 py-2 border rounded-md text-sm sm:text-base hover:bg-gray-100 disabled:opacity-50"
                          >
                            Prev
                          </button>

                          {/* Page numbers (1–6, 7–12, etc.) */}
                         {getPageNumbers(currentPage, totalFacilityPages).map((page, idx) => (
                            <button
                              key={idx}
                              onClick={() => typeof page === "number" && goToPage(page)}
                              className={`px-3 py-2 rounded-md text-sm sm:text-base ${
                                currentPage === page ? "bg-[#D02B38] text-white" : "border hover:bg-gray-100"
                              }`}
                              disabled={page === "..."} // disable ellipsis
                            >
                              {page}
                            </button>
                          ))}
                          {/* Next */}
                          <button
                            disabled={currentPage === totalFacilityPages}
                            onClick={goToNextPage}
                            className="px-3 py-2 border rounded-md text-sm sm:text-base hover:bg-gray-100 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}



                  </div>

                )}
                {/* --- Right Column (Map) --- */}
                <div className="w-full lg:w-[780px] h-[400px] lg:h-[677px] bg-white rounded-[9.56px] shadow flex items-center justify-center sticky top-6 overflow-hidden">
                  {GOOGLE_MAPS_API_KEY ? (
                    <MapView
                      facilities={facilityCoords}
                      centerCoords={mapCenter}
                      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                      locationName={locationName}
                      markerIconUrl="/icons/red_hospital_pin.png"
                    />
                  ) : (
                    <img
                      src="/map_placeholder.png"
                      alt="Map"
                      className="w-full h-full object-cover rounded-[9.56px]"
                    />
                  )}
                </div>
              </>
            )}

            {/* Map Only Mode */}
            {viewMode === "mapOnly" && (
              <div className="w-full h-[677px] bg-white rounded-[12.56px] shadow flex items-center justify-center overflow-hidden">
                <MapView
                  facilities={facilityCoords}
                  centerCoords={mapCenter}
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY!}
                  locationName={locationName}
                  markerIconUrl="/icons/red_hospital_pin.png"
                />
              </div>
            )}
          </>
        )}

        {/* ✅ Right Skyscraper Ad — visible only on md to lg */}
        {/* ✅ Right Skyscraper Ad — only visible on md+ */}
        <div className="hidden md:flex justify-center items-start w-[120px] my-18 lg:w-[120px]">
          <AdUnit adSlot="right-skyscraper" layout="skyscraper" />
        </div>
      </section>


      {/* <section className="w-[1736.7px] h-[566px] mx-50 mt-[80px]">
        <div className="w-[1548.03px] h-[488.59px]">
          <h2 className="font-jost font-bold text-[32px] leading-[38.4px] text-[#111827]">
            Search Tips &amp; Resources
          </h2>

          <p className="mt-2 font-inter font-normal text-[18px] leading-[28px] text-[#707070]">
            Make the most of your nursing home search
          </p>

          <div className="grid grid-cols-3 gap- mt-5">
            <div className="w-[470.85px] h-[377.33px] bg-[#F5F5F5] rounded-[9.68px] p-6">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/light_icon.png"
                  alt="Search Icon"
                  className="w-[21.77px] h-[29.02px]"
                />
                <h3 className="font-inter font-bold text-[21.77px] leading-[33.86px] text-[#111827]">
                  Search Tips
                </h3>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Visit facilities in person when possible
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Ask about staff-to-resident ratios
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Review recent inspection reports
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Consider location and family access
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[470.85px] h-[377.33px] bg-[#F5F5F5] rounded-[9.68px] p-6">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/question_icon.png"
                  alt="Search Icon"
                  className="w-[29.77px] h-[29.02px]"
                />
                <h3 className="font-inter font-bold text-[21.77px] leading-[33.86px] text-[#111827]">
                  Questions to Ask
                </h3>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    What services are included in the base rate?
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    How do you handle medical emergencies?
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    What activities and programs are available?
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[14.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Can I see the dining menu and meal options?
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[470.85px] h-[377.33px] bg-[#F5F5F5] rounded-[9.68px] p-6">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/light_icon.png"
                  alt="Search Icon"
                  className="w-[21.77px] h-[29.02px]"
                />
                <h3 className="font-inter font-bold text-[21.77px] leading-[33.86px] text-[#111827]">
                  Search Tips
                </h3>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/check_green.png"
                    alt="Check Icon"
                    className="w-[12.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Visit facilities in person when possible
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/check_green.png"
                    alt="Check Icon"
                    className="w-[12.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Compare multiple facilities before deciding
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/check_green.png"
                    alt="Check Icon"
                    className="w-[12.7px] h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[16.93px] leading-[24.19px] text-[#374151]">
                    Check reviews and official ratings online
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="w-full min-h-[566px] pb-5 px-4 sm:px-6 lg:px-12 xl:px-20 mt-[40px] sm:mt-[80px]">
        <div className="w-full max-w-[100%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[1200px] mx-auto">
          <h2
            className="font-jost font-bold 
                    text-[20px] sm:text-[26px] md:text-[32px] 
                    leading-[26px] sm:leading-[32px] md:leading-[38.4px] 
                    text-[#111827]"
          >
            Search Tips &amp; Resources
          </h2>

          <p
            className="mt-2 font-inter font-normal 
                    text-[14px] sm:text-[16px] md:text-[18px] 
                    leading-[22px] sm:leading-[26px] md:leading-[28px] 
                    text-[#707070]"
          >
            Make the most of your nursing home search
          </p>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-5">
            <div
              className="bg-[#F5F5F5] rounded-[9.68px] p-5 sm:p-6 md:p-7 min-h-[240px] sm:min-h-[377.33px] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img src="/icons/light_icon.png" alt="Search Icon"
                  className="w-[18px] h-[24px] sm:w-[21.77px] sm:h-[29.02px]" />
                <h3
                  className="font-inter font-bold text-[18px] sm:text-[21.77px] leading-[26px] sm:leading-[33.86px] text-[#111827]">
                  Search Tips
                </h3>
              </div>

              <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Visit facilities in person when possible
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Ask about staff-to-resident ratios
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Review recent inspection reports
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Consider location and family access
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-[#F5F5F5] rounded-[9.68px] p-5 sm:p-6 md:p-7 min-h-[240px] sm:min-h-[377.33px] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img src="/icons/light_icon.png" alt="Search Icon"
                  className="w-[18px] h-[24px] sm:w-[21.77px] sm:h-[29.02px]" />
                <h3
                  className="font-inter font-bold text-[18px] sm:text-[21.77px] leading-[26px] sm:leading-[33.86px] text-[#111827]">
                  Search Tips
                </h3>
              </div>

              <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Visit facilities in person when possible
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Ask about staff-to-resident ratios
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Review recent inspection reports
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Consider location and family access
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-[#F5F5F5] rounded-[9.68px] p-5 sm:p-6 md:p-7 min-h-[240px] sm:min-h-[377.33px] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <img src="/icons/light_icon.png" alt="Search Icon"
                  className="w-[18px] h-[24px] sm:w-[21.77px] sm:h-[29.02px]" />
                <h3
                  className="font-inter font-bold text-[18px] sm:text-[21.77px] leading-[26px] sm:leading-[33.86px] text-[#111827]">
                  Search Tips
                </h3>
              </div>

              <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Visit facilities in person when possible
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Ask about staff-to-resident ratios
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Review recent inspection reports
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img src="/icons/right_icon.png" alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                  <p
                    className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Consider location and family access
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <SearchNursing />
      <Footer />
        </>
      )}
    </>
  )
}
