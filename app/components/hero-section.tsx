"use client"

import * as React from "react";
import { useState, useEffect, useCallback, memo } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useFacilities, FACILITIES_STORAGE_KEY, COORDS_STORAGE_KEY, LOCATION_NAME_STORAGE_KEY } from "../context/FacilitiesContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { mapRawFacilityToCard } from '../utils/facilityMapper';
import Image from "next/image"; // CRITICAL: This path might need adjustment based on your structure.

interface Coords {
  lat: number;
  lng: number;
}

export function HeroSection() {
    const popularSearches = ["New York", " New Jersey", "Connecticut", "Pennsylvania"];
    const router = useRouter();

    const [active, setActive] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentCoords, setCurrentCoords] = React.useState<{ lat: number; lng: number } | null>(null);


    // from context
    const {
        setFacilities,
        coords,
        setCoords,
        locationName,
        setLocationName,
        // Assuming context also has setters for global loading/error state if needed
        setIsLoading: setContextIsLoading,
        setError: setContextError,
    } = useFacilities();

    // const API_URL = "http://13.61.57.246:5000/api/facilities/with-reviews";
    const API_URL = "http://localhost:5000/api/facilities/with-reviews";

    // ------------------------------------
    // FETCH LOGIC
    // ------------------------------------
    // Consolidated fetch function to handle both manual and location-based search
    const fetchFacilities = async (currentSearchQuery: string, currentCoords: Coords | null) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            toast.error("Please log in to search facilities");
            return;
        }

        setIsLoading(true);
        setContextIsLoading && setContextIsLoading(true);
        setError(null);
        setContextError && setContextError(null);

        try {
            const params = new URLSearchParams();
           if (currentSearchQuery && !currentCoords) {
              params.append("q", currentSearchQuery);
            }
            // Coordinates for proximity search
            if (currentCoords?.lat && currentCoords?.lng) {
              params.append("lat", currentCoords.lat.toString());
              params.append("lng", currentCoords.lng.toString());
            }
            // Enable enrichment and control result size
            params.append("google", "1");
            params.append("ai", "1");
            // params.append("limit", "50");

            const url = `${API_URL}?${params.toString()}`;
            console.log("Fetching from URL:", url);

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });       
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();  
            const rawFacilitiesList = Array.isArray(data) ? data : data?.facilities || [];

            // Map the raw data to the clean Facility format
            const facilitiesList = rawFacilitiesList.map((raw: any) => mapRawFacilityToCard(raw, currentCoords));

            // Set the mapped, clean facilities list in context
            setFacilities(facilitiesList);
            setCoords(currentCoords);
            setLocationName(currentSearchQuery || "");
            // Update localStorage immediately
            if (typeof window !== "undefined") {
              localStorage.setItem(FACILITIES_STORAGE_KEY, JSON.stringify(facilitiesList));
              localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(currentCoords));
              localStorage.setItem(LOCATION_NAME_STORAGE_KEY, JSON.stringify(currentSearchQuery || ""));
            }
            toast.success("Facilities loaded successfully!");

            router.push("/facility-search");
        } catch (err: any) {
            toast.error(err.message || "Failed to load facilities");
            setError(err.message || "Unknown error");
            setContextError && setContextError(err.message || "Unknown error");
            // Clear old data on error
            setFacilities([]);
            setCoords(null);
            setLocationName("");
            if (typeof window !== "undefined") {
              localStorage.removeItem(FACILITIES_STORAGE_KEY);
              localStorage.removeItem(COORDS_STORAGE_KEY);
              localStorage.removeItem(LOCATION_NAME_STORAGE_KEY);
            }
        } finally {
            setIsLoading(false);
            setContextIsLoading && setContextIsLoading(false);
        }
     };

    // ------------------------------------
    // HANDLERS
    // ------------------------------------

    // use current location
    const handleUseLocation = () => {
        if (!localStorage.getItem("token")) {
            toast.error("Please log in to use this feature");
            return;
        }

        setActive(true);
        // Clear any text search before using location
        setSearchQuery(""); 

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Setting coords will trigger the useEffect to fetch
                    setCoords({ lat, lng });

                    try {
                        // Reverse geocode
                        const rev = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                        );
                        const data = await rev.json();
                        const city = data.address.city || data.address.town || data.address.village || "";
                        const state = data.address.state || "";
                        const postcode = data.address.postcode || "";
                        const fullName = `${city} ${state} ${postcode}`.trim();
                        
                        setLocationName(fullName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                        toast.success("Location detected successfully!");
                    } catch (err) {
                        console.error("Reverse geocode error:", err);
                        toast.error("Could not determine location name.");
                    }
                },
                (err: GeolocationPositionError) => {
                    console.error("Geolocation error:", err);
                    toast.error(`Geolocation error: ${err.message}`);
                    setActive(false);
                }
            );
        } else {
            toast.error("Geolocation not supported by this browser.");
            setActive(false);
        }
    };

    // Main search submission handler (for text input and popular searches)
    const handleSubmit = (e?: React.FormEvent, cityQuery?: string) => {
        e?.preventDefault();
        
        const rawQuery = cityQuery || locationName;

        if (!localStorage.getItem("token")) {
            toast.error("Please log in to search facilities");
            return;
        }

         if (!rawQuery.trim()) {
            toast.error("Please enter a city or location name.");
            return;
          }
          const finalQuery = rawQuery.includes(',')
          ? rawQuery.split(',')[0].trim()
          : rawQuery.trim();

        // Reset coordinates as we are searching by name/city now
        setCoords(null);
        setLocationName(finalQuery);
        setSearchQuery(finalQuery); // Sync state if popular search was used

        // Fetch facilities using the city name
        fetchFacilities(finalQuery, null);
    };

    const handlePopularSearchClick = (state: string) => {
      setLocationName(state);
      setSearchQuery(state);
      // fetchFacilities(state, null);
    };


    // ------------------------------------
    // EFFECT HOOK: Triggers fetch after successful geolocation
    // ------------------------------------
    useEffect(() => {
        // Trigger fetch only if coordinates are present AND a location name was successfully determined.
        if (coords?.lat && coords.lng && locationName && active) {
             // We pass locationName as the search query since it contains the city/state info
             fetchFacilities(locationName, coords);
             setActive(false); // Reset active state after fetching
        }
    }, [coords, locationName]);
  // auto-fetch if coords changes
  useEffect(() => {
    if ((coords && coords.lat) || searchQuery) {
      // This effect is intentionally empty - it's just for tracking changes
    }
  }, [coords, searchQuery]);

  return (
    
     <section className="min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          // backgroundImage: `url('/b20ba9d675afe9a11e0416efde3e22d2fb92f8a4.png')`,
        }}
      />

      {/* Hero Content */}
      <div
        className="
          relative z-10
          w-full max-w-[1256px] h-auto sm:h-[152px]
          mx-auto 
          flex items-center justify-center
          pt-[120px] sm:pt-[262px]
          px-4 sm:px-0
        "
      >
        <h1
          className="
            font-jost font-semibold 
            text-[40px] sm:text-[60px] md:text-[80px] lg:text-[90px]
            leading-[42px] sm:leading-[64px] md:leading-[85px] lg:leading-[91px]
            tracking-[-6%]
            text-white text-center
          "
        >
          Find the Right Nursing Home <br />
          <span className="italic">for Your Loved Ones</span>
        </h1>
      </div>

      {/* Search Section */}
      <div
        className="
          relative z-10
          w-full max-w-[1320px] h-auto sm:h-[308px]
          mx-auto 
          flex flex-col items-center justify-center
          mt-[60px] sm:mt-[120px]
          px-4 sm:px-0
        "
      >
        {/* Heading */}
        <h2 className="text-white text-center font-jost font-light text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] sm:leading-[32px] md:leading-[36px] max-w-[778px]">
          Trusted data from CMS, Google Reviews, and AI insights to help you make the most important decision for your family
        </h2>

       {/* Input & Buttons */}
