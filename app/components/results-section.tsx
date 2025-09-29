"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, Search } from "lucide-react"
import { useFacilities } from "../context/FacilitiesContext";

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
        <img src="/herbs-BCkTGihn.svg fill.png" alt="flower icon" className="absolute" style={{ width: '40px', height: '40px', transform: 'rotate(-7deg)', top: '-12.44px', left: '890.13px', opacity: 1 }} />

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
                <img src="/map-icon.png" alt="Map Icon" className="w-5 h-4 sm:w-[19px] sm:h-[17px]" />
                Map View
              </button> */}
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded text-sm sm:text-base ${viewMode === "map"
                    ? "bg-[#C71F37] text-white hover:bg-[#a9182c]"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <img
                  src="/map-icon.png"
                  alt="Map Icon"
                  className="w-5 h-4 sm:w-[19px] sm:h-[17px]"
                />
                Map View
              </button>
              {/* <button className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm sm:text-base">
                      <img src="/list-icon.png" alt="List Icon" className="w-5 h-4 sm:w-[19px] sm:h-[15px]" />
                      List View
                    </button> */}
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded text-sm sm:text-base ${viewMode === "list"
                    ? "bg-[#C71F37] text-white hover:bg-[#a9182c]"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <img
                  src="/list-icon.png"
                  alt="List Icon"
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
                  
                 <iframe
  src={`https://www.google.com/maps/embed/v1/search?key=${googleMapsApiKey}&q=${encodeURIComponent(
    selectedFacility
      ? `${selectedFacility?.name} ${selectedFacility?.address}`
      : `${facilities[0]?.name} ${facilities[0]?.address}`
  )}`}
  className="w-full h-full"
  loading="lazy"
></iframe>

                </div>
              </div>
            )}

            {/* Facilities List */}
            <div className={`flex flex-col gap-4 overflow-y-auto max-h-[344px] overscroll-contain p-2  transition-all duration-500 ease-in-out ${viewMode === "list" ? "flex-1 w-full" : "flex-1 lg:w-1/2"}`}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* {facilities.slice(0, 15).map((facility) => (
                <div
                  key={facility._id}
                  className="flex-1 bg-white border border-gray-300 rounded-lg shadow-sm p-4 relative flex flex-col justify-between"
                >
                  <h4 className="text-[17px] font-semibold text-black">
                    {facility.name}
                  </h4>
                  <p className="text-[15px] text-gray-700 mt-1">
                    {facility.address}, {facility.city}, {facility.state}{" "}
                    {facility.zip}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg
                        key={idx}
                        width="16.93"
                        height="15.05"
                        viewBox="0 0 24 24"
                        fill={idx < Math.round(facility.rating) ? "#C71F37" : "#ccc"}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.845L19.335 24 12 19.897 4.665 24 6 15.593 0 9.748l8.332-1.73L12 .587z" />
                      </svg>
                    ))}
                    <span className="text-[15px] text-gray-700">{facility.rating}</span>
                  </div>

                  <div className="flex gap-2 items-center mt-2"> */}
                    {/* <img
                  src={facility.photo}
                  alt={facility.name}
                  className="w-[80px] h-[60px] rounded object-cover"
                /> */}
                    {/* <div className="flex flex-col text-sm">
                      <span className="font-semibold">
                        {facility.ownership}
                      </span>
                      <span>{facility.phone}</span>
                    </div>
                  </div>
                </div>
              ))} */}
    
    {facilities.slice(0, 15).map((facility) => (
    <div
        key={facility.id}
        // 🏆 Assuming setSelectedFacility is a function in the parent component
        onClick={() => setSelectedFacility(facility)}
        className={`cursor-pointer flex-1 bg-white border border-gray-300 rounded-lg shadow-sm p-4 
                    relative flex flex-col justify-between hover:shadow-md transition`}
    >
        {/* Thumbnail */}
        {/* 🏆 Use facility.imageUrl */}
        {facility.imageUrl && (
            <img
                src={facility.imageUrl}
                alt={facility.name}
                className="w-full h-32 object-cover rounded mb-2"
            />
        )}

        <h4 className="text-[17px] font-semibold text-black">{facility.name}</h4>
        
        {/* 🏆 Use the single 'address' field from the Facility interface */}
        <p className="text-[15px] text-gray-700 mt-1">
            {facility.address}
        </p>

        {/* Stars - Using a Placeholder 'rating' value (replace with actual field like overall_rating or googleRating) */}
        <div className="flex items-center gap-1 mt-2">
            {/* Assume a property for rating exists, for this example, let's use 4.0 as a placeholder */}
            {/* You must define a 'rating' property on your Facility interface or derive it from 'overall_rating' */}
            {Array.from({ length: 5 }).map((_, idx) => (
                <svg
                    key={idx}
                    width="16.93"
                    height="15.05"
                    viewBox="0 0 24 24"
                    // 🏆 Use a rating property. Using a static value (4) as an example.
                    fill={idx < Math.round(facility.rating || 4) ? "#D02B38" : "#ccc"} 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 .587l3.668 7.431L24 9.748l-6 5.845L19.335 24 12 19.897 4.665 24 6 15.593 0 9.748l8.332-1.73L12 .587z" />
                </svg>
            ))}
            {/* 🏆 Display the rating value */}
            <span className="text-[15px] text-gray-700">{facility.rating || 'N/A'}</span>
        </div>
    </div>
))}

            </div>

            {/* <div className="flex-1 bg-[#F3F4F6] rounded p-4 flex justify-center items-center">
                  <div className="w-full h-[300px] sm:h-[344px] rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.435!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDAlNDInNDguNyJpIDc0wrAwMScyNi44Ilc!5e0!3m2!1sen!2sus!4v1694536456!5m2!1sen!2sus"
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>

                <div className="flex flex-col flex-1 gap-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex-1 bg-white border border-gray-300 rounded-lg shadow-sm p-4 relative flex flex-col justify-between">
                      <h4 className="text-[17px] font-semibold text-black">Sunrise Senior Living</h4>
                      <p className="text-[15px] text-gray-700 mt-1">123 Healthcare Drive, New York, NY</p>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <svg
                            key={idx}
                            width="16.93"
                            height="15.05"
                            viewBox="0 0 24 24"
                            fill="#C71F37"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.845L19.335 24 12 19.897 4.665 24 6 15.593 0 9.748l8.332-1.73L12 .587z"/>
                          </svg>
                        ))}
                        <span className="text-[15px] text-gray-700">4.5</span>
                      </div>
                      <div className="flex gap-2 items-center mt-2">
                        <button className="bg-[#DCFCE7] text-green-700 rounded-full px-4 py-1 text-sm">CMS 5-Star</button>
                        <p className="text-green-700 text-sm">Memory Care • Skilled Nursing</p>
                      </div>
                    </div>
                  ))}
                </div> */}

          </div>
        </div>
      </div>
    </section>

  )
}
