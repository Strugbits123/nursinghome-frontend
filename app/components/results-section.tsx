"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, Search } from "lucide-react"
import { useFacilities } from "../context/FacilitiesContext";
import Image from "next/image";
import StarIcon from '../../public/icons/stars_rating.svg';

import EmptyStarIcon from '../../public/icons/empty_stars.svg';

interface Facility {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  rating: number;
  lat?: number | null;
  lng?: number | null;
  photo?: string | null;
  aiSummary?: {
    summary: string;
    pros: string[];
    cons: string[];
  };
}
const nursingHomes = [
  {
    id: 1,
    name: "Sunrise Senior Living",
    address: "123 Healthcare Drive, New York, NY",
    rating: 4.8,
    cmsRating: "5-Star CMS",
    services: ["Memory Care", "Skilled Nursing"],
  },
  {
    id: 2,
    name: "Golden Years Care Center",
    address: "456 Wellness Avenue, New York, NY",
    rating: 4.2,
    cmsRating: "4-Star CMS",
    services: ["Assisted Living", "Rehabilitation"],
  },
  {
    id: 3,
    name: "Peaceful Gardens Nursing Home",
    address: "789 Serenity Lane, New York, NY",
    rating: 4.6,
    cmsRating: "5-Star CMS",
    services: ["Long-term Care", "Hospice"],
  },
]

