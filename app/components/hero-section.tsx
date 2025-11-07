
"use client";

import * as React from "react";
import { useState, useEffect, useCallback, memo, useRef } from "react"
import { useFacilities, FACILITIES_STORAGE_KEY, COORDS_STORAGE_KEY, LOCATION_NAME_STORAGE_KEY } from "../context/FacilitiesContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { mapRawFacilityToCard } from '../utils/facilityMapper';
import Image from "next/image";
import * as THREE from 'three';
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import AdUnit from "../components/AdUnit";


// Three.js Background Component
function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false
    });

    // Optimized settings
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Create floating healthcare-themed particles
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread particles in a wide area
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Healthcare-themed colors (soft blues, gentle pinks, warm whites)
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Soft blue
        colors[i3] = 0.4; colors[i3 + 1] = 0.6; colors[i3 + 2] = 0.8;
      } else if (colorChoice < 0.7) {
        // Gentle pink
        colors[i3] = 0.9; colors[i3 + 1] = 0.5; colors[i3 + 2] = 0.5;
      } else {
        // Warm white
        colors[i3] = 0.9; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.8;
      }

      sizes[i] = Math.random() * 0.04 + 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add subtle lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    camera.position.z = 8;

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const targetMouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouse.lerp(targetMouse, 0.03);

      // Gentle floating animation with mouse interaction
      particles.rotation.x = elapsedTime * 0.05 + mouse.y * 0.05;
      particles.rotation.y = elapsedTime * 0.03 + mouse.x * 0.05;

      // Subtle floating movement
      particles.position.y = Math.sin(elapsedTime * 0.2) * 0.2;
      particles.position.x = Math.sin(elapsedTime * 0.1) * 0.1;

      renderer.render(scene, camera);
    };

    mountRef.current.appendChild(renderer.domElement);
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ zIndex: 1 }}
    />
  );
}

interface Coords {
  lat: number;
  lng: number;
}

// Helper to extract state/city from a query string
const parseQueryToStateCity = (query: string | undefined) => {
  if (!query) return { state: "", city: "" };
  const parts = query.split(",").map((p) => p.trim());
  if (parts.length === 2) return { city: parts[0], state: parts[1] };
  if (parts.length === 1) return { city: "", state: parts[0] };
  return { city: "", state: "" };
};
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

// const HeroSection = memo(function HeroSection() {  
//   const popularSearches = ["New York", " New Jersey", "Connecticut", "Pennsylvania"];
//   const router = useRouter();

//   const [active, setActive] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentCoords, setCurrentCoords] = React.useState<{ lat: number; lng: number } | null>(null);

//   // from context - REMOVE cache-related functions
//   const {
//     setFacilities,
//     coords,
//     setCoords,
//     locationName,
//     setLocationName,
//     setIsLoading: setContextIsLoading,
//     setError: setContextError,
//     setTotal,
//     recommendations,
//     setRecommendations,
//     refetchFacilities // ✅ Use context's refetch function instead
//   } = useFacilities();

//   const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/with-reviews` || "https://app.carenav.io/api/facilities/with-reviews";

//   // ❌ REMOVE ALL CACHE FUNCTIONS FROM HERE
//   // Remove: getPage1CacheKey, getTotalCacheKey, getRecommendationsCacheKey
//   // Remove: saveToLocationCache, clearLocationCache

//   // Helper: Fetch Top Recommendations
//   const fetchTopRecommendations = async (state: string, city: string, top_n: number) => {
//     if (!state || !city) return [];
//     const token = localStorage.getItem("token") || "";
//     const url = `http://localhost:8000/top-facilities?state=${state}&city=${city}&top_n=${top_n}`;
//     try {
//       const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) return [];
//       const data = await res.json();
//       return data || [];
//     } catch {
//       return [];
//     }
//   };

//   // Extract state and city from query
//   const parseQueryToStateCity = (query: string | undefined) => {
//     if (!query) return { state: "", city: "" };

//     const parts = query.split(",").map((p) => p.trim());
//     if (parts.length === 2) {
//       return { city: parts[0], state: parts[1] };
//     } else if (parts.length === 1) {
//       return { city: "", state: parts[0] };
//     } else {
//       return { city: "", state: "" };
//     }
//   };

//   const fetchFacilities = async (
//     currentSearchQuery: string,
//     currentCoords: Coords | null
//   ) => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//     if (!token) {
//       toast.error("Please log in to search facilities");
//       return;
//     }

//     // ✅ Validate empty input
//     if (
//       (!currentSearchQuery || currentSearchQuery.trim() === "") &&
//       (!currentCoords?.lat || !currentCoords?.lng)
//     ) {
//       toast.error("Please enter a city, state, or ZIP code");
//       return;
//     }

