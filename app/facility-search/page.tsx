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
      name: (f as any).provider_name || (f as any).legal_business_name || f.name || "",
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
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
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
  const [filterApplied, setFilterApplied] = useState(false);

  // ✅ FIXED: Initialize data from context with proper filter state respect
  useEffect(() => {
    console.log("🔄 INITIALIZING DATA FROM CONTEXT:", {
      locationName,
      initialFacilitiesCount: initialFacilities.length,
      totalCountFromProvider,
      usingFilters,
      filterApplied
    });

    if (initialFacilities.length > 0) {
      // Only update if we're not in the middle of filtering
      if (!usingFilters && !filterApplied) {
        console.log("✅ Using context data - no filters active");
        setAllFacilities(initialFacilities);
        setFilteredFacilities(initialFacilities);

        // Only update pagination if we're on page 1
        if (currentPage === 1) {
          setPaginatedFacilities(initialFacilities.slice(0, ITEMS_PER_PAGE));
        }

        setTotalFacilities(totalCountFromProvider || initialFacilities.length);
      } else {
        console.log("ℹ️ Context updated but filters active, preserving filter state");
      }
    }
  }, [initialFacilities, totalCountFromProvider, locationName, usingFilters, filterApplied, currentPage]);

  // ✅ FIXED: Get display total - use API total when available
  const displayTotal = useMemo(() => {
    if (usingFilters && filterApplied) {
      // When filters are active, show the total from API response
      console.log("📊 Using filtered total:", totalFacilities);
      return totalFacilities;
    } else {
      // When no filters, show the total from provider or all facilities count
      const total = totalCountFromProvider > 0 ? totalCountFromProvider : allFacilities.length;
      console.log("📊 Using original total:", total);
      return total;
    }
  }, [usingFilters, filterApplied, totalFacilities, totalCountFromProvider, allFacilities.length]);

  // ✅ FIXED: Load page function WITHOUT authentication token
  const loadPage = useCallback(async (page: number) => {
    // For filtered results, use existing facilities
    if (usingFilters && filterApplied) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      setPaginatedFacilities(filteredFacilities.slice(start, end));
      return;
    }

    // For cached pages beyond page 1, fetch from API
    setIsPageLoading(true);
    try {
      if (!locationName?.trim()) return;

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
      console.log("🌐 Loading cached page:", page, "from API WITHOUT auth");

      const res = await fetch(url, {
        headers: {
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

      // ✅ FIXED: Update total from API response for paginated results
      if (data.total !== undefined) {
        setTotalFacilities(data.total);
      }

    } catch (err: any) {
      console.error("❌ loadPage failed:", err);
      // Fallback to cached data if available
      if (page === 1 && allFacilities.length > 0) {
        setPaginatedFacilities(allFacilities.slice(0, ITEMS_PER_PAGE));
      } else {
        setPaginatedFacilities([]);
      }
    } finally {
      setIsPageLoading(false);
    }
  }, [coords, locationName, filteredFacilities, usingFilters, filterApplied, allFacilities]);

  // ✅ FIXED: Pagination effect with proper cache handling
  useEffect(() => {
    console.log("🔄 Pagination effect:", {
      currentPage,
      usingFilters,
      filterApplied,
      filteredCount: filteredFacilities.length,
      allCount: allFacilities.length,
      displayTotal
    });

    if (usingFilters && filterApplied) {
      // Using filtered results
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const paginated = filteredFacilities.slice(start, end);
      setPaginatedFacilities(paginated);
      console.log("🔧 Filtered pagination:", {
        start,
        end,
        paginatedCount: paginated.length,
        totalFiltered: filteredFacilities.length
      });
    } else {
      // Using cached/original results
      if (currentPage === 1) {
        // For page 1, show first ITEMS_PER_PAGE facilities from cache
        const paginated = allFacilities.slice(0, ITEMS_PER_PAGE);
        setPaginatedFacilities(paginated);
        console.log("🔧 Page 1 cached pagination:", {
          paginatedCount: paginated.length,
          totalCached: allFacilities.length
        });
      } else if (currentPage > 1) {
        // For other pages, load from API
        loadPage(currentPage);
      }
    }
  }, [currentPage, usingFilters, filterApplied, filteredFacilities, allFacilities, loadPage, displayTotal]);

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

  const clearFilters = useCallback(() => {
    console.log("🔄 Clearing filters, resetting to cached data");

    setFilters({
      city: "",
      state: "",
      ratingMin: "",
      ownership: "",
      locationName: "",
      distance: "",
      beds: "",
    });

    // ✅ Reset all filter states
    setUsingFilters(false);
    setFilterApplied(false);
    setCurrentPage(1);

    // ✅ Reset to original context data immediately
    setFilteredFacilities(initialFacilities);
    setPaginatedFacilities(initialFacilities.slice(0, ITEMS_PER_PAGE));
    setTotalFacilities(totalCountFromProvider || initialFacilities.length);

    console.log("✅ Filters cleared, showing cached data:", {
      originalCount: initialFacilities.length,
      totalCountFromProvider,
      paginatedCount: initialFacilities.slice(0, ITEMS_PER_PAGE).length
    });

    toast.success("Filters cleared!");
  }, [initialFacilities, totalCountFromProvider]);

  // ✅ FIXED: Handle context updates after clearing filters
  useEffect(() => {
    if (!usingFilters && !filterApplied) {
      console.log("🔄 Context data updated, refreshing display data");
      setAllFacilities(initialFacilities);
      setFilteredFacilities(initialFacilities);

      // Only update pagination if we're on page 1
      if (currentPage === 1) {
        setPaginatedFacilities(initialFacilities.slice(0, ITEMS_PER_PAGE));
      }

      setTotalFacilities(totalCountFromProvider || initialFacilities.length);
    }
  }, [initialFacilities, totalCountFromProvider, usingFilters, filterApplied, currentPage]);


  // ✅ FIXED: Filter functions WITHOUT authentication token
  const fetchFilteredFacilities = async (newFilters?: typeof filters) => {
    const appliedFilters = newFilters || filters;
    setIsFiltering(true);

    try {
      const hasActiveFilters = Object.values(appliedFilters).some(value =>
        value && value.toString().trim() !== '' && !['locationName', 'city', 'state'].includes(value.toString())
      );

      // 🔄 Reset filters - use clearFilters for consistency
      if (!hasActiveFilters) {
        clearFilters();
        setIsFiltering(false);
        return;
      }

      // ✅ FIXED: Build filter params without duplication
      const filterParams: any = {
        // Always use context locationName as primary
        locationName: locationName || appliedFilters.locationName || '',
      };

      // Add other filters from appliedFilters, excluding locationName to avoid duplication
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (key !== 'locationName' && value && value.toString().trim() !== '') {
          filterParams[key] = value;
        }
      });

      // Remove empty locationName if no location is available
      if (!filterParams.locationName) {
        delete filterParams.locationName;
      }

      console.log("🔍 Filtering with params:", filterParams);

      // Call the filtered pagination function to get proper total count
      await fetchFilteredFacilitiesWithPagination(filterParams, 1);

      setUsingFilters(true);
      setFilterApplied(true);
      setCurrentPage(1);

      console.log("✅ Filters applied:", {
        locationName: filterParams.locationName,
        activeFilters: filterParams
      });

      toast.success(`Found ${totalFacilities} facilities`);

    } catch (err: any) {
      console.error("❌ Filter fetch failed:", err);
      toast.error(err.message || "Error applying filters");
    } finally {
      setIsFiltering(false);
    }
  };

  // ✅ FIXED: Filtered pagination WITHOUT authentication token
  const fetchFilteredFacilitiesWithPagination = async (appliedFilters: typeof filters, page: number = 1) => {
    setIsPageLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());

      // ✅ FIXED: Use context locationName first, then fallback
      let location = locationName?.trim() || appliedFilters.locationName?.trim() || "";
      if (location) {
        const cleanLocation = location.replace(/^\+/, "").replace(/\s+/g, "_");
        params.append("locationName", cleanLocation);
        console.log("📍 Using locationName:", cleanLocation);
      }

      // Add other filters, excluding locationName to avoid duplication
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (key !== 'locationName' && typeof value === "string" && value.trim()) {
          const cleanValue = value.trim().replace(/^\+/, "").replace(/\s+/g, "_");
          params.append(key, cleanValue);
        }
      });

      // Add coordinates if available
      if (coords?.lat && coords?.lng) {
        params.append("userLat", coords.lat.toString());
        params.append("userLng", coords.lng.toString());
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/filter-with-reviews?${params.toString()}`;
      console.log("🌐 Fetching filtered facilities WITHOUT auth:", {
        page,
        locationName: params.get('locationName'),
        params: params.toString()
      });

      const res = await fetch(apiUrl, {
        // ✅ REMOVED: No authentication headers
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      const facilitiesData = data.data?.facilities || data.facilities || [];

      // ✅ FIXED: Use the totalCount from pagination, not the facilitiesData length
      const totalFromAPI = data.data?.pagination?.totalCount || data.total || data.totalCount || 0;

      if (!facilitiesData || facilitiesData.length === 0) {
        setPaginatedFacilities([]);
        setTotalFacilities(0);
        setIsPageLoading(false);
        return;
      }

      const mappedFacilities: Facility[] = facilitiesData.map((f: RawFacility) =>
        mapRawFacilityToCard(f, coords)
      );

      setPaginatedFacilities(mappedFacilities);

      // ✅ FIXED: Use the totalCount from API response pagination
      setTotalFacilities(totalFromAPI);

      console.log("✅ Filtered pagination response:", {
        page,
        totalFromAPI,
        paginatedCount: mappedFacilities.length,
        facilitiesDataCount: facilitiesData.length,
        pagination: data.data?.pagination
      });

    } catch (err: any) {
      console.error("❌ Filter pagination failed:", err);
      setPaginatedFacilities([]);
      setTotalFacilities(0);
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

  // ✅ FIXED: Extract coordinates from PAGINATED facilities only
  const facilityCoords = useMemo(
    () => extractFacilityCoords(paginatedFacilities),
    [paginatedFacilities]
  );

  // ✅ FIXED: Map center calculation based on paginated facilities
  const mapCenter = useMemo(
    () => calculateMapCenter(paginatedFacilities, selectedCoords || coords),
    [paginatedFacilities, selectedCoords, coords]
  );

  // ✅ FIXED: Handle card click to center map on selected facility
  const handleCardClick = (facility: any) => {
    setSelectedFacilityId(facility.id);
    if (facility.lat && facility.lng) {
      setSelectedCoords({ lat: facility.lat, lng: facility.lng });
    }
  };

  // ✅ FIXED: Reset selected coordinates when changing pages
  useEffect(() => {
    setSelectedCoords(null); // Reset selection when page changes
  }, [currentPage]);

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

  // ✅ FIXED: Remove authentication check for routing
  useEffect(() => {
    if (initialFacilities.length === 0 && !isLoading) {
      router.push("/");
    }
  }, [router, initialFacilities.length, isLoading]);

  useEffect(() => {
    // Check authentication status but don't block API calls
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

  // ✅ FIXED: Calculate total pages based on displayTotal
  const totalFacilityPages = Math.ceil(displayTotal / ITEMS_PER_PAGE);
  const startFacility = displayTotal > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endFacility = Math.min(startFacility + ITEMS_PER_PAGE - 1, displayTotal);

  console.log("📊 Final state:", {
    displayTotal,
    totalFacilityPages,
    currentPage,
    paginatedCount: paginatedFacilities.length,
    startFacility,
    endFacility,
    usingFilters,
    filteredCount: filteredFacilities.length
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
          {/* Breadcrumb Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-[60px] bg-[#F5F5F5] flex items-center justify-start px-4 sm:px-6"
          >
            <div className="flex items-center gap-x-1 sm:gap-x-2 text-[#4B5563] mx-2 sm:mx-13 font-inter font-normal text-[14px] sm:text-[16.28px] leading-[20px] sm:leading-[23.26px] md:mx-37">
              <Link href="/" className="align-middle">
                Home
              </Link>
              <img
                src="/icons/search_fac_right_icon.png"
                alt="Arrow"
                className="w-[6px] h-[10px] sm:w-[8.72px] sm:h-[13.95px] align-middle"
              />
              <Link href="/facility-search" className="align-middle">
                Search Results
              </Link>
              <img
                src="/icons/search_fac_right_icon.png"
                alt="Arrow"
                className="w-[6px] h-[10px] sm:w-[8.72px] sm:h-[13.95px] align-middle"
              />
              <span className="font-inter font-medium text-[14px] sm:text-[16.71px] leading-[20px] sm:leading-[23.87px] text-[#111827] align-middle truncate max-w-[200px] sm:max-w-none">
                {locationName &&
                  locationName
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
              </span>
            </div>
          </motion.section>

          <RecommendationModal recommendations={recommendations} />

          {/* Main Content Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full min-h-[148px] mx-auto bg-white flex flex-col justify-center px-4 sm:px-6 py-4"
          >
            <div className="flex flex-col md:flex-col md:items-start w-full mb-4 gap-4">
              {/* Top Row - Info + Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-row items-center justify-between flex-wrap gap-y-2 w-full mb-2 md:mb-0"
              >
                {/* Info Section */}
                <div className="flex flex-col items-start flex-wrap gap-x-0 sm:gap-x-4 ml-0 md:ml-[90px] md:flex-1 md:min-w-[150px] lg:min-w-[250px]">
                  <span className="font-inter font-medium text-[15px] sm:text-[17px] leading-[22px] sm:leading-[26px] text-[#111827] ml-2 sm:ml-[55px]">
                    {usingFilters && filterApplied ? (
                      <>
                        {displayTotal} Filtered Facilities Found
                        {locationName && (
                          <> in{" "}
                            {locationName
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {displayTotal} Facilities Found in{" "}
                        {locationName &&
                          locationName
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </>
                    )}
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-end ml-2 w-auto sm:mt-0 mt-0"
                >
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
                </motion.div>
              </motion.div>

              {/* Ads Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full flex flex-col items-center justify-center relative z-10"
              >
                <div className="block md:hidden w-[250px] h-[200px] max-sm:w-[250px] max-sm:h-[200px] sm:w-[300px] sm:h-[250px] mx-auto">
                  <AdUnit adSlot="1234567890" layout="square" />
                </div>

                <div className="hidden md:flex w-full justify-start px-4 sm:px-8 md:px-10 lg:px-24 xl:px-32 mt-6">
                  <div className="w-full sm:w-[700px] md:w-[1000px] lg:w-[1200px] xl:w-[1600px] h-[90px] lg:mx-8">
                    <AdUnit adSlot="1234567890" layout="banner" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              id="facility-list"
              className="w-full max-w-[calc(100%-100px)] mx-auto px-4 sm:px-6 md:mx-30 lg:px-8 relative z-10"
            >
              <div className="
                flex flex-wrap md:flex-wrap filter-grid items-center justify-start sm:justify-start
                gap-x-3 sm:gap-x-4 gap-y-4 sm:gap-y-5 md:gap-y-0
                mt-2 sm:mt-4 md:mt-6
                w-full
                overflow-x-auto md:overflow-visible
                overflow-y-hidden
                pt-2 sm:pt-3 md:pt-0 filter-button
                relative z-10
              ">
                {/* Star Filter */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterButton
                    iconLeft="/icons/stars_icon.png"
                    label={filters.ratingMin ? `${filters.ratingMin}+ Stars` : "Stars"}
                    options={[5, 4, 3, 2, 1]}
                    value={filters.ratingMin}
                    onSelect={(val) => {
                      const newFilters = { ...filters, ratingMin: val.toString() };
                      setFilters(newFilters);
                      fetchFilteredFacilitiesWithPagination(newFilters, 1);
                    }}
                    onClear={() => {
                      const newFilters = { ...filters, ratingMin: "" };
                      setFilters(newFilters);
                      const hasOtherFilters = Object.entries(newFilters).some(
                        ([key, value]) => key !== 'ratingMin' && value && value.toString().trim() !== ''
                      );
                      if (!hasOtherFilters) {
                        clearFilters();
                      } else {
                        fetchFilteredFacilitiesWithPagination(newFilters, 1);
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-[130px] h-[43px] rounded-[9.56px] bg-[#D02B38] px-3 font-inter font-medium text-[16.72px] leading-[23.89px] text-white"
                    textWhite
                    iconLeftWidth="18px"
                    iconLeftHeight="16px"
                    redButton={true}
                  />
                </motion.div>

                {/* Distance Filter */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterButton
                    iconLeft="/icons/location_icon_new.png"
                    iconRight="/icons/down_icon.png"
                    label="Distance Km"
                    options={["1", "5", "10", "20", "50"]}
                    value={filters.distance}
                    onSelect={(val) => {
                      const newFilters = { ...filters, distance: val.toString() };
                      setFilters(newFilters);
                      fetchFilteredFacilitiesWithPagination(newFilters, 1);
                    }}
                    onClear={() => {
                      const newFilters = { ...filters, distance: "" };
                      setFilters(newFilters);
                      const hasOtherFilters = Object.entries(newFilters).some(
                        ([key, value]) => key !== 'distance' && value && value.toString().trim() !== ''
                      );
                      if (!hasOtherFilters) {
                        clearFilters();
                      } else {
                        fetchFilteredFacilitiesWithPagination(newFilters, 1);
                      }
                    }}
                    iconLeftWidth="14px"
                    iconLeftHeight="18px"
                    iconRightWidth="12px"
                    iconRightHeight="10px"
                  />
                </motion.div>

                {/* Bed Capacity Filter */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterButton
                    iconLeft="/icons/Bed_icon.png"
                    iconRight="/icons/down_icon.png"
                    label="Bed Capacity"
                    options={["<20", "20-50", "50-100", "100+"]}
                    value={filters.beds}
                    onSelect={(val) => {
                      const newFilters = { ...filters, beds: val.toString() };
                      setFilters(newFilters);
                      fetchFilteredFacilitiesWithPagination(newFilters, 1);
                    }}
                    onClear={() => {
                      const newFilters = { ...filters, beds: "" };
                      setFilters(newFilters);
                      const hasOtherFilters = Object.entries(newFilters).some(
                        ([key, value]) => key !== 'beds' && value && value.toString().trim() !== ''
                      );
                      if (!hasOtherFilters) {
                        clearFilters();
                      } else {
                        fetchFilteredFacilitiesWithPagination(newFilters, 1);
                      }
                    }}
                    iconLeftWidth="23px"
                    iconLeftHeight="18px"
                    iconRightWidth="12px"
                    iconRightHeight="10px"
                  />
                </motion.div>

                {/* Ownership Filter */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterButton
                    iconLeft="/icons/building_icon.png"
                    iconRight="/icons/down_icon.png"
                    label="Ownership"
                    options={["Non-Profit", "Private", "Government"]}
                    value={filters.ownership}
                    onSelect={(val) => {
                      const newFilters = { ...filters, ownership: val.toString() };
                      setFilters(newFilters);
                      fetchFilteredFacilitiesWithPagination(newFilters, 1);
                    }}
                    onClear={() => {
                      const newFilters = { ...filters, ownership: "" };
                      setFilters(newFilters);
                      const hasOtherFilters = Object.entries(newFilters).some(
                        ([key, value]) => key !== 'ownership' && value && value.toString().trim() !== ''
                      );
                      if (!hasOtherFilters) {
                        clearFilters();
                      } else {
                        fetchFilteredFacilitiesWithPagination(newFilters, 1);
                      }
                    }}
                    iconLeftWidth="14px"
                    iconLeftHeight="18px"
                    iconRightWidth="10px"
                    iconRightHeight="10px"
                  />
                </motion.div>

                {/* More Filters */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FilterButton
                    label="More Filters"
                    iconLeft="/icons/filter_icon.png"
                    iconRight="/icons/down_icon.png"
                    iconRightWidth="12px"
                    iconRightHeight="10px"
                    onClear={() => {
                      const newFilters = { ...filters, city: "", state: "" };
                      setFilters(newFilters);
                      const hasOtherFilters = Object.entries(newFilters).some(
                        ([key, value]) => !['city', 'state'].includes(key) && value && value.toString().trim() !== ''
                      );
                      if (!hasOtherFilters) {
                        clearFilters();
                      } else {
                        fetchFilteredFacilitiesWithPagination(newFilters, 1);
                      }
                    }}
                    value={filters.city || filters.state}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col gap-2 p-4 bg-white border border-gray-300 shadow-lg rounded-lg min-w-[200px]"
                    >
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
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => {
                            fetchFilteredFacilities();
                            toast.success("Filters applied!");
                          }}
                          className="bg-[#D02B38] text-white mt-2 p-2 rounded-lg hover:bg-[#af404a] transition w-full"
                        >
                          Apply
                        </Button>
                      </motion.div>
                    </motion.div>
                  </FilterButton>
                </motion.div>

                {/* Clear All Filters Button */}
                {(usingFilters && filterApplied) && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={clearFilters}
                      className="flex items-center justify-center gap-2 w-auto h-[43px] rounded-[9.56px] bg-gray-500 px-4 font-inter font-medium text-[16.72px] leading-[23.89px] text-white hover:bg-gray-600 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.section>

          {/* <div className="hidden md:flex justify-center items-start w-[120px] my-18 lg:w-[120px]">
              <AdUnit adSlot="right-skyscraper" layout="skyscraper" />
            </div> */}

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`flex flex-col lg:flex-row gap-6 mx-4 sm:mx-8 md:mx-34 lg:mx-12 xl:mx-16 mt-10 px-4 sm:px-8 lg:px-12 xl:px-28 min-h-screen ${
                viewMode === "mapOnly" ? "lg:h-[677px]" : "min-h-[2368px]"
              }`}
            >
              {isFiltering || showSkeletonTimer ? (
                <FacilityReviewSkeleton />
              ) : filteredFacilities.length === 0 && usingFilters ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col justify-center items-center w-full h-[300px] text-gray-500 text-lg font-medium"
                >
                  <p>No facilities match your filters</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-[#D02B38] text-white rounded-lg hover:bg-[#af404a] transition-colors"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {viewMode === "both" && (
                    <>
                      {isLoading || isPageLoading ? (
                        <FacilityReviewSkeleton />
                      ) : (
                        <>
                          {/* Left Column - Facilities List */}
                          <div className="w-full lg:w-[720px] min-h-[400px] overflow-hidden space-y-4">
                            {/* Google Ad - Show at TOP on Page 1 */}
                            {currentPage === 1 && filteredFacilities.length > 3 && (
                              <motion.div
                                key="google-ad-top"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full bg-[#F9F9F9] rounded-[9.56px] shadow p-4 sm:p-6 border border-gray-200"
                              >
                                <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                                  <div className="text-center text-gray-500 mb-4">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Advertisement</span>
                                  </div>
                                  {/* Google Ads Unit */}
                                  <AdUnit
                                    adSlot="middle-rectangle"
                                    layout="rectangle"
                                    className="w-full h-[200px]"
                                  />
                                </div>
                              </motion.div>
                            )}

                            {paginatedFacilities.map((facility: Facility, index: number) => (
                              <>
                                {/* Google Ad - Show in MIDDLE on other pages when more than 3 facilities */}
                                {currentPage > 1 && 
                                filteredFacilities.length > 3 &&
                                index === Math.floor(paginatedFacilities.length / 2) && (
                                  <motion.div
                                    key="google-ad-middle"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full bg-[#F9F9F9] rounded-[9.56px] shadow p-4 sm:p-6 border border-gray-200"
                                  >
                                    <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                                      <div className="text-center text-gray-500 mb-4">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Advertisement</span>
                                      </div>
                                      {/* Google Ads Unit */}
                                      <AdUnit
                                        adSlot="middle-rectangle"
                                        layout="rectangle"
                                        className="w-full h-[200px]"
                                      />
                                    </div>
                                  </motion.div>
                                )}

                                <motion.div
                                  key={facility.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  onClick={() => handleCardClick(facility)}
                                  className={`w-full bg-[#F9F9F9] rounded-[9.56px] shadow p-4 sm:p-6 border border-gray-200 cursor-pointer ${
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
                                            src="/icons/Bed_icon.png"
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

                                        <motion.div
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
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
                                        </motion.div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              </>
                            ))}

                            {/* Pagination */}
                            {displayTotal > ITEMS_PER_PAGE && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-sm p-6 mt-6 w-full border border-gray-100"
                              >
                                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                                  {usingFilters && filterApplied ? (
                                    <span>
                                      Showing <strong className="text-gray-900">{startFacility}-{endFacility}</strong> of{" "}
                                      <strong className="text-gray-900">{displayTotal} filtered</strong> facilities
                                      {totalCountFromProvider > displayTotal && (
                                        <span className="text-gray-500"> (from {totalCountFromProvider} total)</span>
                                      )}
                                    </span>
                                  ) : (
                                    <span>
                                      Showing <strong className="text-gray-900">{startFacility}-{endFacility}</strong> of{" "}
                                      <strong className="text-gray-900">{displayTotal} total</strong> facilities
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 justify-center sm:justify-end w-full sm:w-auto">
                                  {/* Previous Button */}
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={currentPage === 1}
                                    onClick={goToPrevPage}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                                  >
                                    Previous
                                  </motion.button>

                                  {getPageNumbers(currentPage, totalFacilityPages).map((page, idx) => (
                                    <motion.button
                                      key={idx}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => typeof page === "number" && goToPage(page)}
                                      className={`px-3 py-2 min-w-[40px] rounded-lg text-sm font-medium transition-all duration-200 ${
                                        currentPage === page 
                                          ? "bg-[#D02B38] text-white border border-[#D02B38] shadow-sm" 
                                          : "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                      } ${page === "..." ? "cursor-default hover:bg-transparent hover:border-gray-300" : ""}`}
                                      disabled={page === "..."}
                                    >
                                      {page}
                                    </motion.button>
                                  ))}

                                  {/* Next Button */}
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={currentPage === totalFacilityPages}
                                    onClick={goToNextPage}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                                  >
                                    Next
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Right Column - Map */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full lg:w-[780px] h-[400px] lg:h-[677px] bg-white rounded-[9.56px] shadow flex items-center justify-center sticky top-6 overflow-hidden"
                          >
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
                          </motion.div>
                        </>
                      )}
                    </>
                  )}

                {/* Map Only Mode */}
                {viewMode === "mapOnly" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-[677px] bg-white rounded-[12.56px] shadow flex items-center justify-center overflow-hidden"
                  >
                    <MapView
                      facilities={facilityCoords}
                      centerCoords={mapCenter}
                      googleMapsApiKey={GOOGLE_MAPS_API_KEY!}
                      locationName={locationName}
                      markerIconUrl="/icons/red_hospital_pin.png"
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.section>

          {/* Search Tips & Resources Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full min-h-[566px] pb-5 px-4 sm:px-6 lg:px-12 xl:px-20 mt-[40px] sm:mt-[80px]"
          >
            <div className="w-full max-w-[100%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[1200px] mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="font-jost font-bold 
                    text-[20px] sm:text-[26px] md:text-[32px] 
                    leading-[26px] sm:leading-[32px] md:leading-[38.4px] 
                    text-[#111827]"
              >
                Search Tips &amp; Resources
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-2 font-inter font-normal 
                    text-[14px] sm:text-[16px] md:text-[18px] 
                    leading-[22px] sm:leading-[26px] md:leading-[28px] 
                    text-[#707070]"
              >
                Make the most of your nursing home search
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-5">
                {[1, 2, 3].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-[#F5F5F5] rounded-[9.68px] p-5 sm:p-6 md:p-7 min-h-[240px] sm:min-h-[377.33px] flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <img src="/icons/light_icon.png" alt="Search Icon"
                        className="w-[18px] h-[24px] sm:w-[21.77px] sm:h-[29.02px]" />
                      <h3
                        className="font-inter font-bold text-[18px] sm:text-[21.77px] leading-[26px] sm:leading-[33.86px] text-[#111827]">
                        Search Tips
                      </h3>
                    </div>

                    <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                      {[
                        "Visit facilities in person when possible",
                        "Ask about staff-to-resident ratios",
                        "Review recent inspection reports",
                        "Consider location and family access"
                      ].map((tip, tipIndex) => (
                        <motion.div
                          key={tipIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 + tipIndex * 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <img src="/icons/right_icon.png" alt="Check Icon"
                            className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1" />
                          <p
                            className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                            {tip}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <SearchNursing />
          <Footer />
        </>
      )}
    </>
  );
}