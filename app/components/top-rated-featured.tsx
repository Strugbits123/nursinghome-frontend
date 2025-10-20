"use client"

import React, { memo, Suspense, lazy } from "react"
import Image from "next/image";

// Lazy load Swiper components
const Swiper = lazy(() => import('swiper/react').then(module => ({ default: module.Swiper })));
const SwiperSlide = lazy(() => import('swiper/react').then(module => ({ default: module.SwiperSlide })));

// Import Swiper modules normally (not lazy loaded as they're not components)
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Lazy load Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Facility data
const facilities = [
    {
        id: 1,
        name: "Heritage Manor",
        location: "Los Angeles, CA • 2.3 miles away",
        rating: 4.9,
        reviewCount: 127,
        cmsRating: "5-Star CMS",
        cmsColor: "#DCFCE7",
        cmsTextColor: "#166534",
        image: "/cozy nursing home with warm interior, family-friendly senior care center.png",
        services: [
            { name: "Memory Care", bgColor: "#DBEAFE", textColor: "#1E40AF" },
            { name: "Skilled Nursing", bgColor: "#F3E8FF", textColor: "#6B21A8" },
            { name: "Rehabilitation", bgColor: "#FFEDD5", textColor: "#9A3412" }
        ],
        beds: 120,
        sponsored: true
    },
    {
        id: 2,
        name: "Serenity Springs",
        location: "Miami, FL • 1.8 miles away",
        rating: 4.7,
        reviewCount: 89,
        cmsRating: "5-Star CMS",
        cmsColor: "#DCFCE7",
        cmsTextColor: "#166534",
        image: "/elegant nursing home with beautiful landscaping, luxury senior care facility.png",
        services: [
            { name: "Assisted Living", bgColor: "#DBEAFE", textColor: "#1E40AF" },
            { name: "Independent Living", bgColor: "#DCFCE7", textColor: "#166534" },
            { name: "Respite Care", bgColor: "#FEF9C3", textColor: "#854D0E" }
        ],
        beds: 120,
        sponsored: false
    },
    {
        id: 3,
        name: "Comfort Care Center",
        location: "Chicago, IL • 3.1 miles away",
        rating: 4.4,
        reviewCount: 156,
        cmsRating: "4-Star CMS",
        cmsColor: "#DBEAFE",
        cmsTextColor: "#1E40AF",
        image: "/cozy nursing home with warm interior, family-friendly senior care center.png",
        services: [
            { name: "Long-term Care", bgColor: "#FEE2E2", textColor: "#991B1B" },
            { name: "Hospice Care", bgColor: "#E0E7FF", textColor: "#3730A3" },
            { name: "Palliative Care", bgColor: "#FCE7F3", textColor: "#9D174D" }
        ],
        beds: 120,
        sponsored: false
    }
]

// Facility Card Component
const FacilityCard = ({ facility }: { facility: typeof facilities[0] }) => (
   <div
  className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mx-auto 
  mb-2 w-full max-w-[384px] h-auto flex flex-col transition-all duration-300"
  style={{
    boxShadow:
      "0px 4px 6px -4px rgba(0,0,0,0.1), 0px 10px 15px -3px rgba(0,0,0,0.1)",
  }}
>
  <img
    src={facility.image}
    alt={facility.name}
    className="w-full h-[192px] sm:h-[200px] md:h-[220px] object-cover rounded-t-2xl"
  />

  {facility.sponsored && (
    <div
      className="absolute flex items-center justify-center top-4 left-4 bg-[#FEF9C3] rounded-full px-2 py-1"
      style={{ width: "117px", height: "28px" }}
    >
      <img src="/crown.png" alt="Sponsored icon" className="w-4 h-4" />
      <span className="text-sm font-medium ml-2 text-[#212121] font-inter">
        Sponsored
      </span>
    </div>
  )}

  {/* Rating Row */}
 <div className="flex flex-wrap items-center justify-between md:justify-between mt-4 px-4 gap-3 w-full">
  {/* Stars */}
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <img key={i} src="/star.png" alt="star" className="w-4 h-4" />
    ))}
      {/* Rating text */}
    <span className="text-sm text-[#707070] ml-2">
        {facility.rating} ({facility.reviewCount} reviews)
    </span>
  </div>



  {/* CMS Badge */}
  <div
    className="flex items-center justify-center rounded-full"
    style={{
      backgroundColor: facility.cmsColor,
      width: "83px",
      height: "24px",
    }}
  >
    <span
      className="text-xs font-medium text-center"
      style={{ color: facility.cmsTextColor }}
    >
      {facility.cmsRating}
    </span>
  </div>
