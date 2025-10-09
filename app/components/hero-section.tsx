"use client"

import * as React from "react";

import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useFacilities, FACILITIES_STORAGE_KEY, COORDS_STORAGE_KEY, LOCATION_NAME_STORAGE_KEY } from "../context/FacilitiesContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { mapRawFacilityToCard } from '../utils/facilityMapper';
import Image from "next/image";

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
    setIsLoading: setContextIsLoading,
    setError: setContextError,
  } = useFacilities();

  // const API_URL = "http://localhost:5000/api/facilities/with-reviews";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://13.61.57.246:5000/api/facilities/with-reviews";



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

      // Text search if no coordinates
      if (currentSearchQuery && !currentCoords) {
        params.append("q", currentSearchQuery);
      }

      // Coordinates for proximity search
      if (currentCoords?.lat && currentCoords?.lng) {
        params.append("lat", currentCoords.lat.toString());
        params.append("lng", currentCoords.lng.toString());
      }

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

      // 🟡 Check for empty results
      // if (rawFacilitiesList.length === 0) {
      //   toast.error("No facilities found for this location.");
      //   setFacilities([]);
      //   return;
      // }

      const facilitiesList = rawFacilitiesList.map((raw: any) => mapRawFacilityToCard(raw, currentCoords));
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



  /**
   * Handles using the browser's geolocation to get coordinates.
   */
  const handleUseLocation = () => {
    if (!localStorage.getItem("token")) {
      toast.error("Please log in to use this feature");
      return;
    }

    setActive(true);
    setSearchQuery("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setCoords({ lat, lng });
          try {
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

  /**
   * Handles the search submission (text query).
   */
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

    setCoords(null);
    setLocationName(rawQuery);
    setSearchQuery(finalQuery);
    fetchFacilities(finalQuery, null);
  };

  const handlePopularSearchClick = (state: string) => {
    setLocationName(state);
    setSearchQuery(state);
    // fetchFacilities(state, null);
  };

  useEffect(() => {
    if (coords?.lat && coords.lng && locationName && active) {
      fetchFacilities(locationName, coords);
      setActive(false);
    }
  }, [coords, locationName]);

  useEffect(() => {
    if ((coords && coords.lat) || searchQuery) {
    }
  }, [coords, searchQuery]);




  return (

    <section className="min-w-[calc(100%-250px)]  overflow-hidden">
      <div
        className=" inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
        }}
      />
      <div
        className="relative z-10 w-[1256px] h-[152px] mx-auto flex items-center justify-center pt-[262px]   /* top offset */
          "
      >
        <h1 className="font-jost font-semibold text-[90px] leading-[91px] tracking-[-6%] text-white text-center">
           Find the Right Nursing Home <br />
          <span className="italic">for Your Loved Ones</span>
        </h1>
      </div>

      <div className="z-10 w-[1320px] h-[308px] mx-auto flex flex-col items-center justify-center mt-[120px] ">
        <h2 className="text-white text-center font-jost font-light text-[20px] leading-[36px] max-w-[778px]">
          Trusted data from CMS, Google Reviews, and AI insights to help you make the most important decision for your family
        </h2>

        <div
          className="
              z-10
              w-[1186px] h-[78.38px]
              mx-auto mt-15
              bg-white
              rounded-[6.4px]
              shadow-[0_0_0_10px_rgba(255,255,255,0.2)]
              flex items-center
              px-3
              gap-3
            "
        >

          <button
            onClick={handleUseLocation}
            className={`w-[241px] h-[56px] rounded-[6px] flex items-center px-3 space-x-2 transition-colors duration-200 ${active ? "bg-[#C71F37]" : "bg-white"
              }`}
          >
            <Image
              src="/icons/location_svg.png"
              alt="Location icon"
              width={20}
              height={20}
              className={`transition duration-200 ${active ? "invert brightness-0" : ""
                }`}
            />
            <span
              className={`font-jost font-medium text-[16px] leading-[100%] tracking-[0%] transition-colors duration-200 ${active ? "text-white" : "text-[#212529B2]"
                }`}
            >
              Use My Location
            </span>
          </button>

          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter Location ZIP code, city, or state..."
            className="
                w-[703px] h-[56px]
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

          {/* Search button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-[207px] h-[56px] rounded-[6px] bg-[#C71F37] border border-[#C71F37] text-white flex items-center justify-center gap-2 font-jost font-medium"
          >
            {isLoading ? (
              <div className="loader"></div>  // your custom CSS loader
            ) : (
              <>
                <Image
                  src="/icons/search_svg.png"
                  alt="Search icon"
                  width={24}
                  height={24}
                />
                Search
              </>
            )}
          </button>
        </div>

        <div className="w-[798.66px] h-[34px] mx-auto mt-10 flex items-center gap-4">
          {/* Heading */}
          <span
            className=" font-inter font-semibold
 text-[20px] leading-[20px]
      text-white
    "
          >
            Popular searches:
          </span>

          {popularSearches.map((state) => (
            <button
              key={state}
              onClick={() => handlePopularSearchClick(state)}
              className="w-[138.5px] h-[34px] bg-[#C71F37] text-white rounded-[12141.64px] font-inter font-normal text-[16px] leading-[24.29px] flex items-center justify-center transition-all hover:bg-[#a8182f]"
            >
              {state}
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
