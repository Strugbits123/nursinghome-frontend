'use client'

import React, { useState, useEffect,useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import { useFacilities, Facility } from "../context/FacilitiesContext";
import MapView from '../components/MapView'; 
import FacilityReviewSkeleton from '../components/ReviewSkeleton';



const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const extractFacilityCoords = (facilities: Facility[]) => {
  return facilities
    .filter(
      (f) =>
        f.lat !== undefined &&
        f.lat !== null &&
        f.lat !== 0 &&
        f.lng !== undefined &&
        f.lng !== null &&
        f.lng !== 0
    )
    .map((f) => ({
      lat: f.lat as number,
      lng: f.lng as number,
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
  if (searchCoords && searchCoords.lat && searchCoords.lng) {
    return { lat: searchCoords.lat, lng: searchCoords.lng };
  }

  const validFacilities = facilities.filter((f) => f.lat && f.lng);
  if (validFacilities.length === 0)
    return { lat: 34.0522, lng: -118.2437 }; // Default LA

  const totalLat = validFacilities.reduce((sum, f) => sum + (f.lat ?? 0), 0);
  const totalLng = validFacilities.reduce((sum, f) => sum + (f.lng ?? 0), 0);


  return {
    lat: totalLat / validFacilities.length,
    lng: totalLng / validFacilities.length,
  };
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

export default function FacilitySearchPage() {
    
    const [openAuth, setOpenAuth] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const router = useRouter();
    const { facilities, locationName, isLoading, error, coords } = useFacilities();

    console.log('facilities from context:', facilities);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showSkeletonTimer, setShowSkeletonTimer] = useState(true);

    const totalFacilities = facilities.length;
    const totalPages = Math.ceil(totalFacilities / ITEMS_PER_PAGE);

    const paginatedFacilities = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return facilities.slice(startIndex, endIndex);
    }, [facilities, currentPage]);

    const startFacility = totalFacilities > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
    const endFacility = Math.min(startFacility + ITEMS_PER_PAGE - 1, totalFacilities);

    const goToNextPage = useCallback(() => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const goToPrevPage = useCallback(() => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    const goToPage = useCallback((page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

  const [selectedCoords, setSelectedCoords] = useState<{lat: number; lng: number} | null>(null);
  const mapCenter = useMemo(() => {
    if (selectedCoords) return selectedCoords;
    return calculateMapCenter(facilities, coords as any);
  }, [facilities, coords, selectedCoords]);

  const facilityCoords = useMemo(
    () => extractFacilityCoords(facilities),
    [facilities]
  );
    
  

  
  

  // const facilityCoords = useMemo(
  //   () => extractFacilityCoords(facilities),
  //   [facilities]
  // );
  // const mapCenter = useMemo(
  //   () => calculateMapCenter(facilities, coords as any),
  //   [facilities, coords]
  // );







    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('Skeleton timer complete (5 seconds)');
            setShowSkeletonTimer(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        if (facilities.length === 0 && !isLoading) {
              router.push('/')
        }
      }
    }, [router, facilities.length, isLoading])

    React.useEffect(() => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setCurrentPage(1); 
    }, [facilities]);

    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      toast.success("Logged out successfully!");
      router.push('/');
    };
    
    // const facilityCoords = useMemo(() => extractFacilityCoords(facilities), [facilities]);
    // const mapCenter = useMemo(() => calculateMapCenter(facilities, coords as any), [facilities, coords]);
    
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

    if (facilities.length === 0 && locationName) {
        return (
            <div className="p-10 text-center text-xl">
                <h2 className="text-2xl font-bold mb-2">No Facilities Found</h2>
                <p className="text-[#4B5563]">
                    Your search for **"{locationName}"** returned no results.
                </p>
                <Button onClick={() => router.push('/')} className="mt-4 bg-red-600 hover:bg-red-700">
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
        <div className="max-w-[1856px] h-[46px] mx-auto px-[32px] flex items-center justify-between">
          <img
            src="/footer_icon.png"
            alt="NursingHome Logo"
            className="w-[176px] h-[47px] mt-7 ml-30"
          />

          <nav className="w-[357px] h-[65px] flex items-center space-x-8 mt-8 mr-50">
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
              What’s New!
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

          <div className="w-[406.5px] h-[54px] flex items-center justify-end mt-9 mr-50 space-x-6">
            {isAuthenticated ? (
              <div
                onClick={handleLogout}
                className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-4 py-6"
              >
                <img
                  src="/arrow-btn.png"
                  alt="Logout icon"
                  className="w-[18.78px] h-[18.78px] mr-2"
                />
                <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                  Logout
                </span>
              </div>
            ) : (
              <div
                onClick={() => setOpenAuth(true)}
                className="flex cursor-pointer items-center w-[130px] h-[35.2px] rounded-md hover:bg-[#a91a2e] px-4 py-6"
              >
                <img
                  src="/icons/header_sign.png"
                  alt="Sign in icon"
                  className="w-[18.78px] h-[18.78px]  mr-2"
                />
                <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-white">
                  Sign In
                </span>
              </div>
            )}

            <button className="flex items-center justify-center w-[163.37px] h-[54px] bg-white hover:bg-[#a91a2e] rounded-[7.04px] px-4">
              <img
                src="/icons/faciltiy_search_svg.png"
                alt="Add icon"
                className="w-[18.78px] h-[18.78px] fill-red-500  mr-2 invert"
              />
              <span className="font-jost font-semibold text-[16px] leading-[15.26px] tracking-[0.23px] capitalize text-[#c71f37]">
                Add Listing
              </span>
            </button>
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

      <section className="w-full h-[60px] bg-[#F5F5F5] flex items-center justify-between px-22 ">
        <div className="flex items-center gap-x-2 text-[#4B5563] mx-25 font-inter font-normal text-[16.28px] leading-[23.26px]">
          <span className="align-middle">Home</span>
          <img
            src="/icons/search_fac_right_icon.png"
            alt="Arrow"
            className="w-[8.72px] h-[13.95px] align-middle"
          />
          <span className="align-middle">Search Results</span>
          <img
            src="/icons/search_fac_right_icon.png"
            alt="Arrow"
            className="w-[8.72px] h-[13.95px] align-middle"
          />
          <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#111827] align-middle">
            New York, NY
          </span>
        </div>


        <button className="flex items-center gap-2 bg-[#F5F5F5] text-[#C71F37] px-4 mx-45 py-2 hover:bg-[#f5f5f5] transition">
          <img
            src="/icons/facility_search_heart_icon.png"
            alt="Save icon"
            className="w-[16.28px] h-[16.28px]"
          />
          <span className="font-inter font-normal text-[16.28px] leading-[23.26px] text-center">
            Save Search
          </span>
        </button>
      </section>

      <section className="w-[1529px] h-[148px] ml-[195px] bg-white flex flex-col justify-center px-6 py-4">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center space-x-4">
            <span
              className="font-inter font-medium text-[18px] leading-[28.67px] text-[#111827]"
              style={{ width: "340px", height: "28.67px", lineHeight: "28.67px" }}
            >
              {facilities.length} Facilities Found
            </span>
            <div className="flex items-center gap-2">
              <img
                src="/icons/location_icon_new.png"
                alt="Location Icon"
                className="w-[14.33px] h-[19.11px]"
              />

              {/* Text */}
              <span className="font-inter font-normal text-[16px] leading-[23.26px] text-[#6B7280]">
                Within 25 miles
              </span>
            </div>

          </div>

          <div className="flex items-center space-x-4">
            <button
              className="w-[233px] h-[48px] bg-[#EFEFEF] rounded-[9.56px] border border-[#E5E7EB] text-[#212121] font-inter font-medium hover:bg-gray-50 transition"
            >
              Sort by: Best Match
            </button>
            <button
              className="flex items-center w-[97.68px] h-[48.84px] border border-[#D1D5DB] rounded-[9.3px] overflow-hidden font-inter"
            >
              <div className="flex items-center justify-center w-[46.51px] h-[46.51px] bg-[#D02B38] rounded-l-[9.3px]">
                <img
                  src="/icons/list_icon.png"
                  alt="Left Icon"
                  className="w-[16px] h-[16px]"
                />
              </div>
              <div className="flex items-center justify-center flex-1">
                <img
                  src="/icons/map_icon.png"
                  alt="Right Icon"
                  className="w-[20.93px] h-[16px]"
                />
              </div>
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-start">
          <button
            className="flex items-center justify-center gap-2 w-[129.96px] h-[43px] rounded-[9.56px] bg-[#D02B38] px-3"
          >
            <img
              src="/icons/stars_icon.png"
              alt="Stars Icon"
              className="w-[16.81px] h-[16.72px]"
            />
            <span className="font-inter font-medium text-[16.72px] leading-[23.89px] text-white">
              4+ Stars
            </span>
          </button>
          <div className="w-full flex items-center justify-start gap-4 ml-4">
            <button className="flex items-center justify-center w-[154.3px] h-[44.19px] rounded-[9.3px] bg-white border border-[#D1D5DB] px-4 gap-x-3">
              <img src="/icons/location_icon_new.png" alt="Left Icon" className="w-[13.95px] h-[18.60px]" />
              <span className="font-inter font-medium text-[16.28px] leading-[23.26px] text-black">Distance</span>
              <img src="/icons/down_icon.png" alt="Right Icon" className="w-[12.21px] h-[6.98px]" />
            </button>

            <button className="flex items-center justify-center w-[199.41px] h-[44.19px] rounded-[9.3px] bg-white border border-[#D1D5DB] px-4 gap-x-3">
              <img src="/icons/Bed_icon.png" alt="Left Icon" className="w-[23.26px] h-[18.60px]" />
              <span className="font-inter font-medium text-[16.28px] leading-[23.26px] text-black">Bed Capacity</span>
              <img src="/icons/down_icon.png" alt="Right Icon" className="w-[12.21px] h-[6.98px]" />
            </button>

            <button className="flex items-center justify-center w-[170.42px] h-[44.19px] rounded-[9.3px] bg-white border border-[#D1D5DB] px-4 gap-x-3">
              <img src="/icons/building_icon.png" alt="Left Icon" className="w-[13.81px] h-[18.60px]" />
              <span className="font-inter font-medium text-[16.28px] leading-[23.26px] text-black">Ownership</span>
              <img src="/icons/down_icon.png" alt="Right Icon" className="w-[12.21px] h-[6.98px]" />
            </button>

            <button className="flex items-center justify-center w-[177.3px] h-[44.19px] rounded-[9.3px] bg-white border border-[#D1D5DB] px-4 gap-x-3">
              <img src="/icons/price_icon.png" alt="Left Icon" className="w-[11px] h-[18.60px]" />
              <span className="font-inter font-medium text-[16.28px] leading-[23.26px] text-black">Price Range</span>
              <img src="/icons/down_icon.png" alt="Right Icon" className="w-[12.21px] h-[6.98px]" />
            </button>

            <button className="flex items-center justify-center w-[183.34px] h-[44.19px] rounded-[9.3px] bg-white border border-[#D1D5DB] px-4 gap-x-3">
              <img src="/icons/filter_icon.png" alt="Left Icon" className="w-[18px] h-[18.60px]" />
              <span className="font-inter font-medium text-[16.28px] leading-[23.26px] text-black">More Filters</span>
              <img src="/icons/down_icon.png" alt="Right Icon" className="w-[12.21px] h-[6.98px]" />
            </button>

          </div>
        </div>
      </section>

                  <section className="w-[1736.7px] min-h-[2368px] flex gap-6 ml-5 mt-[40px] px-48">
                    <div className="w-[726px] space-y-4"> 
                      {paginatedFacilities.map((facility, i) => (
                        // <div
                        //   key={facility.id || i}
                        //   className={`
                        //     w-[707.13px] h-auto p-4 
                        //     bg-[#F9F9F9] 
                        //     rounded-[9.56px] 
                        //     shadow-[0px_1.19px_2.39px_0px_#0000000D]
                        //     transition-all duration-150 ease-in
                        //     flex
                        //     ${facility.isFeatured ? 'border-l-[4.78px] border-[#FACC15]' : ''}
                        //   `}
                        // >
                        <div
                          key={facility.id || i}
                          className="w-[707.13px] h-auto p-4 bg-[#F9F9F9] rounded-[9.56px] shadow …"
                          // when clicking a card, recenter the map
                          onClick={() => {
                            if (facility.lat && facility.lng) {
                              setSelectedCoords({lat: facility.lat, lng: facility.lng});
                            }
                          }}
                        >
                          <div className="flex">
                            <div className="w-1/4">
                              <div
                                className=" w-[114.67px] h-[114.67px]  flex items-center justify-center mt-15 ml-5">
                                <img
                                  src={facility.imageUrl || "/default_facility_image.png"}
                                  alt={facility.name}
                                  className="max-w-full max-h-full rounded-[9.56px]"
                                />
                              </div>
                            </div>

                            <div className="flex-1 mt-11 ml-1 p-5">
                              <h3 className="font-inter font-bold text-[23.89px] leading-[33.45px] text-[#111827]">
                                {facility.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-2">
                                <img src="/icons/location_icon_new.png" alt="Location Icon" className="w-[12.54px] h-[16.72px] self-start mt-1"/>
                                <span className="font-inter font-normal text-[16.72px] leading-[23.89px] text-[#4B5563]">
                                  {facility.distance != null ? `${facility.distance.toFixed(1)} miles` : ''} 
                                  {facility.address ? ` • ${facility.address}` : ''}
                                </span>
                              </div>

                              <div className="flex items-center gap-6 mt-3">
                                <div className="flex items-center gap-2">
                                  <img src="/icons/bed_icon (2).png" alt="Beds Icon" className="w-[20.9px] h-[14.63px]"/>
                                  <span className="font-inter font-normal text-[16.72px] leading-[23.89px] text-[#4B5563]">
                                    {facility.beds} beds
                                  </span>
                                </div>

                                <span className="font-inter font-normal text-[16.72px] leading-[23.89px] text-[#4B5563]">
                                  {facility.isNonProfit ? 'Non-Profit' : 'For-Profit'}
                                </span>
                                <span className={`font-inter font-medium text-[16.72px] leading-[23.89px] ${getStatusColor(facility.status)}`}>
                                  {facility.status}
                                </span>
                              </div>

                              <div className="w-[478.01px] h-auto min-h-[55.89px] px-3 py-2 rounded-[4.78px] mt-6 bg-[#F5F5F5] grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-[#16A34A] text-[14.33px] leading-[19.11px] font-medium">✓</span>
                                  <p className="font-inter font-normal text-[14.33px] leading-[19.11px] text-[#16A34A]">
                                    Pros: {facility.pros}
                                  </p>
                                </div>

                                <div className="flex items-start gap-2">
                                  <span className="text-[#DC2626] text-[14.33px] leading-[19.11px] font-medium">✗</span>
                                  <p className="font-inter font-normal text-[14.33px] leading-[19.11px] text-[#DC2626]">
                                    Cons: {facility.cons}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-6">
                                  {/* 📞 Phone */}
                                  <div className="flex items-center gap-2">
                                    <img src="/icons/phone_icon.png" alt="Phone Icon" className="w-[12.33px] h-[12.33px]"/>
                                    <span className="font-inter font-normal text-[14.33px] leading-[19.11px] text-[#4B5563]">
                                      {facility.phone}
                                    </span>
                                  </div>

                                  {/* ⏰ Open hours */}
                                  <div className="flex items-center gap-2">
                                    <img src="/icons/clock_icon.png" alt="Clock Icon" className="w-[14.33px] h-[14.33px]"/>
                                    <span className="font-inter font-normal text-[14.33px] leading-[19.11px] text-[#4B5563]">
                                      {facility.hours}
                                    </span>
                                  </div>
                                </div>

                                <button className="w-[136.76px] h-[43px] bg-[#D02B38] rounded-[4.78px] text-white font-inter font-medium text-[16.72px] leading-[23.89px] text-center"
                                  onClick={() => {
                                      const facilitySlug = slugify(facility.name); 
                                      router.push(`/facility/${facility.id}/${facilitySlug}`);
                                    }}>
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

        
                      {totalPages > 1 && (
                          <div className="flex items-center justify-between w-[707.13px] h-[102.72px] rounded-[9.56px] bg-white px-6 mt-4">
                              <p className="text-[#4B5563] font-inter text-[16.72px] leading-[23.89px]">
                                  Showing **{startFacility}–{endFacility}** of **{totalFacilities}** facilities
                              </p>
                              <div className="flex items-center gap-x-2">
                                  <button
                                      onClick={goToPrevPage}
                                      disabled={currentPage === 1}
                                      className={`
                                        w-[99.38px] h-[45.39px] rounded-[9.56px] border border-[#E5E7EB]
                                        font-inter text-[16.72px] leading-[23.89px]
                                        ${currentPage === 1 
                                            ? 'bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed' 
                                            : 'text-black hover:bg-gray-50'
                                        }
                                      `}
                                  >
                                      Previous
                                  </button>
                                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                      <button
                                          key={page}
                                          onClick={() => goToPage(page)}
                                          className={`
                                            w-[41.27px] h-[45.39px] rounded-[9.56px]
                                            font-inter font-medium text-[16.72px] leading-[23.89px]
                                            ${currentPage === page
                                                ? 'bg-[#D02B38] text-white'
                                                : 'border border-[#E5E7EB] bg-white text-black hover:bg-gray-50'
                                            }
                                          `}
                                      >
                                          {page}
                                      </button>
                                  ))}
                                  <button
                                      onClick={goToNextPage}
                                      disabled={currentPage === totalPages}
                                      className={`
                                        w-[67.97px] h-[45.39px] rounded-[9.56px] border border-[#E5E7EB]
                                        font-inter text-[16.72px] leading-[23.89px]
                                        ${currentPage === totalPages
                                            ? 'bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed' 
                                            : 'text-black hover:bg-gray-50'
                                        }
                                      `}
                                  >
                                      Next
                                  </button>
                              </div>
                          </div>
                      )}
                    </div>
                    <div
                        className="
                            w-[778.7px] h-[677px] 
                            bg-white 
                            rounded-[9.56px] 
                            shadow-[0px_1.19px_2.39px_0px_#0000000D]
                            overflow-hidden 
                            sticky top-6
                            flex items-center justify-center
                        "
                    >
                       {/* map */}
                {GOOGLE_MAPS_API_KEY ? (
                <MapView
                  facilities={facilityCoords}
                  centerCoords={mapCenter}
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  locationName={locationName}
                  markerIconUrl="/icons/red_hospital_pin.png"
                />

                ) : (
                  <div>…your fallback…</div>
                )}
                    </div>
                  </section>

                  <section className="w-[1736.7px] h-[566px] mx-50 mt-[80px]">
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
                  </section>
    </>
  )
}