//     setIsLoading(true);
//     setContextIsLoading && setContextIsLoading(true);
//     setError(null);
//     setContextError && setContextError(null);

//     try {
//       // ✅ Build query params
//       const params = new URLSearchParams();

//       if (currentSearchQuery && !currentCoords) {
//         const normalizedQuery = currentSearchQuery
//           .trim()
//           .toLowerCase()
//           .replace(/\s+/g, "_");
//         params.append("q", normalizedQuery);
//       }

//       if (currentCoords?.lat && currentCoords?.lng) {
//         params.append("lat", currentCoords.lat.toString());
//         params.append("lng", currentCoords.lng.toString());
//       }

//       params.append("page", "1");
//       params.append("limit", "8");

//       const url = `${API_URL}?${params.toString()}`;
//       console.log("🔹 Fetching page 1:", url);

//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData?.error || `HTTP ${res.status}`);
//       }

//       const data = await res.json();

//       const rawFacilitiesList = Array.isArray(data.data)
//         ? data.data
//         : data?.facilities || [];

//       // ✅ Map to usable structure
//       const facilitiesList = rawFacilitiesList.map((raw: any) =>
//         mapRawFacilityToCard(raw, currentCoords)
//       );

//       // ✅ Store only first page + meta
//       setFacilities(facilitiesList);
//       setCoords(currentCoords);
//       setLocationName(currentSearchQuery || "");
//       setTotal(data.total || 0);

//       // ✅ Fetch Top Recommendations based on state/city
//       const { state, city } = parseQueryToStateCity(currentSearchQuery);
//       console.log("🔹 Fetching top recommendations for:", state, city);
//       const topFacilities = await fetchTopRecommendations(state, city, 5);
//       setRecommendations(topFacilities);

//       // ❌ REMOVE: saveToLocationCache call - Context will handle caching

//       // ✅ Save to localStorage for backward compatibility
//       localStorage.setItem(
//         FACILITIES_STORAGE_KEY,
//         JSON.stringify(facilitiesList)
//       );
//       localStorage.setItem(
//         COORDS_STORAGE_KEY,
//         JSON.stringify(currentCoords || null)
//       );
//       localStorage.setItem(
//         LOCATION_NAME_STORAGE_KEY,
//         JSON.stringify(
//           currentSearchQuery
//             ? currentSearchQuery.trim().replace(/\s+/g, "_").toLowerCase()
//             : ""
//         )
//       );

//       console.log(
//         `✅ Loaded page 1 facilities (${facilitiesList.length}) for "${currentSearchQuery}"`,
//         `Top Recommendations: ${topFacilities.length}`
//       );

//       toast.success("Facilities loaded successfully!");
//       router.push("/facility-search");

//     } catch (err: any) {
//       console.error("❌ Fetch failed:", err);
//       toast.error(err.message || "Failed to load facilities");
//       setError(err.message || "");
//       setContextError && setContextError(err.message || "");

//       // 🔹 Clear stale cache on error
//       setFacilities([]);
//       setCoords(null);
//       setLocationName("");
//       setRecommendations([]);

//       // ❌ REMOVE: clearLocationCache call - Context will handle cache clearing

//       localStorage.removeItem(FACILITIES_STORAGE_KEY);
//       localStorage.removeItem(COORDS_STORAGE_KEY);
//       localStorage.removeItem(LOCATION_NAME_STORAGE_KEY);

//     } finally {
//       setIsLoading(false);
//       setContextIsLoading && setContextIsLoading(false);
//     }
//   };




//   // ------------------------------------
//   // HANDLERS
//   // ------------------------------------

//   // use current location
//   const handleUseLocation = () => {
//     if (!localStorage.getItem("token")) {
//       toast.error("Please log in to use this feature");
//       return;
//     }

//     setActive(true);
//     // Clear any text search before using location
//     setSearchQuery("");

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;

//           // Setting coords will trigger the useEffect to fetch
//           setCoords({ lat, lng });

//           try {
//             // Reverse geocode
//             const rev = await fetch(
//               `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//             );
//             const data = await rev.json();
//             const city = data.address.city || data.address.town || data.address.village || "";
//             const state = data.address.state || "";
//             const postcode = data.address.postcode || "";
//             const fullName = `${city} ${state} ${postcode}`.trim();

//             setLocationName(fullName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
//             toast.success("Location detected successfully!");
//           } catch (err) {
//             console.error("Reverse geocode error:", err);
//             toast.error("Could not determine location name.");
//           }
//         },
//         (err: GeolocationPositionError) => {
//           console.error("Geolocation error:", err);
//           toast.error(`Geolocation Error`);
//           setActive(false);
//         }
//       );
//     } else {
//       toast.error("Geolocation not supported by this browser.");
//       setActive(false);
//     }
//   };

