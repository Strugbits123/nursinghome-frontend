'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import { useFacilities, Facility } from "../context/FacilitiesContext";
import MapView from '../components/MapView';
import FacilityReviewSkeleton from '../components/ReviewSkeleton';
import { FilterButton } from '../components/FilterButton';
import { motion } from "framer-motion";



function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const delta = 2;
  const range: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || 
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  const pages: (number | string)[] = [];
  let prev = 0;
  for (const page of range) {
    if (prev) {
      if (page !== prev + 1) pages.push("...");
    }
    pages.push(page);
    prev = Number(page);
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

const ITEMS_PER_PAGE = 6;

type ViewMode = "both" | "mapOnly";

export default function FacilitySearchPage() {
  const router = useRouter();

  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const { facilities, locationName, isLoading, error, coords } = useFacilities();
  const [openAuth, setOpenAuth] = React.useState(false);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showSkeletonTimer, setShowSkeletonTimer] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingFacilityId, setLoadingFacilityId] = useState<string | null>(null);




  const [filters, setFilters] = useState({
    city: "",
    state: "",
    ratingMin: "",
    ownership: "",
    locationName: "",
    distance: "",
    beds: "",
  });

  const [usingFilters, setUsingFilters] = useState(false);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>(facilities);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  const handleViewDetails = async (facility: any) => {
    setLoadingFacilityId(facility.id);
    const facilitySlug = slugify(facility.name);
    router.push(`/facility/${facility.id}/${facilitySlug}`);

  };

  useEffect(() => {
    if (!usingFilters) {
      setFilteredFacilities(facilities);
    }
  }, [facilities, usingFilters]);

  const fetchFilteredFacilities = async (newFilters?: typeof filters) => {
    const appliedFilters = newFilters || filters;
    setIsFiltering(true);

    try {
      const params = new URLSearchParams();

      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value.trim()) params.append(key, value.trim());
      });


      if (coords?.lat && coords?.lng) {
        params.append("userLat", coords.lat.toString());
        params.append("userLng", coords.lng.toString());
      }

      const hasFilters = [...params].length > 0;

      if (!hasFilters) {
        setFilteredFacilities(facilities);
        setUsingFilters(false);
        setCurrentPage(1);
        setIsFiltering(false);
        return;
      }

      if (!appliedFilters.locationName) {
        if (locationName) {
          params.set("locationName", locationName);
        } else {
          const facilityCoords = extractFacilityCoords(facilities);
          if (facilityCoords.length > 0) params.set("locationName", facilityCoords[0].name);
        }
      }

      const apiUrl = `http://localhost:5000/api/facilities/filter-with-reviews?${params.toString()}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!res.ok || !data.facilities || data.facilities.length === 0) {
        setFilteredFacilities([]);
        setUsingFilters(true);
        setIsFiltering(false);
        toast.error("No Facilities Found");
        return;
      }

      const mappedFacilities = (data.facilities || []).map((f: any) => ({
        id: f._id || f.id,
        name: f.googleName || f.name,
        address: f.provider_address || f.address,
        city: f.city_town || f.city,
        state: f.state,
        zip: f.zip_code || f.zip,
        phone: f.telephone_number || f.phone,
        beds: f.number_of_certified_beds || f.beds,
        lat: f.lat || f.latitude || f.geoLocation?.coordinates[1],
        lng: f.lng || f.longitude || f.geoLocation?.coordinates[0],
        isNonProfit: (f.ownership_type?.toLowerCase().includes("non") || false),
        provider_name: f.provider_name,
        pros: f.aiSummary?.pros?.join(", ") || "No specific pros listed",
        cons: f.aiSummary?.cons?.join(", ") || "No specific cons listed",
        imageUrl: f.photo || "/default_facility_image.png",
        status: f.status  || "Unknown",
        hours: f.operating_hours || "",
        rating: f.rating || f.overall_rating || 0,
      }));

      setFilteredFacilities(mappedFacilities);
      setUsingFilters(true);
      setCurrentPage(1);
      toast.success("Filters applied!");
    } catch (err: any) {
      setFilteredFacilities([]);
      toast.error(err.message || "Error applying filters");
    } finally {
      setIsFiltering(false);
    }
  };

  function getFacilityStatus(facility: any) {
      if (!facility.number_of_certified_beds || !facility.average_number_of_residents_per_day)
        return "Unknown";

      const occupancyRate =
        (facility.average_number_of_residents_per_day / facility.number_of_certified_beds) * 100;

      if (occupancyRate < 80) return "Accepting";
      if (occupancyRate < 100) return "Waitlist";
      return "Full";
    }

  // ✅ Clear filters
  const clearFilters = () => {
    setFilters({
      city: "",
      state: "",
      ratingMin: "",
      ownership: "",
      locationName: "",
      distance: "",
      beds: "",
    });
    setUsingFilters(false);
    setFilteredFacilities(facilities);
    setCurrentPage(1);
    toast.success("Filters cleared!");
  };

  // ✅ Pagination
  const totalFacilities = filteredFacilities.length;
  const totalPages = Math.ceil(totalFacilities / ITEMS_PER_PAGE);

  const paginatedFacilities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFacilities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFacilities, currentPage]);

  console.log("paginatedFacilities for Pagination:", paginatedFacilities);



  const startFacility = totalFacilities > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endFacility = Math.min(startFacility + ITEMS_PER_PAGE - 1, totalFacilities);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);


  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const mapCenter = useMemo(
    () => calculateMapCenter(filteredFacilities, selectedCoords || coords),
    [filteredFacilities, selectedCoords, coords]
  );

  const facilityCoords = useMemo(
    () => extractFacilityCoords(filteredFacilities),
    [filteredFacilities]
  );

  const goToNextPage = useCallback(
    () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    [totalPages]
  );
  const goToPrevPage = useCallback(
    () => setCurrentPage((p) => Math.max(p - 1, 1)),
    []
  );

  const handleCardClick = (facility: any) => {
    setSelectedFacilityId(facility.id);
    if (facility.lat && facility.lng) {
      setSelectedCoords({ lat: facility.lat, lng: facility.lng });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeletonTimer(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      if (facilities.length === 0 && !isLoading) router.push("/");
    }
  }, [router, facilities.length, isLoading]);

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

  console.log(`DEBUG 2: Facilities in Search Page: ${facilities.length}`);
  console.log(`DEBUG 3: Facility Coords for MapView: ${facilityCoords.length}`, facilityCoords);
  console.log("DEBUG 4: Calculated Map Center:", mapCenter);


  if (isLoading || showSkeletonTimer) {
    return <FacilityReviewSkeleton />;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-xl font-medium text-red-600">
        Error loading facilities: {error}
      </div>
    );
  }

  // ✅ Case 1: No facilities at all (initial load or context empty)
  if (facilities.length === 0 && !isLoading) {
    return (
      <div className="p-10 text-center text-xl">
        <h2 className="text-2xl font-bold mb-2">No Facilities Found</h2>
        <p className="text-gray-600">
          We couldn’t find any facilities matching your location.
        </p>
        <Button
          onClick={() => router.push('/')}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Start a New Search
        </Button>
      </div>
    );
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

      <header className="w-full h-[78px] bg-[#C71F37] border-b border-[#C71F37]">
        <div className="max-w-[1856px] h-[46px] mx-auto px-4 sm:px-[32px] flex items-center justify-between">
          <img
            src="/footer_icon.png"
            alt="NursingHome Logo"
            className="w-[120px] h-[32px] sm:w-[176px] sm:h-[47px] mt-7 sm:ml-30"
          />

          <nav className="hidden lg:flex w-[357px] h-[65px] items-center space-x-8 mt-8 mr-50">
            <a
              href="#"
              className="font-inter font-black text-[14px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
              Home
            </a>
            <a
              href="#"
              className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
              What's New!
            </a>
            <a
              href="#"
              className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
              News
            </a>
            <a
              href="#"
              className="font-inter font-medium text-[16px] leading-[13px] tracking-[0.2px] capitalize text-white"
            >
              Contact
            </a>
          </nav>

          <div className="w-auto sm:w-[406.5px] h-[54px] flex items-center justify-end mt-9 sm:mr-50 space-x-2 sm:space-x-6">
            {isAuthenticated ? (
              <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center w-[100px] sm:w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-2 sm:px-4 py-6"
              >
                <img
                  src="/arrow_btn.png"
                  alt="Logout icon"
                  className="w-[16px] h-[16px] sm:w-[18.78px] sm:h-[18.78px] mr-1 sm:mr-2"
                />
                <span className="font-jost font-semibold text-[14px] sm:text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                  Logout
                </span>
              </div>
            ) : (
              <div
                onClick={() => setOpenAuth(true)}
                className="flex cursor-pointer items-center w-[100px] sm:w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-2 sm:px-4 py-6"
              >
                <img
                  src="/icons/header_sign.png"
                  alt="Sign in icon"
                  className="w-[16px] h-[16px] sm:w-[18.78px] sm:h-[18.78px] mr-1 sm:mr-2"
                />
                <span className="font-jost font-semibold text-[14px] sm:text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                  Sign In
                </span>
              </div>
            )}

            {/* <button className="flex items-center justify-center w-[163.37px] h-[54px] bg-white hover:bg-[#a91a2e] rounded-[7.04px] px-4">
              <img
                src="/icons/faciltiy_search_svg.png"
                alt="Add icon"
                className="w-[18.78px] h-[18.78px] fill-red-500  mr-2 invert"
              />
              <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-[#c71f37]">
                Add Listing
              </span>
            </button> */}
          </div>
        </div>

        <AuthModal
          open={openAuth}
          onOpenChange={(open) => {
            setOpenAuth(open);
            if (!open) {
              setIsAuthenticated(!!localStorage.getItem("token"));
            }
          }}
        />
      </header>


      <section className="w-full min-h-[60px] bg-[#F5F5F5] flex items-center justify-between px-4 sm:px-22">
        <div className="flex items-center gap-x-1 sm:gap-x-2 text-[#4B5563] mx-2 sm:mx-25 font-inter font-normal text-[14px] sm:text-[16.28px] leading-[20px] sm:leading-[23.26px]">
          <span className="align-middle">Home</span>
          <img
            src="/icons/search_fac_right_icon.png"
            alt="Arrow"
            className="w-[6px] h-[10px] sm:w-[8.72px] sm:h-[13.95px] align-middle"
          />
          <span className="align-middle">Search Results</span>
          <img
            src="/icons/search_fac_right_icon.png"
            alt="Arrow"
            className="w-[6px] h-[10px] sm:w-[8.72px] sm:h-[13.95px] align-middle"
          />
          <span className="font-inter font-medium text-[14px] sm:text-[16.71px] leading-[20px] sm:leading-[23.87px] text-[#111827] align-middle truncate max-w-[200px] sm:max-w-none">
            {locationName
            ?.toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())}
          </span>
        </div>


        {/* <button className="flex items-center gap-2 bg-[#F5F5F5] text-[#C71F37] px-4 mx-45 py-2 hover:bg-[#f5f5f5] transition">
          <img
            src="/icons/facility_search_heart_icon.png"
            alt="Save icon"
            className="w-[16.28px] h-[16.28px]"
          />
          <span className="font-inter font-normal text-[16.28px] leading-[23.26px] text-center">
            Save Search
          </span>
        </button> */}
      </section>

      <section className="w-full min-h-[148px] mx-auto bg-white flex flex-col justify-center px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-4 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
           <span
              className="font-inter font-medium text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28.67px] text-[#111827]"
            >
              {facilities.length} Facilities Found in {locationName
              ?.toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
            <div className="flex items-center gap-2">
              <img
                src="/icons/location_icon_new.png"
                alt="Location Icon"
                className="w-[12px] h-[16px] sm:w-[14.33px] sm:h-[19.11px]"
              />

              {/* Text */}
              <span className="font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[23.26px] text-[#6B7280]">
                Within 25 miles
              </span>
            </div>

          </div>

          <div className="relative flex items-center space-x-4">
            {/* <button
              className="w-[233px] h-[48px] bg-[#EFEFEF] rounded-[9.56px] border border-[#E5E7EB] text-[#212121] font-inter font-medium hover:bg-gray-50 transition"
            >
              Sort by: Best Match
            </button> */}
           {/* List icon */}
            <button
              type="button"
              className="relative flex items-center w-[80px] sm:w-[97.68px] h-[40px] sm:h-[48.84px] border border-[#D1D5DB] rounded-[9.3px] overflow-hidden font-inter bg-white"
            >
              {/* Animated active background */}
              <motion.div
                className="absolute top-0 bottom-0 w-[40px] sm:w-[46.51px] bg-[#D02B38] rounded-[9.3px]"
                animate={{
                  x: viewMode === "both" ? 0 : 40, // Move right when switching
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              />

              {/* Left icon (List View) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setViewMode("both")}
                className="flex items-center justify-center w-[40px] sm:w-[46.51px] h-[40px] sm:h-[46.51px] z-10 cursor-pointer"
              >
                <img
                    src="/icons/list_icon.png"
                    alt="List Icon"
                    className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] transition-all duration-200 ${
                      viewMode === "both"
                        ? "brightness-200"
                        : "brightness-0 opacity-80"
                    }`}
                  />
              </div>

              {/* Right icon (Map View) */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setViewMode("mapOnly")}
                className="flex items-center justify-center flex-1 z-10 cursor-pointer"
              >
                <img
                  src="/icons/map_icon.png"
                  alt="Map Icon"
                  className={`w-[18px] h-[14px] sm:w-[20.93px] sm:h-[16px] ${
                    viewMode === "mapOnly" ? "brightness-200" : "brightness-0 opacity-80"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-start">
          <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-start gap-2 sm:gap-3 md:gap-4 gap-y-2 sm:gap-y-3 ml-0 sm:ml-1 mt-3 sm:mt-5 lg:overflow-x-auto pb-2">
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
              className="flex items-center justify-center gap-2 w-[110px] sm:w-[130px] h-[40px] sm:h-[43px] rounded-[9.56px] bg-[#D02B38] px-2 sm:px-3 font-inter font-medium text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px] flex-shrink-0"
              textWhite
              iconLeftWidth="16px"
              iconLeftHeight="14px"
            />

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
              iconLeftWidth="12px"
              iconLeftHeight="16px"
              iconRightWidth="10px"
              iconRightHeight="8px"
              className="flex-shrink-0"
            />

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
              iconLeftWidth="20px"
              iconLeftHeight="16px"
              iconRightWidth="10px"
              iconRightHeight="8px"
              className="flex-shrink-0"
            />

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
              iconLeftWidth="12px"
              iconLeftHeight="16px"
              iconRightWidth="10px"
              iconRightHeight="8px"
              className="flex-shrink-0"
            />

            <FilterButton
              label="More Filters"
              iconLeft="/icons/filter_icon.png"
              iconRight="/icons/down_icon.png"
              iconRightWidth="10px"
              iconRightHeight="8px"
              onClear={() => {
                setFilters(f => ({ ...f, city: "", state: "" }));
                fetchFilteredFacilities();
              }}
              value={filters.city || filters.state}
              className="flex-shrink-0"
            >
              <div className="flex flex-col gap-2">
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
                  className="bg-blue-600 text-grey mt-2"
                >
                  Apply
                </Button>
              </div>
            </FilterButton>
          </div>
        </div>
      </section>

      {/* <section className="w-[1736.7px] min-h-[2368px] flex gap-6 ml-5 mt-[40px] px-48"> */}
      <section className={`flex flex-col lg:flex-row gap-6 mx-4 sm:ml-5 mt-[40px] px-4 sm:px-48 ${viewMode === "mapOnly" ? "h-[677px]" : "min-h-[2368px]"}`}>
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

                <div className="w-full lg:w-[726px] space-y-4">
                  {paginatedFacilities.map((facility, i) => (

                    <div
                      key={facility.id || i}
                      onClick={() => handleCardClick(facility)}
                      className={`w-full h-auto p-3 sm:p-4 bg-[#F9F9F9] rounded-[9.56px] shadow transition-all duration-200 cursor-pointer 
                                  ${selectedFacilityId?.toString() === facility.id
                          ? "border-l-[4.78px] border-t border-r border-b border-[#FACC15] border-l-[#FACC15]"
                          : "border-none"
                        }`}

                    >
                      <div className="flex flex-col sm:flex-row">
                      
                        <div className="w-full sm:w-1/4 flex justify-center sm:justify-start">
                          <div
                            className="w-[100px] h-[100px] sm:w-[114.67px] sm:h-[114.67px] flex items-center justify-center mt-2 sm:mt-15 ml-0 sm:ml-5"> 
                            <img
                              src={facility.imageUrl || "/default_facility_image.png"}
                              alt={facility.name}
                              className="max-w-full max-h-full rounded-[9.56px]"
                            />
                          </div>
                        </div>

                        <div className="flex-1 mt-4 sm:mt-11 ml-0 sm:ml-1 p-2 sm:p-5">
                          <h3 className="font-inter font-bold text-[20px] sm:text-[23.89px] leading-[28px] sm:leading-[33.45px] text-[#111827]">
                            {facility.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <img src="/icons/location_icon_new.png" alt="Location Icon" className="w-[10px] h-[14px] sm:w-[12.54px] sm:h-[16.72px] self-start mt-1" />
                            <span className="font-inter font-normal text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px] text-[#4B5563]">
                              {facility.distance != null ? `${facility.distance.toFixed(1)} miles` : ''}
                              {facility.address ? ` • ${facility.address}` : ''}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3">
                            <div className="flex items-center gap-2">
                              <img src="/icons/bed_icon (2).png" alt="Beds Icon" className="w-[18px] h-[12px] sm:w-[20.9px] sm:h-[14.63px]" />
                              <span className="font-inter font-normal text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px] text-[#4B5563]">
                                {facility.beds} beds
                              </span>
                            </div>

                            <span className="font-inter font-normal text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px] text-[#4B5563]">
                              {facility.isNonProfit ? 'Non-Profit' : 'For-Profit'}
                            </span>
                            <span className={`font-inter font-medium text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px] ${getStatusColor(facility.status)}`}>
                              {facility.status}
                            </span>
                          </div>

                          <div className="w-full sm:w-[478.01px] h-auto min-h-[55.89px] px-3 py-2 rounded-[4.78px] mt-4 sm:mt-6 bg-[#F5F5F5] grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                               <span className="text-[#16A34A] text-[12px] sm:text-[14.33px] leading-[16px] sm:leading-[19.11px] font-medium">✓</span>
                                <p
                                  className="font-inter font-normal text-[12px] sm:text-[14.33px] leading-[16px] sm:leading-[19.11px] text-[#16A34A] line-clamp-2"
                                  title={facility.aiSummary?.pros?.join(", ") || "No specific pros listed"} // Optional: show full text on hover
                                >
                                  Pros: {facility.aiSummary?.pros?.join(", ") || "No specific pros listed"}
                                </p>
                              </div>

                              <div className="flex items-start gap-2">
                                <span className="text-[#DC2626] text-[12px] sm:text-[14.33px] leading-[16px] sm:leading-[19.11px] font-medium">✗</span>
                                <p
                                  className="font-inter font-normal text-[12px] sm:text-[14.33px] leading-[16px] sm:leading-[19.11px] text-[#DC2626] line-clamp-2"
                                  title={facility.aiSummary?.cons?.join(", ") || "No specific cons listed"} // Optional: show full text on hover
                                >
                                  Cons: {facility.aiSummary?.cons?.join(", ") || "No specific cons listed"}
                                </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                              {/* 📞 Phone */}
                              <div className="flex items-center gap-2">
                                <img src="/icons/phone_icon.png" alt="Phone Icon" className="w-[10px] h-[10px] sm:w-[12.33px] sm:h-[12.33px]" />
                                <span className="font-inter font-normal text-[12px] sm:text-[14.33px] leading-[16px] sm:leading-[19.11px] text-[#4B5563]">
                                  {facility.phone}
                                </span>
                              </div>

                              {/* ⏰ Open hours */}
                              <div className="flex items-center gap-2">
                                <img src="/icons/clock_icon.png" alt="Clock Icon" className="w-[12px] h-[12px] sm:w-[14.33px] sm:h-[14.33px]" />
                                <span className="font-inter font-normal text-[12px] sm:text-[14.33px] leading-[16px] sm:leading-[19.11px] text-[#4B5563]">
                                  {(facility as any).hours || ""}
                                </span>
                              </div>
                            </div>

                            <button className="w-full sm:w-[136.76px] h-[40px] sm:h-[43px] bg-[#D02B38] rounded-[4.78px] text-white font-inter font-medium text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px]
                                          flex items-center justify-center text-center disabled:opacity-70"
                              onClick={() => handleViewDetails(facility)}
                              disabled={loadingFacilityId === facility.id}
                            >
                              {loadingFacilityId === facility.id ? (
                                <div className="loader"></div>
                              ) : (
                                "View Details"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}


                  {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between w-full rounded-[9.56px] bg-white px-4 sm:px-6 py-4 mt-4 shadow-sm">
                        
                        {/* Info text */}
                        <p className="text-[#4B5563] font-inter text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px] mb-3 sm:mb-0">
                          Showing {startFacility}–{endFacility} of {totalFacilities} facilities
                        </p>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-center gap-x-1 sm:gap-x-2 whitespace-nowrap overflow-x-auto no-scrollbar">
                          
                          {/* Previous Button */}
                          <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            className={`
                              w-[80px] sm:w-[100px] h-[40px] sm:h-[45.39px] rounded-[9.56px] border border-[#E5E7EB]
                              font-inter font-medium text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px]
                              flex items-center justify-center transition-all duration-150
                              ${currentPage === 1
                                ? 'bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-50'}
                            `}
                          >
                            Previous
                          </button>

                          {/* Page Numbers */}
                          {getPageNumbers(currentPage, totalPages).map((page, index) =>
                            typeof page === 'number' ? (
                                  <button
                                      // 'page' is safely a number here
                                      key={page}
                                      // TypeScript is happy: 'page' is narrowed to 'number' by the Type Guard
                                      onClick={() => goToPage(page)}
                                      className={`
                                          w-[35px] sm:w-[45px] h-[40px] sm:h-[45.39px] rounded-[9.56px]
                                          font-inter font-medium text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px]
                                          flex items-center justify-center transition-all duration-150
                                          ${currentPage === page
                                              ? 'bg-[#D02B38] text-white'
                                              : 'border border-[#E5E7EB] bg-white text-black hover:bg-gray-50'}
                                      `}
                                  >
                                      {page}
                                  </button>
                              ) : (
                                  // The 'false' branch handles the string "..."
                                  <span
                                      key={`ellipsis-${index}`}
                                      className="px-2 sm:px-3 text-gray-400 font-inter text-[14px] sm:text-[16.72px]"
                                  >
                                      ...
                                  </span>
                              )
                          )}

                          {/* Next Button */}
                          <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`
                              w-[80px] sm:w-[100px] h-[40px] sm:h-[45.39px] rounded-[9.56px] border border-[#E5E7EB]
                              font-inter font-medium text-[14px] sm:text-[16.72px] leading-[20px] sm:leading-[23.89px]
                              flex items-center justify-center transition-all duration-150
                              ${currentPage === totalPages
                                ? 'bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed'
                                : 'bg-white text-black hover:bg-gray-50'}
                            `}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                </div>

                <div className="w-full lg:w-[778.7px] h-[400px] lg:h-[677px] bg-white rounded-[9.56px] shadow-[0px_1.19px_2.39px_0px_#0000000D] overflow-hidden lg:sticky lg:top-6 flex items-center justify-center">
                  {/* map */}
                  {GOOGLE_MAPS_API_KEY ? (
                    <MapView
                      facilities={facilityCoords}
                      centerCoords={mapCenter}
                      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                      locationName={locationName}
                    />

                  ) : (
                    <div>…your fallback…</div>
                  )}
                </div>
              </>
            )}
            {viewMode === "mapOnly" && (
              <div className="w-full h-[400px] sm:h-[677px] bg-white rounded-[9.56px] shadow overflow-hidden flex items-center justify-center">
                {GOOGLE_MAPS_API_KEY ? (
                  <MapView
                    facilities={facilityCoords}
                    centerCoords={mapCenter}
                    googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                    locationName={locationName}
                  />
                ) : (
                  <div>…your fallback…</div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <section className="w-full min-h-[566px] mx-4 sm:mx-50 mt-[40px] sm:mt-[80px]">
        <div className="w-full max-w-[1548.03px] min-h-[488.59px]">
          <h2 className="font-jost font-bold text-[24px] sm:text-[32px] leading-[28px] sm:leading-[38.4px] text-[#111827]">
            Search Tips &amp; Resources
          </h2>

          <p className="mt-2 font-inter font-normal text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#707070]">
            Make the most of your nursing home search
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-5">
            <div className="w-full h-auto min-h-[377.33px] bg-[#F5F5F5] rounded-[9.68px] p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/light_icon.png"
                  alt="Search Icon"
                  className="w-[18px] h-[24px] sm:w-[21.77px] sm:h-[29.02px]"
                />
                <h3 className="font-inter font-bold text-[18px] sm:text-[21.77px] leading-[26px] sm:leading-[33.86px] text-[#111827]">
                  Search Tips
                </h3>
              </div>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Visit facilities in person when possible
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Ask about staff-to-resident ratios
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Review recent inspection reports
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/right_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Consider location and family access
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-auto min-h-[377.33px] bg-[#F5F5F5] rounded-[9.68px] p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/question_icon.png"
                  alt="Search Icon"
                  className="w-[24px] h-[24px] sm:w-[29.77px] sm:h-[29.02px]"
                />
                <h3 className="font-inter font-bold text-[18px] sm:text-[21.77px] leading-[26px] sm:leading-[33.86px] text-[#111827]">
                  Questions to Ask
                </h3>
              </div>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    What services are included in the base rate?
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    How do you handle medical emergencies?
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    What activities and programs are available?
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/left_arrow_icon.png"
                    alt="Check Icon"
                    className="w-[12px] h-[12px] sm:w-[14.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Can I see the dining menu and meal options?
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-auto min-h-[377.33px] bg-[#F5F5F5] rounded-[9.68px] p-4 sm:p-6 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/light_icon.png"
                  alt="Search Icon"
                  className="w-[18px] h-[24px] sm:w-[21.77px] sm:h-[29.02px]"
                />
                <h3 className="font-inter font-bold text-[18px] sm:text-[21.77px] leading-[26px] sm:leading-[33.86px] text-[#111827]">
                  Search Tips
                </h3>
              </div>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/check_green.png"
                    alt="Check Icon"
                    className="w-[10px] h-[12px] sm:w-[12.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Visit facilities in person when possible
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/check_green.png"
                    alt="Check Icon"
                    className="w-[10px] h-[12px] sm:w-[12.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Compare multiple facilities before deciding
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <img
                    src="/icons/check_green.png"
                    alt="Check Icon"
                    className="w-[10px] h-[12px] sm:w-[12.7px] sm:h-[14.51px] mt-1"
                  />
                  <p className="font-inter font-normal text-[14px] sm:text-[16.93px] leading-[20px] sm:leading-[24.19px] text-[#374151]">
                    Check reviews and official ratings online
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
