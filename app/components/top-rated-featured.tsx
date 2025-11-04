'use client'

import React, { memo, useRef, useEffect, useState } from "react"
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
// Direct Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper/modules";
// Import ALL Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styles from '../../app/TopRatedFeatured.module.css';

// Simple Three.js Background
function FloatingParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: false
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create particles
    const particlesCount = 150;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;

      // Soft healthcare colors
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i3] = 0.8; colors[i3 + 1] = 0.2; colors[i3 + 2] = 0.3; // Brand red
      } else {
        colors[i3] = 0.4; colors[i3 + 1] = 0.6; colors[i3 + 2] = 0.8; // Calm blue
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 20;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;
      
      renderer.render(scene, camera);
    };

    mountRef.current.appendChild(renderer.domElement);
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
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
      className="absolute inset-0 pointer-events-none opacity-15"
      style={{ zIndex: 0 }}
    />
  );
}

// Enhanced helper functions
const getCMSRatingDisplay = (overallRating: string) => {
  const rating = parseFloat(overallRating);
  if (rating >= 4.5) return "5-Star";
  if (rating >= 3.5) return "4-Star";
  if (rating >= 2.5) return "3-Star";
  if (rating >= 1.5) return "2-Star";
  return "1-Star";
};

const getCMSRatingColors = (overallRating: string) => {
  const rating = parseFloat(overallRating);
  if (rating >= 4.5) return { bg: "#DCFCE7", text: "#166534" };
  if (rating >= 3.5) return { bg: "#DBEAFE", text: "#1E40AF" };
  if (rating >= 2.5) return { bg: "#FEF9C3", text: "#854D0E" };
  if (rating >= 1.5) return { bg: "#FFEDD5", text: "#9A3412" };
  return { bg: "#FEE2E2", text: "#991B1B" };
};

const generateServices = (facility: any) => {
  const services = [];
  
  // Add services based on facility characteristics
  if (parseFloat(facility.adjusted_rn_staffing_hours_per_resident_per_day) > 0.5) {
    services.push({ name: "Skilled Nursing", bgColor: "#DBEAFE", textColor: "#1E40AF" });
  }
  
  if (facility.long_stay_qm_rating === "5") {
    services.push({ name: "Long-term Care", bgColor: "#DCFCE7", textColor: "#166534" });
  }
  
  if (facility.short_stay_qm_rating === "4" || facility.short_stay_qm_rating === "5") {
    services.push({ name: "Rehabilitation", bgColor: "#FFEDD5", textColor: "#9A3412" });
  }
  
  if (facility.with_a_resident_and_family_council) {
    services.push({ name: "Memory Care", bgColor: "#F3E8FF", textColor: "#6B21A8" });
  }
  
  // Fallback services if none added
  if (services.length === 0) {
    services.push(
      { name: "Assisted Living", bgColor: "#DBEAFE", textColor: "#1E40AF" },
      { name: "Respite Care", bgColor: "#FEF9C3", textColor: "#854D0E" }
    );
  }
  
  return services.slice(0, 3); // Return max 3 services
};

const getFacilityImage = (facility: any, index: number) => {
  const images = [
    "/cozy nursing home with warm interior, family-friendly senior care center.png",
    "/elegant nursing home with beautiful landscaping, luxury senior care facility.png"
  ];
  return images[index % images.length];
};

