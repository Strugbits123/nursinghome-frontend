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
      className={styles.backgroundContainer}
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
    <div className={styles.facilityCard}>
      {/* Image Section with Full Cover */}
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={facility.provider_name}
          className={styles.facilityImage}
          onError={(e) => {
            // Fallback image if the main image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/fallback-facility-image.png";
          }}
        />
        <div className={styles.imageOverlay}></div>
        
        {/* Sponsored badge - show on first 2 facilities */}
        {index < 2 && (
          <div className={styles.sponsoredBadge}>
            <img
              src="/crown.png"
              alt="Sponsored icon"
              className={styles.sponsoredIcon}
            />
            <span className={styles.sponsoredText}>
              Sponsored
            </span>
          </div>
        )}
        
        {/* Image Overlay Gradient for Better Text Readability */}
        <div className={styles.imageGradient}></div>
      </div>
      
      {/* Content Section */}
      <div className={styles.cardContent}>
        {/* Rating and CMS Badge Row */}
        <div className={styles.ratingRow}>
          <div className={styles.ratingContainer}>
            {/* Stars */}
            <div className={styles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <img 
                  key={i} 
                  src="/star.png" 
                  alt="star" 
                  className={styles.starIcon}
                  style={{ 
                    transitionDelay: `${i * 50}ms`,
                    filter: i < Math.floor(rating) ? 'none' : 'opacity(0.5)'
                  }} 
                />
              ))}
            </div>
            
            {/* Rating Text */}
            <span className={styles.ratingText}>
              {rating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
          
          {/* CMS Rating Badge */}
          <div 
            className={styles.cmsBadge}
            style={{
              backgroundColor: cmsColors.bg,
            }}
          >
            <span 
              className={styles.cmsBadgeText}
              style={{
                color: cmsColors.text,
              }}
            >
              {cmsRating}
            </span>
          </div>
        </div>
        
        {/* Facility Name and Location */}
        <div className={styles.facilityInfo}>
          <h3 className={styles.facilityName}>
            {facility.provider_name}
          </h3>
          <p className={styles.locationText}>
            {facility.city_town}, {facility.state} • {Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)} miles away
          </p>
        </div>
        
        {/* Services Tags */}
        <div className={styles.servicesContainer}>
          {services.map((service: any, serviceIndex: number) => (
            <div
              key={serviceIndex}
              className={styles.serviceTag}
              style={{
                backgroundColor: service.bgColor,
                transitionDelay: `${serviceIndex * 100}ms`,
              }}
            >
              <span
                className={styles.serviceTagText}
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
        <div className={styles.bottomSection}>
          <div className={styles.bedsInfo}>
            <img
              src="/bed.png"
              alt="Bed Icon"
              className={styles.bedIcon}
            />
            <span className={styles.bedsText}>
              {bedsAvailable} beds available
            </span>
          </div>
          
           <button
            onClick={() => handleViewDetails(facility)}
            disabled={isButtonLoading}
            className={styles.viewDetailsBtn}
          >
            {isButtonLoading ? (
              <>
                <div className={styles.loader}></div>
                <span>Loading...</span>
              </>
            ) : (
              'View Details'
            )}
          </button>
        </div>
      </div>
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/top-10`);
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
      
      
      <section className={styles.mainSection}>
        {/* Three.js Background */}
        <FloatingParticles />
        
        <div className={styles.contentWrapper}>
          <div className={styles.innerContainer}>
            <div className={styles.headerWrapper}>
              <h2 className={styles.mainTitle}>
                Featured Top-Rated{" "}
                <span className={styles.titleHighlight}>Facilities</span>
              </h2>
            </div>
            <p className={styles.description}>
              Discover exceptional nursing homes with outstanding ratings and reviews.
            </p>

            {/* Loading State */}
            {loading && (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
              </div>
            )}

            {/* Desktop Swiper Layout with Premium Buttons - No Pagination */}
            <div className={`${styles.desktopSwiper} ${styles.premiumSwiperContainer}`}>
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
                    <span className={styles.srOnly}>Previous</span>
                  </div>
                  <button
                    className={`${styles.premiumNavBtn} ${styles.premiumNavNext}`}
                    ref={navigationNextRef}
                  >
                    <span className={styles.srOnly}>Next</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Swiper Layout - With Pagination */}
            <div className={styles.mobileSwiper}>
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
                <div className={styles.mobileFallback}>
                  {facilities.map((facility, index) => (
                    <div key={facility._id} className={styles.mobileFallbackItem}>
                      <FacilityCard facility={facility} index={index} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* No facilities message */}
            {!loading && facilities.length === 0 && (
              <div className={styles.noFacilities}>
                <p className={styles.noFacilitiesText}>No facilities found.</p>
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