//   // Main search submission handler (for text input and popular searches)
//   const handleSubmit = (e?: React.FormEvent, cityQuery?: string) => {
//     e?.preventDefault();

//     const rawQuery = cityQuery || locationName;

//     if (!localStorage.getItem("token")) {
//       toast.error("Please log in to search facilities");
//       return;
//     }

//     if (!rawQuery.trim()) {
//       toast.error("Please enter a city or location name.");
//       return;
//     }
//     const finalQuery = rawQuery.includes(',')
//       ? rawQuery.split(',')[0].trim()
//       : rawQuery.trim();

//     // Reset coordinates as we are searching by name/city now
//     setCoords(null);
//     setLocationName(finalQuery);
//     setSearchQuery(finalQuery); // Sync state if popular search was used

//     // Fetch facilities using the city name
//     fetchFacilities(finalQuery, null);
//   };

//   const handlePopularSearchClick = (state: string) => {
//     setLocationName(state);
//     setSearchQuery(state);
//     // fetchFacilities(state, null);
//   };


//   useEffect(() => {
//     if (coords?.lat && coords.lng && locationName && active) {
//       fetchFacilities(locationName, coords);
//       setActive(false);
//     }
//   }, [coords, locationName]);
//   useEffect(() => {
//     if ((coords && coords.lat) || searchQuery) {
//     }
//   }, [coords, searchQuery]);
const HeroSection = memo(function HeroSection() {
  const popularSearches = ["New York", " New Jersey", "Connecticut", "Pennsylvania"];
  const router = useRouter();

  const [active, setActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = React.useState<{ lat: number; lng: number } | null>(null);

  // ✅ FIXED: Use context's fetchFacilitiesWithReviews function
  const {
    fetchFacilitiesWithReviews, // ✅ This handles caching and recommendations automatically
    setCoords,
    locationName,
    setLocationName,
    setIsLoading: setContextIsLoading,
    setError: setContextError,
  } = useFacilities();

  // ✅ FIXED: Simple search handler that uses context function
  const handleSearch = async (searchQuery: string, coords: Coords | null) => {
    // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // if (!token) {
    //   toast.error("Please log in to search facilities");
    //   return;
    // }

    if ((!searchQuery || searchQuery.trim() === "") && (!coords?.lat || !coords?.lng)) {
      toast.error("Please enter a city, state, or ZIP code");
      return;
    }

    setIsLoading(true);
    setContextIsLoading && setContextIsLoading(true);
    setError(null);
    setContextError && setContextError(null);

    try {
      // ✅ FIXED: Use context function which handles caching and recommendations automatically
      await fetchFacilitiesWithReviews(searchQuery, coords);

      console.log(`✅ Search completed for "${searchQuery}"`);
      toast.success("Facilities loaded successfully!");
      router.push("/facility-search");

    } catch (err: any) {
      console.error("❌ Search failed:", err);
      toast.error(err.message || "Failed to load facilities");
      setError(err.message || "error");
      setContextError && setContextError(err.message || "error");
    } finally {
      setIsLoading(false);
      setContextIsLoading && setContextIsLoading(false);
    }
  };

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
          setCurrentCoords({ lat, lng });

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
          toast.error(`Geolocation Error`);
          setActive(false);
        }
      );
    } else {
      toast.error("Geolocation not supported by this browser.");
      setActive(false);
    }
  };

  // Main search submission handler
  const handleSubmit = (e?: React.FormEvent, cityQuery?: string) => {
    e?.preventDefault();

    const rawQuery = cityQuery || locationName || searchQuery;

    // if (!localStorage.getItem("token")) {
    //   toast.error("Please log in to search facilities");
    //   return;
    // }

    if (!rawQuery.trim()) {
      toast.error("Please enter a city or location name.");
      return;
    }

    const finalQuery = rawQuery.includes(',')
      ? rawQuery.split(',')[0].trim()
      : rawQuery.trim();

    // Reset coordinates as we are searching by name/city now
    setCoords(null);
    setCurrentCoords(null);
    setLocationName(finalQuery);
    setSearchQuery(finalQuery);

    // ✅ FIXED: Use the context function instead of local fetch
    handleSearch(finalQuery, null);
  };

  const handlePopularSearchClick = (state: string) => {
    setLocationName(state);
    setSearchQuery(state);
    handleSearch(state, null);
  };

  // Handle location-based search when coords are available
  useEffect(() => {
    if (currentCoords?.lat && currentCoords.lng && locationName && active) {
      handleSearch(locationName, currentCoords);
      setActive(false);
    }
  }, [currentCoords, locationName, active]);


  return (
    <section className="min-h-[900px]  relative">


      {/* Three.js Background */}
      <ThreeBackground />

      {/* Hero Content - EXACT SAME LAYOUT */}
      <div className="relative z-10 w-full max-w-[1256px] h-auto sm:h-[152px] mx-auto flex items-center justify-center pt-[120px] sm:pt-[262px] px-4 sm:px-0">
  <h1 className="font-jost font-semibold text-[40px] sm:text-[60px] md:text-[80px] lg:text-[90px] leading-[42px] sm:leading-[64px] md:leading-[85px] lg:leading-[91px] tracking-[-6%] text-white text-center">Find the Best Nursing Homes Near You <br /><span className="italic">for Your Loved Ones' Care</span></h1>
</div>
          {/* Find the Best Nursing Homes Near You <br />
          <span className="italic">for Your Loved Ones' Care</span>
        </h1>
      </div> */}

      {/* Search Section */}
      <div
        className="
                relative z-10
                w-full max-w-[1320px] h-auto sm:h-[308px]
                mx-auto 
                flex flex-col items-center justify-center
                mt-[30px] sm:mt-[120px]
                px-4 sm:px-0
                "
      >
        {/* Heading */}
        <h2 className="text-white text-center font-jost font-light text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] sm:leading-[32px] md:leading-[36px] max-w-[778px]">
         (Trusted data from CMS, Google Reviews, and AI insights to guide you in making the best decision for your family.)
        </h2>

        {/* <h2 className="text-white text-center font-jost font-light text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] sm:leading-[32px] md:leading-[36px] max-w-[778px]">
        At CareNav, we understand the challenges families face in finding the right place to call home for their loved ones. That’s why we’ve created a platform to help you navigate the process with ease.
        </h2> */}
        
        {/* Input & Buttons */}
        <div
          className="
          relative z-10 
          w-full max-w-[1186px] 
          h-auto sm:h-[78.38px] 
          mx-2 sm:mx-auto 
          mt-6 sm:mt-10 
          bg-white 
          rounded-[6.4px] 
          shadow-[0_0_0_10px_rgba(255,255,255,0.2)] 
          flex flex-col sm:flex-row items-center 
          p-3 sm:px-4 gap-3
          sm:w-[94%] md:w-[96%] lg:w-full
          [@media(min-width:640px)_and_(max-width:880px)]:p-4
          [@media(min-width:640px)_and_(max-width:880px)]:gap-2
        "
        > 
          <button
            onClick={handleUseLocation}
            className={`w-full sm:w-[220px] md:w-[230px] h-[56px] rounded-[6px] flex items-center justify-center sm:justify-start px-3 space-x-2 transition-colors duration-200 ${active ? "bg-[#C71F37]" : "bg-white"
              }`}
          >
            <Image
              src="/icons/location_svg.png"
              alt="Location icon"
              width={20}
              height={20}
              className={`transition duration-200 ${active ? "invert brightness-0" : ""}`}

              priority
            />
            <span
              className={`font-jost font-medium text-[15px] cursor-pointer sm:text-[16px] leading-[100%] transition-colors duration-200 ${active ? "text-white" : "text-[#212529B2]"
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
                      w-full sm:flex-1 md:w-[65%] lg:w-[703px]
                      h-[56px] border-x border-[#ADADAD]
                      rounded-none px-4 focus:outline-none 
                      font-jost font-medium text-[15px] sm:text-[16px]
                      text-[#212529B2] placeholder:text-[#212529B2]
                      [@media(min-width:640px)_and_(max-width:880px)]:text-[15px]
                      [@media(min-width:640px)_and_(max-width:880px)]:px-3
                    "
          />

          <button
            onClick={() => handleSearch(locationName, currentCoords)}
            disabled={isLoading}
            className="
                        w-full sm:w-[180px] md:w-[190px] h-[56px]
                        rounded-[6px] bg-[#C71F37] border border-[#C71F37]
                        text-white flex items-center justify-center gap-2
                        font-jost font-medium transition-all duration-200
                        hover:bg-[#A01A2E]
                        cursor-pointer
                        [@media(min-width:640px)_and_(max-width:880px)]:text-[15px]
                      "
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
                    [@media(min-width:640px)_and_(max-width:880px)]:ml-30
                    [@media(min-width:640px)_and_(max-width:880px)]:mt-8
                    [@media(min-width:640px)_and_(max-width:880px)]:h-[550px]
                    [@media(min-width:640px)_and_(max-width:880px)]:pb-5
                    w-full max-w-[798.66px]
                    h-auto sm:h-[34px]
                    mx-2 sm:mx-12 md:mx-16 lg:mx-auto
                    mt-6 sm:mt-10
                    flex flex-col sm:flex-row items-center gap-3
                    "
        >
          {/* Heading */}
          <span className="font-inter font-semibold text-[16px] sm:text-[20px] leading-[20px] text-white mb-2 sm:mb-0">

            Popular searches:
          </span>

          {/* Buttons Container */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4
       ">
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
});

export { HeroSection };