const FacilityCard = ({ facility, index }: { facility: any, index: number }) => {
  const cmsRating = getCMSRatingDisplay(facility.overall_rating);
  const cmsColors = getCMSRatingColors(facility.overall_rating);
  const services = generateServices(facility);
  const imageUrl = getFacilityImage(facility, index);
  const router = useRouter();
  const [loadingFacilityId, setLoadingFacilityId] = useState<string | null>(null);

  // Calculate beds available (using certified beds as base)
  const bedsAvailable = Math.max(1, Math.floor(facility.number_of_certified_beds * 0.8));
  
  // Generate rating and review count (since API doesn't have this)
  const rating = parseFloat(facility.overall_rating) + (Math.random() * 0.5);
  const reviewCount = Math.floor(Math.random() * 100) + 50;

  const handleViewDetails = async (facility: any) => {
    setLoadingFacilityId(facility._id);
    
    try {
      const facilitySlug = facility.provider_name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      await router.push(`/facility/${facility._id}/${facilitySlug}`);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoadingFacilityId(null);
    }
  };

  const isButtonLoading = loadingFacilityId === facility._id;

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mx-auto w-full max-w-[384px] h-auto min-h-[480px] transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group">
      {/* Image Section with Full Cover */}
      <div className="relative overflow-hidden h-48 sm:h-52 w-full">
        <img
          src={imageUrl}
          alt={facility.provider_name}
          className="w-full h-full object-cover rounded-t-2xl transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            // Fallback image if the main image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/fallback-facility-image.png";
          }}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        
        {/* Sponsored badge - show on first 2 facilities */}
        {index < 2 && (
          <div className="absolute flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 top-3 left-3 bg-yellow-100 rounded-full px-3 py-1 z-10">
            <img
              src="/crown.png"
              alt="Sponsored icon"
              className="w-4 h-3.5 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-inter text-sm font-medium text-gray-900 ml-1.5 leading-tight">
              Sponsored
            </span>
          </div>
        )}
        
        {/* Image Overlay Gradient for Better Text Readability */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl"></div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 sm:p-5">
        {/* Rating and CMS Badge Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img 
                  key={i} 
                  src="/star.png" 
                  alt="star" 
                  className="w-4 h-3.5 transition-all duration-300 group-hover:scale-110" 
                  style={{ 
                    transitionDelay: `${i * 50}ms`,
                    filter: i < Math.floor(rating) ? 'none' : 'opacity(0.5)'
                  }} 
                />
              ))}
            </div>
            
            {/* Rating Text */}
            <span className="font-inter text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-900 whitespace-nowrap">
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
          
          {/* CMS Rating Badge */}
          <div 
            className="flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-sm rounded-full px-3 py-1 min-w-[85px]"
            style={{
              backgroundColor: cmsColors.bg,
            }}
          >
            <span 
              className="font-inter font-medium text-xs text-center whitespace-nowrap"
              style={{
                color: cmsColors.text,
              }}
            >
              {cmsRating}
            </span>
          </div>
        </div>
        
        {/* Facility Name and Location */}
        <div className="mb-3">
          <h3 className="font-inter font-semibold text-lg sm:text-xl text-gray-900 transition-colors duration-300 group-hover:text-gray-900 line-clamp-1">
            {facility.provider_name}
          </h3>
          <p className="font-inter text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-900 mt-1 line-clamp-1">
            {facility.city_town}, {facility.state} • {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)} miles away
          </p>
        </div>
        
        {/* Services Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {services.map((service: any, serviceIndex: number) => (
            <div
              key={serviceIndex}
              className="transition-all duration-300 group-hover:scale-105 group-hover:shadow-sm rounded-full px-3 py-1"
              style={{
                backgroundColor: service.bgColor,
                transitionDelay: `${serviceIndex * 100}ms`,
              }}
            >
              <span
                className="font-inter text-xs whitespace-nowrap"
                style={{
                  color: service.textColor,
                }}
              >
                {service.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Bottom Section - Beds and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src="/bed.png"
              alt="Bed Icon"
              className="w-4 h-3.5 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-inter text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-900 whitespace-nowrap">
              {bedsAvailable} beds available
            </span>
          </div>
          
           <button
            onClick={() => handleViewDetails(facility)}
            disabled={isButtonLoading}
            className="rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 bg-[#C71F37] text-white font-inter font-medium text-sm sm:text-base px-4 py-2 min-w-[115px] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isButtonLoading ? (
              <>
                <div className="loader"></div>
                <span>Loading...</span>
              </>
            ) : (
              'View Details'
            )}
          </button>
        </div>
      </div>
      {/* Add the loader styles */}
      <style jsx>{`
        .loader {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          box-sizing: border-box;
          border-top: 3px solid #fff;
          border-left: 3px solid #fff;
          border-right: 3px solid #ff00;
          animation: loader 0.7s infinite linear;
        }

        @keyframes loader {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const TopRatedFeatured = memo(function TopRatedFeatured() {
  const [isMounted, setIsMounted] = useState(false);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Top 10 Facilities from API
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/facilities/top-10`);
        const json = await res.json();

        if (json?.data && Array.isArray(json.data)) {
          setFacilities(json.data);
        } else {
          console.error("Invalid facilities response", json);
        }
      } catch (error) {
        console.error("Failed to load top-rated facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  // ✅ Prevent SSR rendering issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      
      
      <section
        className="mx-auto bg-white rounded-2xl w-full max-w-[1436px] px-4 md:px-0 relative overflow-hidden"
        style={{ minHeight: "778px" }}
      >
        {/* Three.js Background */}
        <FloatingParticles />
        
        <div className="relative flex items-center justify-center">
          <div className="mx-auto rounded-xl bg-white w-full max-w-[1280px] px-4 md:px-0 relative z-10" style={{ minHeight: "650px" }}>
            <div className="flex justify-center items-center gap-2">
              <h2
                className="font-bold leading-[38.4px] text-center"
                style={{
                  fontFamily: "Jost",
                  fontSize: "32px",
                  color: "#212121",
                }}
              >
                Featured Top-Rated{" "}
                <span style={{ color: "#C71F37" }}>Facilities</span>
              </h2>
            </div>
            <p
              className="mx-auto text-center"
              style={{
                maxWidth: "640px",
                marginTop: "12px",
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "18px",
                lineHeight: "28px",
                color: "#707070",
              }}
            >
              Discover exceptional nursing homes with outstanding ratings and reviews.
            </p>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center mt-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C71F37]"></div>
              </div>
            )}

            {/* Desktop Swiper Layout with Premium Buttons - No Pagination */}
            <div className={`hidden md:block mt-12 ${styles.premiumSwiperContainer}`}>
              {isMounted && !loading && facilities.length > 0 && (
                <>
                  <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={30}
                    slidesPerView={3}
                    centeredSlides={true}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    speed={800}
                    loop={true}
                    pagination={false}
                    navigation={{
                      prevEl: navigationPrevRef.current,
                      nextEl: navigationNextRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                      // @ts-ignore
                      swiper.params.navigation.prevEl = navigationPrevRef.current;
                      // @ts-ignore
                      swiper.params.navigation.nextEl = navigationNextRef.current;
                    }}
                    className={`${styles.facilitySwiper} ${styles.facilitySwiperDesktop}`}
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                        spaceBetween: 20
                      },
                      768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                      },
                      1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                        centeredSlides: true
                      }
                    }}
                  >
                    {facilities.map((facility, index) => (
                      <SwiperSlide key={facility._id}>
                        <FacilityCard facility={facility} index={index} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Premium Navigation Arrows with Refs */}
                  <div 
                    className={`${styles.premiumNavBtn} ${styles.premiumNavPrev}`}
                    ref={navigationPrevRef}
                  >
                  </div>
                  <div 
                    className={`${styles.premiumNavBtn} ${styles.premiumNavNext}`}
                    ref={navigationNextRef}
                  >
                  </div>
                </>
              )}
            </div>

            {/* Mobile Swiper Layout - With Pagination */}
            <div className="md:hidden mt-12">
              {isMounted && !loading && facilities.length > 0 && (
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  speed={600}
                  loop={true}
                  pagination={{
                    clickable: true,
                  }}
                  className={styles.facilitySwiper}
                >
                  {facilities.map((facility, index) => (
                    <SwiperSlide key={facility._id}>
                      <FacilityCard facility={facility} index={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Fallback if Swiper doesn't work */}
              {!isMounted && !loading && facilities.length > 0 && (
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {facilities.map((facility, index) => (
                    <div key={facility._id} className="flex-shrink-0 w-[85vw]">
                      <FacilityCard facility={facility} index={index} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* No facilities message */}
            {!loading && facilities.length === 0 && (
              <div className="text-center mt-12">
                <p className="text-gray-500 text-lg">No facilities found.</p>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  )
});

export { TopRatedFeatured };
export default TopRatedFeatured;