export function ResultsSection() {

  const { facilities, setFacilities, coords, setCoords, locationName, setLocationName } = useFacilities();
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  const centerLat = facilities[0]?.lat ?? 34.8028;
  const centerLng = facilities[0]?.lng ?? -86.9775;
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  return (
    <section className=" w-full min-h-[907px] bg-[#F9F9F9] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-[1450px] flex flex-col items-center justify-start text-center space-y-8">
        <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-bold inline-block">
          See <span className="text-[#C71F37]">Results</span> Your Way
          <span className="absolute inset-0 -z-10 bg-[#C71F37]/10 rounded" />
        </h2>
        <Image src="/herbs-BCkTGihn.svg fill.png" alt="flower icon" className="absolute"
          width={40}
          height={40}
          style={{ transform: 'rotate(-7deg)', top: '-12.44px', left: '890.13px', opacity: 1 }} />

        <p className="max-w-xl text-gray-700 text-base sm:text-lg">
          Switch between map and list views to find the perfect nursing home location.
        </p>

        <div className="w-full bg-white rounded-xl border border-gray-300 shadow-sm p-4 md:p-6 flex flex-col space-y-4">
          <div className="w-full border-b border-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-2 sm:px-6 py-2 sm:py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-lg font-semibold">Results in New York, NY</p>
              <span className="px-3 py-1 bg-[#C71F37] text-white text-sm rounded-full">
                15 facilities found
              </span>
            </div>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {/* <button className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-[#C71F37] text-white rounded hover:bg-[#a9182c] text-sm sm:text-base">
                <Image src="/map-icon.png" alt="Map Icon" className="w-5 h-4 sm:w-[19px] sm:h-[17px]" />
                Map View
              </button> */}
              <button
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded text-sm sm:text-base ${viewMode === "map"
                  ? "bg-[#C71F37] text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
              >
                <Image
                  src="/map-icon.png"
                  alt="Map Icon"
                  width={19}
                  height={17}
                  className="w-5 h-4 sm:w-[19px] sm:h-[17px]"
                />
                Map View
              </button>
              {/* <button className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm sm:text-base">
                      <Image src="/list-icon.png" alt="List Icon" className="w-5 h-4 sm:w-[19px] sm:h-[15px]" />
                      List View
                    </button> */}
              <button
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded text-sm sm:text-base ${viewMode === "list"
                  ? "bg-[#C71F37] text-white "
                  : "bg-gray-200 text-gray-700 "
                  }`}
              >
                <Image
                  src="/list-icon.png"
                  alt="List Icon"
                  width={19}
                  height={15}
                  className="w-5 h-4 sm:w-[19px] sm:h-[15px]"
                />
                List View
              </button>
            </div>
          </div>

          {/* Map + List */}
          <div className={`flex flex-col lg:flex-row gap-4 lg:gap-6 mt-2`}>
            {/* Map: only show in Map View */}
            {viewMode === "map" && (
              <div
                className={`flex-1 bg-[#F3F4F6] rounded p-4 flex justify-center items-center
                transition-all duration-500 ease-in-out
                ${viewMode === "map" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}
              `}
              >
                <div className="w-full h-[300px] sm:h-[344px] rounded-lg overflow-hidden">


                </div>
              </div>
            )}

            {/* Facilities List */}
            <div className="flex flex-col gap-4  max-h-[400px]  p-2  transition-all duration-500 ease-in-out">
              <div
                className="bg-white rounded-[12.9px] border border-[#E5E7EB] flex flex-col justify-between px-4 py-4"
                style={{
                  width: '601.0418px',
                  height: '126.8746px',
                  opacity: 1,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col  items-start">
                    <h4 className="font-inter font-semibold text-[17.2px] leading-[25.81px] text-[#212121]">
                      Sunrise Senior Living
                    </h4>

                    <p className="font-inter font-normal text-[15.05px] leading-[21.5px] text-[#707070] mt-1">
                      123 Healthcare Drive, New York, NY
                    </p>
                  </div>

                  {/* Right: Stars + Rating */}
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-red-600" />
                    ))}
                    <span className="ml-3 font-inter font-normal text-[15.05px] leading-[21.5px] text-[#707070]">
                      4.8
                    </span>
                  </div>
                </div>


                {/* Second Row: Button + Gap Text */}
                <div className="flex items-center mt-2 gap-4">
                  {/* Button */}
                  <button className="bg-[#DCFCE7] text-[#166534] font-inter font-normal text-[15.05px] leading-[21.5px] rounded-full px-3 py-[2px] w-[100.33px] h-[30.11px]">
                    5-Star CMS
                  </button>

                  {/* Gap Text */}
                  <div className="flex items-center gap-2 text-[15.05px] font-inter font-normal leading-[21.5px] text-[#707070]">
                    <span>Memory Care</span>
                    <span>•</span>
                    <span>Skilled Nursing</span>
                  </div>
                </div>
              </div>





              {/* Second Div */}
              <div
                className="bg-white rounded-[12.9px] border border-[#E5E7EB] flex flex-col justify-between px-4 py-4"
                style={{
                  width: '601.0418px',
                  height: '126.8746px',
                  opacity: 1,
                }}
              >
                {/* First Row: Heading + Subheading + Stars */}
                <div className="flex justify-between items-start">
                  {/* Left: Heading + Subheading */}
                  <div className="flex flex-col  items-start">
                    <h4 className="font-inter font-semibold text-[17.2px] leading-[25.81px] text-[#212121]">
                      Golden Years Care Center
                    </h4>

                    <p className="font-inter font-normal text-[15.05px] leading-[21.5px] text-[#707070] mt-1">
                      456 Wellness Avenue, New York, NY
                    </p>
                  </div>

                  <div className="flex items-center mt-1">
                   {Array.from({ length: 5 }).map((_, i) =>
                      i < 4 ? (
                        <StarIcon key={i} className="w-4 h-4 text-red-600" />
                      ) : (
                        <EmptyStarIcon key={i} className="w-4 h-4 text-red-600" />
                      )
                    )}
                    <span className="ml-3 font-inter font-normal text-[15.05px] leading-[21.5px] text-[#707070]">
                      4.2
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-2 gap-4">
                  <button className="bg-[#DBEAFE] text-[#C71F37] font-inter font-normal text-[15.05px] leading-[21.5px] rounded-full px-3 py-[2px] w-[100.33px] h-[30.11px]">
                    4-Star CMS
                  </button>

                  <div className="flex items-center gap-2 text-[15.05px] font-inter font-normal leading-[21.5px] text-[#707070]">
                    <span>Assisted Living</span>
                    <span>•</span>
                    <span>Rehabilitation</span>
                  </div>
                </div>
              </div>


              {/* Third Div */}
               <div
                className="bg-white rounded-[12.9px] border border-[#E5E7EB] flex flex-col justify-between px-4 py-4"
                style={{
                  width: '601.0418px',
                  height: '126.8746px',
                  opacity: 1,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col  items-start">
                    <h4 className="font-inter font-semibold text-[17.2px] leading-[25.81px] text-[#212121]">
                      Peaceful Gardens Nursing Home
                    </h4>

                    <p className="font-inter font-normal text-[15.05px] leading-[21.5px] text-[#707070] mt-1">
                     789 Serenity Lane, New York, NY
                    </p>
                  </div>

                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-red-600" />
                    ))}
                    <span className="ml-3 font-inter font-normal text-[15.05px] leading-[21.5px] text-[#707070]">
                      4.6
                    </span>
                  </div>
                </div>

                <div className="flex items-center mt-2 gap-4">
                  <button className="bg-[#DCFCE7] text-[#166534] font-inter font-normal text-[15.05px] leading-[21.5px] rounded-full px-3 py-[2px] w-[100.33px] h-[30.11px]">
                    5-Star CMS
                  </button>

                  <div className="flex items-center gap-2 text-[15.05px] font-inter font-normal leading-[21.5px] text-[#707070]">
                    <span>Long-term Care</span>
                    <span>•</span>
                    <span>Hospice</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

  )
}