<div
  className="
    relative z-10
    w-full max-w-[1186px] h-auto sm:h-[78.38px]
    mx-auto mt-6 sm:mt-15
    bg-white
    rounded-[6.4px]
    shadow-[0_0_0_10px_rgba(255,255,255,0.2)]
    flex flex-col sm:flex-row items-center
    p-3 sm:px-3
    gap-3
  "
>
  <button
    onClick={handleUseLocation}
    className={`w-full sm:w-[241px] h-[56px] rounded-[6px] flex items-center justify-center sm:justify-start px-3 space-x-2 transition-colors duration-200 ${
      active ? "bg-[#C71F37]" : "bg-white"
    }`}
  >
    <Image
      src="/icons/location_svg.png"
      alt="Location icon"
      width={20}
      height={20}
      className={`transition duration-200 ${
        active ? "invert brightness-0" : ""
      }`}
      priority
    />
    <span
      className={`font-jost font-medium text-[16px] leading-[100%] tracking-[0%] transition-colors duration-200 ${
        active ? "text-white" : "text-[#212529B2]"
      }`}
    >
      Use My Location
    </span>
  </button>

  <input
    type="text"
    value={locationName}
    onChange={(e) => setLocationName(e.target.value)}
    placeholder="Enter Location ZIP code, city, or state..."
    className="
      w-full sm:w-[703px] h-[56px]
      border-x border-[#ADADAD]
      rounded-none
      px-4
      focus:outline-none
      font-jost font-medium
      text-[16px] leading-[100%]
      text-[#212529B2]
      placeholder:text-[#212529B2]
    "
  />

  <button
    onClick={() => fetchFacilities(locationName, coords)}
    disabled={isLoading}
    className="w-full sm:w-[207px] h-[56px] rounded-[6px] bg-[#C71F37] border border-[#C71F37] text-white flex items-center justify-center gap-2 font-jost font-medium"
  >
    {isLoading ? (
      <div className="loader"></div>
    ) : (
      <>
        <Image
          src="/icons/search_svg.png"
          alt="Search icon"
          width={24}
          height={24}
          priority
        />
        Search
      </>
    )}
  </button>
</div>

{/* Popular Searches */}
<div
  className="
    w-full max-w-[798.66px] h-auto sm:h-[34px]
    mx-auto mt-6 sm:mt-10
    flex flex-col sm:flex-row items-center gap-3
  "
>
  {/* Heading */}
  <span
    className="
      font-inter font-semibold
      text-[16px] sm:text-[20px] leading-[20px]
      text-white
      mb-2 sm:mb-0
    "
  >
    Popular searches:
  </span>

  {/* Buttons Container */}
  <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
     {popularSearches.map((state) => (
      <button
        key={state}
        onClick={() => handlePopularSearchClick(state)}
        className="w-[120px] sm:w-[138.5px] h-[34px] bg-[#C71F37] text-white rounded-full font-inter font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24.29px] flex items-center justify-center hover:bg-[#A01A2E] transition-colors duration-200"
      >
        {state}
      </button>
    ))}
  </div>
</div>

      </div>
    </section>
  )
}

