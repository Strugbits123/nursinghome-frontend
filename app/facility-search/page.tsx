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
import { SearchNursing } from '../components/SearchNursing';
import { Footer } from '../components/Footer';
import AdUnit from "../components/AdUnit";
import { mapRawFacilityToCard, RawFacility } from '../utils/facilityMapper';
import Link from "next/link";
import HeaderFacility from '../components/HeaderFacility';
import { motion, AnimatePresence } from "framer-motion";
import RecommendationModal from '../components/RecommendationModal';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/with-reviews`;
const ITEMS_PER_PAGE = 8;

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const windowSize = 3;

  if (totalPages <= windowSize + 1) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    let start = currentPage;
    let end = start + windowSize - 1;

    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - windowSize + 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const extractFacilityCoords = (facilities: Facility[]) => {
  return facilities
    .filter((f) => f.lat && f.lng)
    .map((f) => ({
      lat: f.lat!,
      lng: f.lng!,
      name: (f as any).provider_name || (f as any).legal_business_name || f.name || "Unknown Facility",
    }));
};

const calculateMapCenter = (
  facilities: Facility[],
  searchCoords: { lat: number; lng: number } | null
) => {
  if (searchCoords) return searchCoords;

  const valid = facilities.filter((f) => f.lat && f.lng);
  if (valid.length === 0) return { lat: 34.0522, lng: -118.2437 };

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
  const {
    facilities: initialFacilities,
    locationName,
    total: totalCountFromProvider = 0,
    isLoading,
    coords,
    error,
    recommendations,
    refetchFacilities
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

  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null); // ✅ FIXED: This was missing
  const [showSkeletonTimer, setShowSkeletonTimer] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingFacilityId, setLoadingFacilityId] = useState<string | null>(null);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [usingFilters, setUsingFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [totalFacilities, setTotalFacilities] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [paginatedFacilities, setPaginatedFacilities] = useState<Facility[]>([]);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // ✅ SIMPLIFIED: Initialize data from context only
  useEffect(() => {
    console.log("🔄 INITIALIZING DATA FROM CONTEXT:", {
      locationName,
      initialFacilitiesCount: initialFacilities.length,
      totalCountFromProvider
    });

    if (initialFacilities.length > 0) {
      console.log("✅ Using context data");
      setAllFacilities(initialFacilities);
      setFilteredFacilities(initialFacilities);
      setPaginatedFacilities(initialFacilities.slice(0, ITEMS_PER_PAGE));
      setTotalFacilities(totalCountFromProvider || initialFacilities.length);
    }
  }, [initialFacilities, totalCountFromProvider, locationName]);

  // ✅ SIMPLIFIED: Get display total
  const displayTotal = useMemo(() => {
    return totalFacilities > 0 ? totalFacilities : allFacilities.length;
  }, [totalFacilities, allFacilities.length]);

  // ✅ SIMPLIFIED: Load page function - no caching
  const loadPage = useCallback(async (page: number) => {
    // For filtered results, use existing facilities
    if (usingFilters) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      setPaginatedFacilities(filteredFacilities.slice(start, end));
      return;
    }

    // For non-cached pages, fetch from API
    setIsPageLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !locationName?.trim()) return;

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
      console.log("🌐 Loading page:", page, "from API");

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();
      if (!data || typeof data !== "object" || !Array.isArray(data.data)) {
        setPaginatedFacilities([]);
        return;
      }

      const { data: facilityList } = data;
      const mapped: Facility[] = facilityList.map((f: RawFacility) =>
        mapRawFacilityToCard(f, coords)
      );

      setPaginatedFacilities(mapped);

    } catch (err: any) {
      console.error("❌ loadPage failed:", err?.message || err);
      setPaginatedFacilities([]);
    } finally {
      setIsPageLoading(false);
    }
  }, [coords, locationName, filteredFacilities, usingFilters]);

  // ✅ SIMPLIFIED: Pagination effect
  useEffect(() => {
    console.log("🔄 Pagination effect:", {
      currentPage,
      usingFilters,
      filteredCount: filteredFacilities.length,
      allCount: allFacilities.length
    });

    if (usingFilters) {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginated = filteredFacilities.slice(start, end);
      setPaginatedFacilities(paginated);
    } else if (currentPage === 1) {
      // For page 1, show first ITEMS_PER_PAGE facilities
      const paginated = allFacilities.slice(0, ITEMS_PER_PAGE);
      setPaginatedFacilities(paginated);
    } else if (currentPage > 1) {
      // For other pages, load from API
      loadPage(currentPage);
    }
  }, [currentPage, usingFilters, filteredFacilities, allFacilities, loadPage]);

  // Update facilities when context changes
  useEffect(() => {
    setAllFacilities(initialFacilities);
    if (!usingFilters) {
      setFilteredFacilities(initialFacilities);
    }
  }, [initialFacilities, usingFilters]);

  useEffect(() => {
    if (!usingFilters) {
      setFilteredFacilities(allFacilities);
    }
  }, [allFacilities, usingFilters]);

  const handleViewDetails = async (facility: any) => {
    setLoadingFacilityId(facility.id);
    const facilitySlug = facility.name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    router.push(`/facility/${facility.id}/${facilitySlug}`);
  };

  // ✅ SIMPLIFIED: Page navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > totalFacilityPages) return;

    console.log("📄 Switching to page:", page, "of", totalFacilityPages);
    setCurrentPage(page);
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

  // ✅ SIMPLIFIED: Filter functions - use context's refetch
  const fetchFilteredFacilities = async (newFilters?: typeof filters) => {
    const appliedFilters = newFilters || filters;
    setIsFiltering(true);

    try {
      const hasActiveFilters = Object.values(appliedFilters).some(value => 
        value && value.toString().trim() !== '' && !['locationName', 'city', 'state'].includes(value.toString())
      );

      // 🔄 Reset filters - restore from context
      if (!hasActiveFilters) {
        setFilteredFacilities(initialFacilities);
        setPaginatedFacilities(initialFacilities.slice(0, ITEMS_PER_PAGE));
        setUsingFilters(false);
        setCurrentPage(1);
        setIsFiltering(false);
        toast.success("Filters cleared!");
        return;
      }

      // Use context's refetch function for filtered results
      const filterParams: any = {
        locationName: locationName || appliedFilters.locationName,
        ...appliedFilters
      };

      // Remove empty values
      Object.keys(filterParams).forEach(key => {
        if (!filterParams[key]) delete filterParams[key];
      });

      await refetchFacilities(filterParams);
      
      setUsingFilters(true);
      setCurrentPage(1);
      toast.success(`Found ${initialFacilities.length} facilities`);
      
    } catch (err: any) {
      console.error("❌ Filter fetch failed:", err);
      toast.error(err.message || "Error applying filters");
    } finally {
      setIsFiltering(false);
    }
  };

  // Filtered pagination
  const fetchFilteredFacilitiesWithPagination = async (appliedFilters: typeof filters, page: number = 1) => {
    setIsPageLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());

      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (typeof value === "string" && value.trim()) {
          const cleanValue = value.trim().replace(/^\+/, "").replace(/\s+/g, "_");
          params.append(key, cleanValue);
        }
      });

      if (coords?.lat && coords?.lng) {
        params.append("userLat", coords.lat.toString());
        params.append("userLng", coords.lng.toString());
      }

      if (!params.has("locationName")) {
        let location = locationName?.trim() || "";
        if (!location) {
          const facilityCoords = extractFacilityCoords(initialFacilities);
          location = facilityCoords.length > 0 ? facilityCoords[0].name.trim() : "";
        }
        if (location) {
          params.set("locationName", location.replace(/^\+/, "").replace(/\s+/g, "_"));
        }
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/filter-with-reviews?${params.toString()}`;
      console.log("🌐 Fetching filtered facilities page:", page);

      const res = await fetch(apiUrl);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      const facilitiesData = data.data?.facilities || data.facilities || [];
      
      if (!facilitiesData || facilitiesData.length === 0) {
        setPaginatedFacilities([]);
        setIsPageLoading(false);
        return;
      }

      const mappedFacilities: Facility[] = facilitiesData.map((f: RawFacility) =>
        mapRawFacilityToCard(f, coords)
      );

      setPaginatedFacilities(mappedFacilities);
      
    } catch (err: any) {
      console.error("❌ Filter pagination failed:", err);
      setPaginatedFacilities([]);
    } finally {
      setIsPageLoading(false);
    }
  };

  // Modal effects
  useEffect(() => {
    if (recommendations?.length > 0) {
      const timer = setTimeout(() => setShowModal(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [recommendations]);

  // ✅ FIXED: Map center calculation with proper dependencies
  const mapCenter = useMemo(
    () => calculateMapCenter(filteredFacilities, selectedCoords || coords),
    [filteredFacilities, selectedCoords, coords] // ✅ Now includes selectedCoords
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
    const facilityList = document.getElementById("facility-list");
    if (facilityList) {
      facilityList.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
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

  if (error) {
    return (
      <div className="p-10 text-center text-xl font-medium text-red-600">
        Error loading facilities: {error}
      </div>
    );
  }

  // Calculate derived values
  const totalFacilityPages = Math.ceil(displayTotal / ITEMS_PER_PAGE);
  const startFacility = displayTotal > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endFacility = Math.min(startFacility + ITEMS_PER_PAGE - 1, displayTotal);

  console.log("📊 Final state:", {
    displayTotal,
    totalFacilityPages,
    currentPage,
    paginatedCount: paginatedFacilities.length,
    startFacility,
    endFacility
  });

  

  {
    isPrefetching && (
      <div className="flex justify-center items-center w-full py-10">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p className="ml-4 text-gray-600">Fetching remaining facilities...</p>
      </div>
    )
  }


 


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

      <RecommendationModal recommendations={recommendations} />

      {/* --------------------- Top Recommendations --------------------- */}
      
       {/* <AnimatePresence>
        {showModal && recommendations?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 200, y: -100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 200, y: -100 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            className="fixed top-6 right-6 z-50 bg-white shadow-2xl border border-gray-200 rounded-2xl w-80 max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                🌟 Top Recommendations
              </h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  {expanded ? "▲" : "▼"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Based on your search and preferences:
              </p>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 overflow-hidden"
                >
                  <div className="space-y-2 p-4 max-h-64 overflow-y-auto">
                    {recommendations.slice(0, 6).map((facility, index) => (
                      <motion.div
                        key={facility.id || index}
                        whileHover={{ scale: 1.02 }}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition cursor-pointer bg-white"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {facility.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {facility.city_town}, {facility.state}
                            </p>
                            {facility.type && (
                              <p className="text-xs text-gray-400 mt-1">
                                {facility.type}
                              </p>
                            )}
                          </div>
                          {facility.rating && (
                            <div className="flex items-center text-yellow-500 text-sm whitespace-nowrap">
                              ★
                              <span className="ml-1 text-gray-700 font-medium">
                                {facility.rating}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleViewDetails(facility)}
                            disabled={loadingFacilityId === facility.id}
                            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-20"
                          >
                            {loadingFacilityId === facility.id ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                              </span>
                            ) : (
                              "View Details"
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!expanded && (
              <div className="p-4 text-center text-gray-500 text-sm">
                Click ↓ to view recommendations
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence> */}

      <section className="w-full min-h-[148px] mx-auto bg-white flex flex-col justify-center px-4 sm:px-6 py-4 ">
        <div className="flex flex-col md:flex-col md:items-start w-full mb-4 gap-4">

          {/* Top Row - Info + Toggle */}
          <div className="flex flex-row items-center justify-between flex-wrap gap-y-2 w-full mb-2 md:mb-0">

            {/* Info Section */}
            <div className="flex flex-col items-start flex-wrap gap-x-0 sm:gap-x-4 ml-0 md:ml-[90px] md:flex-1 md:min-w-[150px] lg:min-w-[250px]">
              <span className="font-inter font-medium text-[15px] sm:text-[17px] leading-[22px] sm:leading-[26px] text-[#111827] ml-2 sm:ml-[55px]">
                {displayTotal} Facilities Found in{" "}
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
  className={`flex flex-col md:mx-46 lg:flex-row gap-6 mx-4 sm:mx-6 lg:mx-2 mt-10 px-4 sm:px-6 lg:px-8 min-h-screen ${
    viewMode === "mapOnly" ? "lg:h-[677px]" : "min-h-[2368px]"
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
                  className={`w-full bg-[#F9F9F9] rounded-[9.56px] shadow p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedFacilityId?.toString() === facility.id
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

              {totalFacilityPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md shadow-sm p-4 mt-4 w-full">
                  {/* Total Count Display - ONLY THIS PART CHANGED */}
                   {usingFilters ? (
                    <p>Showing {startFacility}-{endFacility} of {displayTotal} filtered facilities</p>
                  ) : (
                    <p>Showing {startFacility}-{endFacility} of {displayTotal} total facilities</p>
                  )}

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
