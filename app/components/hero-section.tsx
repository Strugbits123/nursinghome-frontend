"use client"

import { useState, useEffect } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useFacilities } from "../context/FacilitiesContext";
import toast, { Toaster } from "react-hot-toast";

export function HeroSection() {
  const popularSearches = ["New York", "Mexico City", "Toronto", "Los Angeles"]

  const [active, setActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // from context
  const {
    facilities,
    setFacilities,
    coords,
    setCoords,
    locationName,
    setLocationName,
  } = useFacilities();

  const API_URL = process.env.NEXT_PUBLIC_FACILITIES_API as string;

  // const handleSuccess = (msg: string) => {
  //     toast.success(msg, {
  //       position: "top-right",
  //       duration: 4000,
  //     });
  //   };

  // const handleError = (msg: string) => {
  //   toast.error(msg, {
  //     position: "top-right",
  //     duration: 5000,
  //   });
  // };
  const handleUseLocation = () => {
    setActive(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });

          try {
            const rev = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await rev.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";
            const state = data.address.state || "";
            const postcode = data.address.postcode || "";
            const fullName = `${city} ${state} ${postcode}`.trim();
            setLocationName(fullName || `${lat}, ${lon}`);
            toast.success("Facilities loaded successfully!");
          } catch (err:any) {
            toast.error(err.message || "Failed to load facilities");
            console.error("Reverse geocode error:", err);
          }
        },
        (error:any) => {
          console.error("Error getting location:", error);
          toast.error(error.message || "Failed to load facilities");
          setActive(false);
        }
      );
    } else {
      alert("Geolocation not supported");
      setActive(false);
    }
  };
  const fetchFacilities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Build the params your backend expects
      // e.g. extract city/state/zip from your state or locationName
      if (searchQuery) params.append("city", searchQuery);


      const url = `${API_URL}?${params.toString()}`;
      console.log("Fetching from URL:", url);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setFacilities(data || data.facilities || []);
            toast.success("Facilities loaded successfully!");

    } catch (err: any) {
      toast.error(err.message || "Failed to load facilities");

      console.error("Fetch facilities failed", err);
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  // auto-fetch when coords or searchQuery changes
  useEffect(() => {
    if (coords || searchQuery) {
      fetchFacilities();
    }
  }, [coords, searchQuery]);

  return (
    
    <section className=" min-h-[600px] overflow-hidden">
      {/* Background Image */}
      
      <div
        className=" inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          // backgroundImage: `url('/b20ba9d675afe9a11e0416efde3e22d2fb92f8a4.png')`,
        }}
      />
      {/* Content */}
      <div
        className="
            relative z-10
            w-[1256px] h-[152px] 
            mx-auto 
            flex items-center justify-center
            pt-[262px]   /* top offset */
          "
      >
        <h1
          className="
              font-jost font-semibold text-[90px] leading-[91px] tracking-[-6%]
              text-white text-center
            "
        >
          Find the Right Nursing Home <br />
          <span className="italic">for Your Loved Ones</span>
        </h1>
        {/* Description */}

      </div>

      {/* New div below */}
      <div
        className="
            z-10
            w-[1320px] h-[308px]
            mx-auto 
            flex flex-col items-center justify-center
            mt-[120px]  
          "
      >
        {/* Heading */}
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
          {/* Button on the left */}

          {/* <button onClick={handleClick} className={`
              w-[241px] h-[56px]
              rounded-[6px]
              flex items-center px-3 space-x-2 transition-colors duration-200
              ${active ? "bg-[#C71F37]" : "bg-white"}
            `}
          >
            <img
              src="/icons/location_svg.png"
              alt="Location icon"
              className={`
                w-[20px] h-[20px] transition duration-200
                ${active ? "invert brightness-0" : ""}
              `}
            />
            <span
              className={`
                font-jost font-medium
                text-[16px] leading-[100%] tracking-[0%] transition-colors duration-200
                ${active ? "text-white" : "text-[#212529B2]"}
              `}
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


          <button
            className="w-[207px] h-[56px] rounded-[6px] bg-[#C71F37] border border-[#C71F37] text-white flex items-center justify-center gap-1 font-jost font-medium" >
            <img src="/icons/search_svg.png" alt="Eye icon" className=" w-[24px] h-[24px]" />
            Search
          </button> */}
          {/* Use my location button */}
          <button
            onClick={handleUseLocation}
            className={`w-[241px] h-[56px] rounded-[6px] flex items-center px-3 space-x-2 transition-colors duration-200 ${active ? "bg-[#C71F37]" : "bg-white"
              }`}
          >
            <img
              src="/icons/location_svg.png"
              alt="Location icon"
              className={`w-[20px] h-[20px] transition duration-200 ${active ? "invert brightness-0" : ""
                }`}
            />
            <span
              className={`font-jost font-medium text-[16px] leading-[100%] tracking-[0%] transition-colors duration-200 ${active ? "text-white" : "text-[#212529B2]"
                }`}
            >
              Use My Location
            </span>
          </button>

          {/* Input */}
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
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
            onClick={fetchFacilities}
            disabled={isLoading}
            className="w-[207px] h-[56px] rounded-[6px] bg-[#C71F37] border border-[#C71F37] text-white flex items-center justify-center gap-2 font-jost font-medium"
          >
            {isLoading ? (
              <div className="loader"></div>  // your custom CSS loader
            ) : (
              <>
                <img
                  src="/icons/search_svg.png"
                  alt="Search icon"
                  className="w-[24px] h-[24px]"
                />
                Search
              </>
            )}
          </button>
        </div>

        {/* Popular Searches section */}
        <div
          className="
    w-[798.66px] h-[34px]
    mx-auto mt-10
    flex items-center gap-4
  "
        >
          {/* Heading */}
          <span
            className="
      font-inter font-semibold
      text-[20px] leading-[20px]
      text-white
    "
          >
            Popular searches:
          </span>
          {/* Buttons */}
          <button
            className="w-[138.5px] h-[34px] bg-[#C71F37] text-white rounded-[12141.64px] font-inter font-normal text-[16px] leading-[24.29px] flex items-center justify-center"
          >
            New York
          </button>

          <button className="w-[138.5px] h-[34px] bg-[#C71F37] text-white rounded-[12141.64px] font-inter font-normal text-[16px] leading-[24.29px] flex items-center justify-center">
            Los Angeles
          </button>

          <button className="w-[138.5px] h-[34px] bg-[#C71F37] text-white rounded-[12141.64px] font-inter font-normal text-[16px] leading-[24.29px] flex items-center justify-center">
            Chicago
          </button>

          <button
            className="
      w-[138.5px] h-[34px]
      bg-[#C71F37] text-white
      rounded-[12141.64px]
      font-inter font-normal text-[16px] leading-[24.29px]
      flex items-center justify-center
    "
          >
            Miami
          </button>
        </div>

      </div>

      {/* </div> */}


      {/* <div className=" z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">  

          <div className="bg-white/60 rounded-lg shadow-[0_0_0_10px_#FFFFFF33] backdrop-blur-md p-6 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setUseLocation(!useLocation)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    useLocation ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Use My Location</span>
                </button>
              </div>

              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter Location ZIP code, city, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((search) => (
                <Badge
                  key={search}
                  variant="secondary"
                  className="bg-primary text-white hover:bg-primary/90 cursor-pointer px-4 py-2"
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        </div> */}
    </section>
  )
}