</div>


  {/* Name + Location */}
  <div className="px-4 mt-4">
    <h3 className="font-semibold text-lg text-[#212121]">{facility.name}</h3>
    <p className="text-sm text-[#707070] mt-1">{facility.location}</p>

    {/* Services */}
    <div className="flex flex-wrap gap-2 mt-3">
      {facility.services.map((service, index) => (
        <div
          key={index}
          className="rounded-full px-2 py-1 flex items-center justify-center"
          style={{ backgroundColor: service.bgColor }}
        >
          <span
            className="text-xs font-normal whitespace-nowrap"
            style={{ color: service.textColor }}
          >
            {service.name}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Bottom Section */}
  <div className="flex items-center justify-between px-4 mt-6 mb-4">
    <div className="flex items-center gap-2">
      <img src="/bed.png" alt="Bed Icon" className="w-4 h-4" />
      <span className="text-sm text-[#707070]">
        {facility.beds} beds available
      </span>
    </div>
    <button
      className="rounded-lg bg-[#C71F37] text-white px-4 py-2 text-sm font-medium hover:bg-[#b01b31] transition-all"
    >
      View Details
    </button>
  </div>
</div>

)

const TopRatedFeatured = memo(function TopRatedFeatured() {
    return (
        <>
            <style jsx global>{`
                .facility-swiper .swiper-pagination-bullet-custom {
                    width: 12px;
                    height: 12px;
                    background-color: #E5E7EB;
                    opacity: 1;
                    margin: 0 6px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .facility-swiper .swiper-pagination-bullet-active-custom {
                    background-color: #C71F37;
                    transform: scale(1.2);
                }
                .facility-swiper .swiper-pagination {
                    bottom: -50px;
                    position: relative;
                }
                .swiper-button-prev-custom,
                .swiper-button-next-custom {
                    opacity: 1;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    user-select: none;
                }
                .swiper-button-prev-custom:hover,
                .swiper-button-next-custom:hover {
                    opacity: 0.8;
                    transform: scale(1.05);
                }
                .swiper-button-prev-custom:active,
                .swiper-button-next-custom:active {
                    transform: scale(0.95);
                }
                .swiper-button-prev-custom.swiper-button-disabled,
                .swiper-button-next-custom.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .facility-swiper .swiper-slide {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
            <section
                className="mx-auto bg-white rounded-2xl w-full max-w-[1436px] px-4 md:px-0"
                style={{ minHeight: "778px" }}
            >
            <div className="relative flex items-center justify-center">
                {/* Desktop Navigation - Left Arrow */}
                <div
                    className="hidden md:flex items-center justify-center rounded-full cursor-pointer swiper-button-prev-custom"
                    style={{
                        width: "42.7px",
                        height: "42.7px",
                        backgroundColor: "#C71F37",
                    }}
                >
                    <img
                        src="/arrow.png"
                        alt="Left Arrow"
                        style={{
                            width: "11.86px",
                            height: "20.56px",
                            transform: "rotate(360deg)",
                            color: "#FFFFFF",
                        }}
                    />
                </div>

                <div className="mx-auto rounded-xl bg-white w-full max-w-[1280px] px-4 md:px-0" style={{ minHeight: "650px" }}>
                   <div className="flex justify-center items-center relative w-full"> <h2 className="font-bold text-center leading-tight text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] font-jost text-[#212121] relative inline-block" >
                     Featured Top-Rated{" "} 
                     <span className="text-[#C71F37] relative inline-block">
                         Facilities 
                        <Image src="/herbs-BCkTGihn.svg fill.png" alt="flower icon" 
                        width={40} height={40} 
                        className="absolute -top-2.5 -right-6.5 sm:-top-1 sm:-right-7.5 md:-top-2.5 md:-right-6.5 lg:-top-2.5 lg:-right-6.5 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-90 rotate-[-7deg]" />
                         </span> 
                         </h2> 
                         </div>

                    <p
                    className="mx-auto text-center text-[14px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-[24px] sm:leading-[26px] md:leading-[28px]"
                    style={{
                        maxWidth: "640px",
                        marginTop: "12px",
                        fontFamily: "Inter",
                        fontWeight: 400,
                        color: "#707070",
                    }}
                    >
                    Discover exceptional nursing homes with outstanding ratings and reviews.
                    </p>

                    {/* Desktop Grid Layout */}
                    <div className="hidden mx-5 md:grid mt-12 grid-cols-3 gap-x-4 justify-center">
                        {facilities.map((facility) => (
                            <FacilityCard key={facility.id} facility={facility} />
                        ))}
                    </div>

                    {/* Mobile Swiper Layout */}
                    <div className="md:hidden mt-12">
                        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                loop={true}
                                navigation={{
                                    nextEl: '.swiper-button-next-custom',
                                    prevEl: '.swiper-button-prev-custom',
                                }}
                                pagination={{
                                    clickable: true,
                                    bulletClass: 'swiper-pagination-bullet-custom',
                                    bulletActiveClass: 'swiper-pagination-bullet-active-custom',
                                }}
                                className="facility-swiper"
                                style={{
                                    '--swiper-navigation-color': '#C71F37',
                                    '--swiper-pagination-color': '#C71F37',
                                } as React.CSSProperties}
                            >
                                {facilities.map((facility) => (
                                    <SwiperSlide key={facility.id}>
                                        <FacilityCard facility={facility} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Suspense>
                        
                        {/* Mobile Navigation Arrows */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <div
                                className="flex items-center justify-center rounded-full cursor-pointer swiper-button-prev-custom"
                                style={{
                                    width: "42.7px",
                                    height: "42.7px",
                                    backgroundColor: "#C71F37",
                                }}
                            >
                                <img
                                    src="/arrow.png"
                                    alt="Previous Arrow"
                                    style={{
                                        width: "11.86px",
                                        height: "20.56px",
                                        transform: "rotate(360deg)",
                                        color: "#FFFFFF",
                                    }}
                                />
                            </div>
                            <div
                                className="flex items-center justify-center rounded-full cursor-pointer swiper-button-next-custom"
                                style={{
                                    width: "42.7px",
                                    height: "42.7px",
                                    backgroundColor: "#C71F37",
                                }}
                            >
                                <img
                                    src="/arrow.png"
                                    alt="Next Arrow"
                                    style={{
                                        width: "11.86px",
                                        height: "20.56px",
                                        transform: "rotate(180deg)",
                                        color: "#FFFFFF",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        className="relative mx-auto flex items-center justify-center w-full max-w-[326px]"
                        style={{
                            height: "52px",
                            borderRadius: "8px",
                            backgroundColor: "#C71F37",
                            boxShadow: "0px 2px 4px -2px rgba(0,0,0,0.1), 0px 4px 6px -1px rgba(0,0,0,0.1)",
                            marginTop: "40px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "Inter",
                                fontWeight: 600,
                                fontSize: "18px",
                                lineHeight: "28px",
                                color: "#FFFFFF",
                                textAlign: "center",
                            }}
                        >
                            View All Featured Facilities
                        </span>

                        <img
                            src="/icons/arrow_btn.png"
                            alt="Arrow Icon"
                            style={{
                                width: "15.74px",
                                height: "15.74px",
                                position: "absolute",
                                right: "20px",
                            }}
                        />
                    </button>

                </div>
                
                {/* Desktop Navigation - Right Arrow */}
                <div
                    className="hidden md:flex items-center justify-center rounded-full cursor-pointer swiper-button-next-custom"
                    style={{
                        width: "42.7px",
                        height: "42.7px",
                        backgroundColor: "#C71F37",
                    }}
                >
                    <img
                        src="/arrow.png"
                        alt="Right Arrow"
                        style={{
                            width: "11.86px",
                            height: "20.56px",
                            transform: "rotate(180deg)",
                            color: "#FFFFFF",
                        }}
                    />
                </div>
            </div>
        </section>
        </>
    )
});

export { TopRatedFeatured };
export default TopRatedFeatured;
