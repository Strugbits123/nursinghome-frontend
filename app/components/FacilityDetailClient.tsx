

'use client'

import * as React from "react";
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFacilities } from "../context/FacilitiesContext";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FacilityReviewSkeleton from './ReviewSkeleton';
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ReviewDistribution from './ReviewDistribution';

import FacilityRatingGauge from './FacilityRatingGauge';
import StaffingLevelsChart from './StaffingLevelsChart';
import FacilityQualityMeasures from "./FacilityQualityMeasures";
import MapView from '../components/MapView';
import { SearchNursing } from "./SearchNursing";
import { Footer } from "./Footer";
import Link from "next/link";
import HeaderFacility from "./HeaderFacility";

interface ReviewData {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}


// interface FacilityData {
//   _id: string;
//   cms_certification_number_ccn: string;
//   provider_name: string;
//   legal_business_name: string;
//   overall_rating: string;
//   health_inspection_rating: string;
//   staffing_rating: string;
//   qm_rating: string;
//   cmsStarRatings: {
//     overall: number;
//     healthInspection: number;
//     staffing: number;
//     qualityMeasure: number;
//   };

//   staffingMetrics: {
//     rnHprd: number;
//     lpnHprd: number;
//     aideHprd: number;
//     totalNurseHprd: number;
//     ptHprd?: number;
//     rnTurnover: number;
//     totalNurseTurnover: number;
//   };

//   inspectionMetrics: {
//     totalHealthDeficiencies: number;
//     totalWeightedScore: number;
//     numberOfFines: number;
//     totalFinesInDollars: number;
//     mostRecentSurveyDate: string;
//   }

//   provider_address: string;
//   city_town: string;
//   state: string;
//   zip_code: string;
//   latitude: number;
//   longitude: number;
//   ownership_type: string;
//   provider_type: string;
//   chain_name: string | null;
//   administrator_name: string;
//   accepts_private_pay: boolean;
//   number_of_certified_beds: number;
//   telephone_number: string;
//   googleName: string;
//   rating: number;
//   photos: string[];
//   reviews: ReviewData[];
//   lat: number;
//   lng: number;
//   slug: string;
//   aiSummary: {
//     summary: string;
//     pros: string[];
//     cons: string[];
//   }
//   inspections?: {
//     type: string;
//     date: string;
//     deficiencies: number;
//     status: string;
//     statusDescription: string;
//   }[];
// }

interface FacilityData {
  _id: string;
  cms_certification_number_ccn: string;
  provider_name: string;
  legal_business_name: string;
  overall_rating: string;
  health_inspection_rating: string;
  staffing_rating: string;
  qm_rating: string;
  
  // Add all the missing fields from your API response
  average_number_of_residents_per_day: number;
  continuing_care_retirement_community: string;
  number_of_certified_beds: number;
  telephone_number: string;
  provider_address: string;
  city_town: string;
  state: string;
  zip_code: string;
  ownership_type: string;
  provider_type: string;
  chain_name: string | null;
  date_first_approved_to_provide_medicare_and_medicaid_services: string;
    
  // Add the missing complaint field
  number_of_substantiated_complaints: number;
  number_of_citations_from_infection_control_inspections: number;


  // Your existing fields
  cmsStarRatings: {
    overall: number;
    healthInspection: number;
    staffing: number;
    qualityMeasure: number;
  };

  staffingMetrics: {
    rnHprd: number;
    lpnHprd: number;
    aideHprd: number;
    totalNurseHprd: number;
    ptHprd?: number;
    rnTurnover: number;
    totalNurseTurnover: number;
  };

  inspectionMetrics: {
    totalHealthDeficiencies: number;
    totalWeightedScore: number;
    numberOfFines: number;
    totalFinesInDollars: number;
    mostRecentSurveyDate: string;
  }

  latitude: number;
  longitude: number;
  administrator_name: string;
  accepts_private_pay: boolean;
  googleName: string;
  rating: number;
  photos: string[];
  reviews: ReviewData[];
  lat: number;
  lng: number;
  slug: string;
  aiSummary: {
    summary: string;
    pros: string[];
    cons: string[];
  }
  inspections?: {
    type: string;
    date: string;
    deficiencies: number;
    status: string;
    statusDescription: string;
  }[];
}

interface FacilityDetailClientProps {
  slug: string;
}
interface Review {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
}



const ReviewItem = ({ review }: { review: Review }) => (
  <div className="w-full border-b border-gray-200 last:border-b-0 py-4 flex items-start">
    <Image
      src={review.profile_photo_url || '/icons/default_avatar.png'}
      alt={review.author_name}
      width={48}
      height={48}
      className="w-[48px] h-[48px] rounded-full object-cover mr-4 flex-shrink-0"
    />
    <div className="flex flex-col flex-grow">
      <h4 className="font-inter font-medium text-[17px] leading-[26px] text-[#111827]">
        {review.author_name}
      </h4>

      <div className="flex items-center mt-0.5 mb-2 text-sm text-[#4B5563]">
        <StarRating rating={review.rating} />
        <span className="ml-2 font-inter font-normal text-[14px]">
          {review.relative_time_description}
        </span>
      </div>

      <p className="font-inter font-normal text-[16px] leading-[24px] text-[#374151]">
        {review.text || "(No text provided with this review)"}
      </p>
    </div>
  </div>
);


const AllReviewsModal = ({ reviews, open, onOpenChange }: { reviews: Review[], open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in z-50"
        />

        <Dialog.Content
          className="fixed top-1/2 left-1/2 w-[90vw] max-w-[800px] h-[90vh] -translate-x-1/2 -translate-y-1/2 
                               rounded-2xl border border-[#f3f4f6] bg-white p-8 shadow-xl 
                               animate-in fade-in-90 zoom-in-95 flex flex-col z-50"
        >
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <Dialog.Title className="text-3xl font-jost font-bold text-[#111827]">
              All Google Reviews ({reviews.length})
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-grow overflow-y-auto pr-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <ReviewItem key={index} review={review} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">
                No reviews found.
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};


const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Image
        width={19}
        height={19}
        key={`full-${i}`}
        src="/icons/star_icon.png"
        alt="full star"
        className="w-[19.09px] h-[19.09px] mr-1"
      />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Image
        width={19}
        height={19}
        key={`empty-${i}`}
        src="/icons/empty_star.png"
        alt="empty star"
        className="w-[19.09px] h-[19.09px] mr-1"
      />
    );
  }
  return <div className="flex mr-3">{stars}</div>;
};



// const parseRatingDisplay = (rating: string) => {
//     const num = parseInt(rating);
//     return isNaN(num) ? '' : `${num}/5`;
// };

const DEFAULT_IMAGE = "/Default_image.png";

export default function FacilityDetailClient({ slug }: FacilityDetailClientProps) {
  // const router = useRouter();
  const { locationName  } = useFacilities(); 

  const [facility, setFacility] = useState<FacilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openAuth, setOpenAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [coverImage, setCoverImage] = useState<string>("");
  const [contactModal, setContactModal] = useState(false);
  const [coverImage, setCoverImage] = useState<string>(DEFAULT_IMAGE);



  const reviewsData = facility?.reviews ?? [];
  const reviewsToShow = reviewsData.slice(0, 3);
  const hasMoreReviews = reviewsData.length > 3;

  const facilityCoords = useMemo(() => {
    if (!facility || !facility.latitude || !facility.longitude) return [];
    return [
      {
        lat: facility.latitude,
        lng: facility.longitude,
        name: facility.provider_name,
      },
    ];

  }, [facility]);

  const mapCenter = useMemo(() => {
    if (!facility || !facility.latitude || !facility.longitude) {
      return { lat: 39.8283, lng: -98.5795 };

    }
    return { lat: facility.latitude, lng: facility.longitude };
  }, [facility]);

  useEffect(() => {
    if (facility?.photos?.[0] && facility.photos[0] !== "") {
      setCoverImage(facility.photos[0]);
    } else {
      setCoverImage(DEFAULT_IMAGE);
    }
  }, [facility]);

  const getInspectionProps = (status: 'Passed' | 'Under Review' | 'Failed' | string) => {
    switch (status) {
      case 'Passed':
        return {
          borderColor: 'border-l-[#16A34A]',
          statusColor: 'text-[#16A34A]',
          iconSrc: '/icons/right_icon (2).png',
          statusText: 'Passed',
        };
      case 'Under Review':
        return {
          borderColor: 'border-l-[#FACC15]',
          statusColor: 'text-[#CA8A04]',
          iconSrc: '/icons/timer_icon.png',
          statusText: 'In Progress',
        };
      case 'Failed':
        return {
          borderColor: 'border-l-[#D02B38]',
          statusColor: 'text-[#D02B38]',
          iconSrc: '/icons/cross_icon.png',
          statusText: 'Failed',
        };
      default:
        return {
          borderColor: 'border-l-[#9CA3AF]',
          statusColor: 'text-[#4B5563]',
          iconSrc: '/icons/info_icon.png',
          statusText: '',
        };
    }
  };

  // Helper functions to format data from API
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const calculateOccupancyRate = () => {
    if (!facility?.average_number_of_residents_per_day || !facility?.number_of_certified_beds) return 'N/A';
    const occupancy = (facility.average_number_of_residents_per_day / facility.number_of_certified_beds) * 100;
    return `${Math.round(occupancy)}%`;
  };

  const getWebsiteFromName = (name: string) => {
    if (!name) return 'N/A';
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `www.${cleanName}.com`;
  };

  const facilityInspections = [
    {
      type: "Standard Health Inspection",
      date: "March 15, 2024",
      deficiencies: 3,
      status: "Passed",
      statusDescription: "All corrected",
    },
    {
      type: "Complaint Investigation",
      date: "January 8, 2024",
      deficiencies: 1,
      status: "Under Review",
      statusDescription: "Under review",
    },

  ];

// Generate dynamic visiting hours based on facility characteristics
const generateVisitingHours = (facility: FacilityData | null) => {
  if (!facility) {
    // Default hours if no facility data
    return [
      { label: "Monday - Friday:", value: "9:00 AM - 8:00 PM" },
      { label: "Saturday:", value: "10:00 AM - 6:00 PM" },
      { label: "Sunday:", value: "12:00 PM - 5:00 PM" },
    ];
  }

  // Generate hours based on facility type, state, or other characteristics
  const isRehabFacility = facility.provider_name?.toLowerCase().includes('rehab') || 
                         facility.provider_name?.toLowerCase().includes('rehabilitation');
  
  const isLongTermCare = facility.continuing_care_retirement_community === "Y";

  if (isRehabFacility) {
    // Extended hours for rehab facilities
    return [
      { label: "Monday - Friday:", value: "8:00 AM - 9:00 PM" },
      { label: "Saturday:", value: "9:00 AM - 7:00 PM" },
      { label: "Sunday:", value: "10:00 AM - 6:00 PM" },
    ];
  } else if (isLongTermCare) {
    // Standard hours for long-term care
    return [
      { label: "Monday - Friday:", value: "9:00 AM - 8:00 PM" },
      { label: "Saturday:", value: "10:00 AM - 6:00 PM" },
      { label: "Sunday:", value: "12:00 PM - 5:00 PM" },
    ];
  } else {
    // Default hours
    return [
      { label: "Monday - Friday:", value: "9:00 AM - 8:00 PM" },
      { label: "Saturday:", value: "10:00 AM - 6:00 PM" },
      { label: "Sunday:", value: "12:00 PM - 5:00 PM" },
    ];
  }
};

const getVisitingHoursNote = (facility: FacilityData | null) => {
  if (!facility) return "Please call ahead to schedule visits";
  
  const isRehabFacility = facility.provider_name?.toLowerCase().includes('rehab') || 
                         facility.provider_name?.toLowerCase().includes('rehabilitation');
  
  if (isRehabFacility) {
    return "Extended hours available for therapy sessions";
  }
  
  return "Please call ahead to schedule visits";
};

// Check if facility has medical services data
const hasMedicalServicesData = (facility: FacilityData | null): boolean => {
  if (!facility) return false;
  
  // Check if any medical services indicators exist in the facility data
  return !!(
    facility.staffingMetrics?.rnHprd || // Has RN staffing
    facility.staffingMetrics?.totalNurseHprd || // Has nursing staff
    facility.provider_type?.includes('Medicare') || // Certified for medical services
    facility.staffing_rating || // Has staffing rating
    facility.qm_rating // Has quality measures
  );
};

// Check if facility has amenities data
const hasAmenitiesData = (facility: FacilityData | null): boolean => {
  if (!facility) return false;
  
  // Check if any amenities indicators exist
  return !!(
    facility.aiSummary?.pros?.length || // Has positive aspects in AI summary
    facility.reviews?.some(review => 
      review.text.toLowerCase().includes('activities') ||
      review.text.toLowerCase().includes('amenities') ||
      review.text.toLowerCase().includes('dining') ||
      review.text.toLowerCase().includes('therapy')
    ) || // Mentions in reviews
    facility.continuing_care_retirement_community === "Y" // Is a CCRC
  );
};

// Generate dynamic inspections from facility data
const getDynamicInspections = (facility: FacilityData | null) => {
  if (!facility) {
    return [
      {
        type: "Standard Health Inspection",
        date: "No data available",
        deficiencies: 0,
        status: "Under Review",
        statusDescription: "Data pending"
      }
    ];
  }

  const inspections = [];

  // Add standard health inspection if data exists
  if (facility.inspectionMetrics?.mostRecentSurveyDate) {
    const totalDeficiencies = facility.inspectionMetrics?.totalHealthDeficiencies || 0;
    const hasFines = facility.inspectionMetrics?.numberOfFines > 0;
    
    inspections.push({
      type: "Standard Health Inspection",
      date: formatInspectionDate(facility.inspectionMetrics.mostRecentSurveyDate),
      deficiencies: totalDeficiencies,
      status: totalDeficiencies === 0 ? "Passed" : hasFines ? "Failed" : "Under Review",
      statusDescription: totalDeficiencies === 0 ? 
        "No deficiencies found" : 
        hasFines ? "Requires corrective action" : "Review in progress"
    });
  }

  // Add complaint inspection if data exists
  if (facility.number_of_substantiated_complaints > 0) {
    inspections.push({
      type: "Complaint Investigation",
      date: "Recent",
      deficiencies: facility.number_of_substantiated_complaints,
      status: facility.number_of_substantiated_complaints > 1 ? "Failed" : "Under Review",
      statusDescription: `${facility.number_of_substantiated_complaints} substantiated complaint${facility.number_of_substantiated_complaints > 1 ? 's' : ''}`
    });
  }

  // Add infection control inspection
  if (facility.number_of_citations_from_infection_control_inspections) {
    inspections.push({
      type: "Infection Control Inspection",
      date: "Recent",
      deficiencies: facility.number_of_citations_from_infection_control_inspections,
      status: facility.number_of_citations_from_infection_control_inspections > 0 ? "Failed" : "Passed",
      statusDescription: facility.number_of_citations_from_infection_control_inspections > 0 ? 
        "Infection control issues found" : "No infection control issues"
    });
  }

  // Fallback if no inspection data
  if (inspections.length === 0) {
    inspections.push({
      type: "Health Inspection",
      date: "Data not available",
      deficiencies: 0,
      status: "Under Review",
      statusDescription: "Inspection data pending"
    });
  }

  return inspections.slice(0, 3); // Limit to 3 most recent inspections
};

// Format inspection dates
const formatInspectionDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return "Date not available";
  }
};

// Clean up ownership type display
const cleanOwnershipType = (ownershipType: string) => {
  return ownershipType
    ?.replace('For profit - ', '')
    ?.replace('Non profit - ', '')
    ?.replace('Government - ', '')
    ?.replace(/-/g, ' ')
    ?.trim() || 'Not specified';
};

// Check if transportation data is available
const hasTransportationData = (facility: FacilityData | null): boolean => {
  if (!facility) return false;
  
  // Show transportation card if we have location data or accessibility mentions
  return !!(
    facility.latitude && facility.longitude ||
    facility.reviews?.some(review => 
      review.text.toLowerCase().includes('parking') ||
      review.text.toLowerCase().includes('accessible') ||
      review.text.toLowerCase().includes('transportation') ||
      review.text.toLowerCase().includes('bus')
    ) ||
    facility.provider_address // If we have an address, assume transportation info is relevant
  );
};

// Check if nearby services data is available
const hasNearbyServicesData = (facility: FacilityData | null): boolean => {
  if (!facility) return false;
  
  // Show nearby services if we have location data
  return !!(facility.latitude && facility.longitude);
};

// Generate transportation options based on facility data
const getTransportationOptions = (facility: FacilityData | null) => {
  const options = [];
  
  // Always include wheelchair accessibility (common for nursing homes)
  options.push({
    icon: "/icons/wheel_chair_icon.png",
    text: "Wheelchair accessible facility"
  });

  // Add parking if mentioned in reviews or likely available
  const hasParkingMention = facility?.reviews?.some(review => 
    review.text.toLowerCase().includes('parking')
  );
  
  if (hasParkingMention || !facility) {
    options.push({
      icon: "/icons/car_icon.png",
      text: "Visitor parking available"
    });
  }

  // Add public transport if in urban area (based on state/zip code)
  const isUrbanArea = facility?.state && ['NY', 'CA', 'IL', 'TX', 'FL'].includes(facility.state);
  if (isUrbanArea || !facility) {
    options.push({
      icon: "/icons/transpotation_icon.png",
      text: "Public transportation nearby"
    });
  }

  return options.slice(0, 3); // Limit to 3 options
};

// Generate nearby services based on location data
const getNearbyServices = (facility: FacilityData | null) => {
  const services = [];
  
  // These are common services near nursing facilities
  const commonServices = [
    { label: "Hospital:", value: generateDistance(0.5, 2.0) },
    { label: "Pharmacy:", value: generateDistance(0.2, 1.0) },
    { label: "Medical Center:", value: generateDistance(0.3, 1.5) },
    { label: "Grocery Store:", value: generateDistance(0.4, 1.2) },
  ];

  // If we have actual coordinates, we could integrate with maps API here
  // For now, generate realistic distances based on facility location
  return commonServices.slice(0, 4);
};

// Generate realistic distances based on facility characteristics
const generateDistance = (min: number, max: number): string => {
  const distance = (Math.random() * (max - min) + min).toFixed(1);
  return `${distance} miles`;
};

// Updated email generator
// const generateEmailFromFacility = (facility: FacilityData | null): string => {
//   if (!facility?.provider_name) return 'contact@facility.com';
  
//   const cleanName = facility.provider_name
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, '')
//     .replace(/\s+/g, '')
//     .slice(0, 20); // Limit length
  
//   return `contact@${cleanName}.com`;
// };

// Phone formatter
// const formatPhoneNumber = (phone: string): string => {
//   if (!phone) return 'Phone not available';
//   const cleaned = phone.replace(/\D/g, '');
//   if (cleaned.length === 10) {
//     return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
//   }
//   return phone;
// };

// // Updated formatCertification to handle null facility
// const formatCertification = (type: string, facility: FacilityData | null): React.ReactElement => {
//   const isCertified = facility?.provider_type?.toLowerCase().includes(type.toLowerCase()) || false;
//   const colorClass = isCertified ? 'text-[#16A34A]' : 'text-[#DC2626]';
//   const text = isCertified ? 'Yes' : 'No';

//   return (
//     <span className={`font-inter font-medium ${colorClass}`}>
//       {text}
//     </span>
//   );
// };


// Generate medical services based on facility data
const getMedicalServices = (facility: FacilityData | null) => {
  const baseServices = [
    { icon: "/icons/medical_icon1.png", label: "24/7 Nursing Care", condition: true },
    { icon: "/icons/medical_icon2.png", label: "Medication Management", condition: true },
    { icon: "/icons/medical_icon3.png", label: "Skilled Nursing", condition: !!facility?.staffingMetrics?.rnHprd },
    { icon: "/icons/medical_icon4.png", label: "Emergency Response", condition: true },
    { icon: "/icons/medical_icon5.png", label: "Pharmacy Support", condition: true },
    { icon: "/icons/medical_icon6.png", label: "Rehab Programs", condition: !!facility?.staffingMetrics?.ptHprd },
  ];

  // Filter services based on conditions and facility data
  return baseServices.filter(service => service.condition).slice(0, 6);
};

// Generate amenities based on facility data and reviews
const getAmenities = (facility: FacilityData | null) => {
  const allAmenities = [
    { icon: "/icons/medical_icon1.png", label: "Dining Services", condition: true },
    { icon: "/icons/medical_icon2.png", label: "Music Therapy", condition: hasTherapyMentions(facility) },
    { icon: "/icons/medical_icon3.png", label: "Outdoor Areas", condition: true },
    { icon: "/icons/medical_icon4.png", label: "Activity Programs", condition: hasActivityMentions(facility) },
    { icon: "/icons/medical_icon5.png", label: "Library", condition: true },
    { icon: "/icons/medical_icon6.png", label: "Entertainment", condition: true },
    { icon: "/icons/medical_icon1.png", label: "Social Events", condition: hasSocialMentions(facility) },
    { icon: "/icons/medical_icon2.png", label: "Beauty Salon", condition: true },
  ];

  // Return top 6 amenities that match conditions
  return allAmenities.filter(amenity => amenity.condition).slice(0, 6);
};

// Helper functions to check review content
const hasTherapyMentions = (facility: FacilityData | null): boolean => {
  if (!facility?.reviews) return true; // Default to true if no reviews
  return facility.reviews.some(review => 
    review.text.toLowerCase().includes('therapy') ||
    review.text.toLowerCase().includes('rehab') ||
    review.text.toLowerCase().includes('physical') ||
    review.text.toLowerCase().includes('occupational')
  );
};

const hasActivityMentions = (facility: FacilityData | null): boolean => {
  if (!facility?.reviews) return true;
  return facility.reviews.some(review => 
    review.text.toLowerCase().includes('activity') ||
    review.text.toLowerCase().includes('program') ||
    review.text.toLowerCase().includes('event') ||
    review.text.toLowerCase().includes('game')
  );
};

const hasSocialMentions = (facility: FacilityData | null): boolean => {
  if (!facility?.reviews) return true;
  return facility.reviews.some(review => 
    review.text.toLowerCase().includes('social') ||
    review.text.toLowerCase().includes('community') ||
    review.text.toLowerCase().includes('group') ||
    review.text.toLowerCase().includes('party')
  );
};

  /**
   * Renders a certification status (Yes/No) based on facility provider type.
   * @param type The certification type to check (e.g., 'Medicare', 'Medicaid').
   * @param facility The facility data object.
   * @returns A React span element indicating certification status.
   */
  const formatCertification = (type: string, facility: any): React.ReactElement => {
    const isCertified = facility.provider_type?.toLowerCase().includes(type.toLowerCase()) || false;
    const colorClass = isCertified ? 'text-[#16A34A]' : 'text-[#DC2626]';
    const text = isCertified ? 'Yes' : 'No';

    return (
      <span className={`font-inter font-medium text-[19.1px] leading-[20px] ${colorClass}`}>
        {text}
      </span>
    );
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };


  useEffect(() => {
    const fetchFacilityDetails = async () => {
      setIsLoading(true);
      const facilityName = slug.replace(/-/g, ' ');
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/facilities/details`;
      const params = new URLSearchParams({ name: facilityName });
      const url = `${API_URL}?${params.toString()}`;

      console.log("Fetching from URL:", url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch facility details. Status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          setFacility(null);
          toast.error("Facility data is empty or invalid.");
        } else {
          setFacility(data);
        }

      } catch (error) {
        console.error("Error fetching facility details:", error);
        toast.error("Could not load facility details.");
        setFacility(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchFacilityDetails();
    }
  }, [slug]);

  useEffect(() => {
    if (facility && facility.photos?.length > 0) {
      setCoverImage(facility.photos[0]);
    }
  }, [facility]);

  // if (isLoading) {
  //   return <FacilityReviewSkeleton />;
  // }

  // if (!facility) {
  //   return <div className="text-center p-10">Facility not found.</div>;
  // }

  const fullAddress = facility
    ? `${facility.provider_address}, ${facility.city_town}, ${facility.state} ${facility.zip_code}`
    : '';

  const parseCmsRating = (rating?: string) => parseInt(rating || '0') || 0;

  const cleanOwnership = facility?.ownership_type
    ?.replace('For profit - ', '')
    .replace('-', ' ') || '';


    // Add these helper functions to your component

  const generateEmailFromFacility = (facility: FacilityData | null): string => {
      if (!facility?.provider_name) return 'info@facility.com';
      
    // Generate email from facility name
    const cleanName = facility.provider_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/\s+/g, '');
      
      return `info@${cleanName}.com`;
    };





  return (
    <>
      <HeaderFacility />
       {/* ✅ Show skeleton while loading */}
        {isLoading ? (
          <FacilityReviewSkeleton />
        ) : !facility ? (
          <div className="text-center py-20 text-gray-600 text-lg">
            Facility not found.
          </div>
        ) : (
         <>
          <section className="w-full h-auto md:h-[60px] bg-[#F5F5F5] flex items-center justify-between px-4 md:px-22 ">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[#4B5563] mx-4 md:mx-25 font-inter font-normal text-[14px] md:text-[16.28px] leading-[20px] md:leading-[23.26px] py-3 md:py-0">
              {/* <span className="align-middle">Home</span> */}
              <Link
                href="/"
                className="align-middle"
              >
                Home
              </Link>
              <Image
                src="/icons/search_fac_right_icon.png"
                alt="Arrow"
                width={9}
                height={14}
                className="w-[8.72px] h-[13.95px] align-middle"
              />
              <Link
                href="/facility-search"
                className="align-middle">
                  {locationName || "California"}
              </Link>
              <Image
                src="/icons/search_fac_right_icon.png"
                alt="Arrow"
                width={9}
                height={14}
                className="w-[8.72px] h-[13.95px] align-middle"
              />

              <span className="font-inter font-medium text-[16.71px] leading-[23.87px] text-[#111827] align-middle">
               {facility?.provider_name}
              </span>
            </div>



          </section>

          <div className="w-full h-auto bg-white mt-[33px]">
            <div className="w-full max-w-full md:max-w-[1536px] min-h-[525px] md:min-h-[572px] mx-auto mt-[23px] bg-white p-4 sm:p-6 flex flex-col md:flex-row gap-6 box-border">


              {/* Left Column */}
              <div className="w-full md:w-2/3 flex flex-col space-y-4 px-7 pt-1">
                <h1 className="font-jost font-bold text-[28px] md:text-[45.47px] leading-[34px] md:leading-[50.53px] text-[#111827]">
                  {facility.provider_name}
                </h1>

                <p className="font-inter font-normal text-[16px] mb-1 md:text-[22.74px] leading-[24px] md:leading-[35.37px] text-[#4B5563]">
                  {fullAddress}
                </p>

                {/* Ratings & Beds */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-4 space-y-2 sm:space-y-0">
                  <button className="flex items-center px-4 h-[40px] sm:h-[44px] w-[90px] rounded-full bg-[#D02B38]">
                    <Image
                      src="/icons/Vector (3).png"
                      alt="Star"
                      width={23}
                      height={20}
                      className="w-6 h-5 mr-2"
                    />
                    <span className="font-inter font-bold text-[18px] sm:text-[20px] text-white">
                      {facility.rating?.toFixed(1) ?? ''}
                    </span>
                  </button>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0">
                    <span className="font-inter font-normal text-[16px] sm:text-[18px] text-[#4B5563]">
                      CMS Overall Rating
                    </span>
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/icons/Bed_icon.png"
                        alt="Beds"
                        width={22}
                        height={18}
                        className="w-6 h-4"
                      />
                      <span className="font-inter font-normal text-[16px] sm:text-[18px] text-[#4B5563]">
                        {facility.number_of_certified_beds} Beds
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex space-x-2 items-center">
                    <span className="font-inter text-[16px] text-[#111827]">Ownership:</span>
                    <span className="font-inter font-medium text-[16px] text-black">{cleanOwnership}</span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <span className="font-inter text-[16px] text-[#111827]">License:</span>
                    <span className="font-inter font-medium text-[16px] text-black">
                      #{facility.cms_certification_number_ccn || ''}
                    </span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <span className="font-inter text-[16px] text-[#111827]">Accepting:</span>
                    <span className="font-inter font-medium text-[16px] text-green-600">New Residents</span>
                  </div>
                </div>

                {/* Rating Boxes */}
                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                  {[
                    { value: facility.overall_rating, label: "Overall Rating" },
                    { value: facility.health_inspection_rating, label: "Health Inspections" },
                    { value: facility.staffing_rating, label: "Staffing" },
                    { value: facility.qm_rating, label: "Quality Measures" },
                  ].map((rating, idx) => (
                    <div
                      key={idx}
                      className="flex-1 min-w-[140px] sm:min-w-[224px] max-w-[224px] h-[106px] bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center p-4 md:justify-start md:ml-2"
                    >
                      <span className="font-inter font-bold text-[22px] sm:text-[30px] leading-[28px] sm:leading-[40px] text-[#D02B38] text-center">
                        {parseCmsRating(rating.value)}
                      </span>
                      <span className="font-inter text-[14px] sm:text-[18px] leading-[20px] sm:leading-[25px] text-[#111827] mt-2 text-center">
                        {rating.label}
                      </span>
                    </div>
                  ))}
                </div>


                {/* Contact Button */}
                <div className="mt-6">
                  <button
                    className="flex items-center justify-center w-full sm:w-[240px] h-[60px] bg-[#D02B38] rounded-lg hover:bg-red-700 transition gap-x-3"
                    onClick={() => setContactModal(true)}
                  >
                    <Image
                      src="/icons/Cell_phone_icon.png"
                      alt="Contact"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="font-inter font-medium text-[18px] sm:text-[20px] text-white">Contact Facility</span>
                  </button>

                  {contactModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                      <div className="bg-white rounded-lg p-6 w-[300px] text-center relative shadow-lg">
                        <button
                          onClick={() => setContactModal(false)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                        >
                          &times;
                        </button>
                        <h2 className="font-bold text-xl mb-4">Facility Contact</h2>
                        <p className="text-[18px] mb-4">{facility?.telephone_number}</p>
                        <button
                          onClick={() => window.open(`tel:${facility?.telephone_number}`)}
                          className="px-4 py-2 bg-[#D02B38] text-white rounded-[8px] hover:bg-red-700 transition"
                        >
                          Call Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/3 flex flex-col space-y-4">
                {/* Cover Image */}
                <div className="w-full h-[323px] rounded-lg bg-[#F5F5F5] overflow-hidden flex items-center justify-center">
                  <Image
                    // src={coverImage}
                    src={coverImage || DEFAULT_IMAGE}
                    alt={`${facility.provider_name} exterior`}
                    width={458}
                    height={323}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-4">
                  {facility.photos.slice(1, 4).map((photo, idx) => (
                    <div key={idx} onClick={() => setCoverImage(photo)} className="w-1/3 h-[100px] rounded-md overflow-hidden cursor-pointer">
                      <Image src={photo} alt={`${facility.provider_name} interior ${idx + 2}`} width={146} height={101} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          

<div className="w-full h-auto bg-[#F5F5F5] mt-[33px]">
  <div className="w-full max-w-[1527px] mx-auto mt-[23px] bg-[#F5F5F5] p-4 sm:p-6 flex flex-col space-y-4 sm:space-y-6">
    <h2 className="font-jost font-bold text-[24px] sm:text-[32px] leading-[28px] sm:leading-[38.4px] text-[#111827] ml-4 sm:ml-10">
      Services & Facility Details
    </h2>

    <p className="font-inter font-normal text-[14px] sm:text-[18px] leading-[20px] sm:leading-[28px] text-[#707070] ml-4 sm:ml-10">
      Comprehensive care services and amenities available
    </p>

    <div className="flex flex-col lg:flex-row gap-6 mt-6 px-4 md:px-10">
      
      {/* Medical Services */}
      {hasMedicalServicesData(facility) && (
        <div className="w-full lg:flex-1 bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-4 sm:p-6 h-auto">
          <h3 className="font-inter font-bold text-[18px] sm:text-[20px] lg:text-[23.87px] leading-[24px] sm:leading-[26px] lg:leading-[33.42px] text-[#111827] mb-4 sm:mb-6">
            Medical Services
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {getMedicalServices(facility).map((service, idx) => (
              <div key={idx} className="bg-[#F5F5F5] rounded-[8px] sm:rounded-[9.55px] flex items-center p-3 sm:p-4 min-h-[60px]">
                <Image
                  src={service.icon}
                  alt={service.label}
                  width={24}
                  height={24}
                  className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px] mr-2 sm:mr-3 flex-shrink-0"
                />
                <span className="font-inter font-medium text-[13px] sm:text-[14px] lg:text-[16px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-black break-words">
                  {service.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities & Activities */}
      {hasAmenitiesData(facility) && (
        <div className="w-full lg:flex-1 bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-4 sm:p-6 h-auto">
          <h3 className="font-inter font-bold text-[18px] sm:text-[20px] lg:text-[23.87px] leading-[24px] sm:leading-[26px] lg:leading-[33.42px] text-[#111827] mb-4 sm:mb-6">
            Amenities & Activities
          </h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {getAmenities(facility).map((amenity, idx) => (
              <div key={idx} className="bg-[#F5F5F5] rounded-[8px] sm:rounded-[9.55px] flex items-center p-3 sm:p-4 min-h-[60px]">
                <Image
                  src={amenity.icon}
                  alt={amenity.label}
                  width={24}
                  height={24}
                  className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px] mr-2 sm:mr-3 flex-shrink-0"
                />
                <span className="font-inter font-medium text-[13px] sm:text-[14px] lg:text-[16px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-black break-words">
                  {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-6 md:px-10">

                {/* Capacity & Rooms Card */}
                <div className="w-full h-auto bg-white rounded-[9.55px] shadow-sm p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[18px] sm:text-[20px] lg:text-[23.87px] leading-[24px] sm:leading-[26px] lg:leading-[33.42px] text-black mb-4 sm:mb-5">
                    Capacity & Rooms
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { 
                        label: "Total Beds:", 
                        value: facility?.number_of_certified_beds?.toString() || "N/A" 
                      },
                      { 
                        label: "Average Residents:", 
                        value: facility?.average_number_of_residents_per_day?.toString() || "N/A" 
                      },
                      { 
                        label: "Current Occupancy:", 
                        value: calculateOccupancyRate() 
                      },
                      { 
                        label: "CCRC:", 
                        value: facility?.continuing_care_retirement_community === "Y" ? "Yes" : "No" 
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-inter font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] text-[#4B5563]">
                          {item.label}
                        </span>
                        <span className="font-inter font-medium text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] text-black text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className="w-full h-auto bg-white rounded-[9.55px] shadow-sm p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[18px] sm:text-[20px] lg:text-[23.87px] leading-[24px] sm:leading-[26px] lg:leading-[33.42px] text-black mb-4 sm:mb-5">
                    Contact Information
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { 
                        icon: "/icons/phone_icon.png", 
                        label: formatPhoneNumber(facility?.telephone_number || ""), 
                        width: 19, 
                        height: 19 
                      },
                      { 
                        icon: "/icons/email_icon.png", 
                        label: generateEmailFromFacility(facility), 
                        width: 19, 
                        height: 15 
                      },
                      { 
                        icon: "/icons/location_icon (2).png", 
                        label: fullAddress || "Address not available", 
                        width: 14, 
                        height: 19 
                      },
                      { 
                        icon: "/icons/earth_icon.png", 
                        label: getWebsiteFromName(facility?.provider_name || ""), 
                        width: 19, 
                        height: 19 
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start sm:items-center gap-3">
                        <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                          <Image 
                            src={item.icon} 
                            alt="" 
                            width={item.width} 
                            height={item.height}
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                          />
                        </div>
                        <span className="font-inter font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] text-black break-words flex-1">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visiting Hours Card */}
                <div className="w-full h-auto bg-white rounded-[9.55px] shadow-sm p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[18px] sm:text-[20px] lg:text-[23.87px] leading-[24px] sm:leading-[26px] lg:leading-[33.42px] text-black mb-4 sm:mb-5">
                    Visiting Hours
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {generateVisitingHours(facility).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-inter font-normal text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] text-[#4B5563]">
                          {item.label}
                        </span>
                        <span className="font-inter font-medium text-[14px] sm:text-[15px] lg:text-[16px] leading-[20px] sm:leading-[22px] lg:leading-[24px] text-black text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center mt-6 sm:mt-8 gap-2 sm:gap-3">
                    <Image 
                      src="/icons/expectation_icon.png" 
                      alt="Note" 
                      width={16} 
                      height={16}
                      className="w-4 h-4 sm:w-[16px] sm:h-[16px]"
                    />
                    <p className="font-inter font-normal text-[12px] sm:text-[13px] lg:text-[14px] leading-[16px] sm:leading-[18px] lg:leading-[20px] text-[#4B5563]">
                      {getVisitingHoursNote(facility)}
                    </p>
                  </div>
                </div>

              </div>
  </div>
</div>

<section className="w-full bg-white">
  <div className="w-full max-w-[1528px] mx-auto px-4 md:px-8 py-8 flex flex-col">
    {/* Heading */}
    <h2 className="font-jost font-bold text-[20px] sm:text-[22px] md:text-[32px] leading-[26px] sm:leading-[28px] md:leading-[38.4px] text-[#111827] mb-2 sm:mb-4 md:mb-6 ml-0 md:ml-[50px]">
      Google Reviews & AI Analysis
    </h2>
    <p className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[18px] leading-[18px] sm:leading-[22px] md:leading-[28px] text-[#707070] ml-0 md:ml-[50px] mb-6 md:mb-8">
      Real reviews from families and our AI-powered insights
    </p>

    {/* Main Content */}
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
      {/* Reviews Column */}
      <div className="flex-1 w-full lg:w-[70%] bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-4 sm:p-6 flex flex-col min-h-[600px] max-h-[800px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="font-inter font-bold text-[16px] sm:text-[18px] md:text-[23.87px] leading-[20px] sm:leading-[24px] md:leading-[33.42px] text-[#111827]">
            Recent Reviews
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image src="/icons/star_icon.png" alt="star" width={19} height={19} />
            <span className="font-inter font-bold text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[28.65px] text-[#111827]">
              {facility?.rating ? facility.rating.toFixed(1) : ''}
            </span>
            <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#4B5563]">
              ({facility?.reviews?.length || 0} reviews)
            </span>
          </div>
        </div>

        {/* Scrollable Reviews */}
        <div className="flex-grow overflow-y-auto pr-2">
          {reviewsData.length > 0 ? (
            reviewsToShow.map((review, index) => (
              <div key={index} className={`w-full ${index < reviewsToShow.length - 1 ? 'border-b border-gray-200' : ''} py-4 sm:py-6 flex items-start`}>
                <Image
                  src={review.profile_photo_url || '/icons/default_avatar.png'}
                  alt={review.author_name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover mr-3 sm:mr-4 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12"
                />
                <div className="flex flex-col flex-grow">
                  <h4 className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[28.65px] text-[#111827]">
                    {review.author_name}
                  </h4>
                  <div className="flex items-center mt-1 gap-2">
                    <StarRating rating={review.rating} />
                    <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#4B5563]">
                      {review.relative_time_description}
                    </span>
                  </div>
                  <p className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[24px] md:leading-[28.65px] text-[#374151] mt-2 sm:mt-3">
                    {review.text || "(No text provided with this review)"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="font-inter text-center text-gray-500 text-[14px] sm:text-[16px] md:text-[18px]">
                No recent Google reviews available for this facility.
              </p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {hasMoreReviews && (
          <div className="mt-4 flex-shrink-0">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-[140px] sm:w-[154px] h-[40px] text-[14px] sm:text-[16px] md:text-[19.1px] font-inter font-medium text-[#D02B38] bg-transparent hover:bg-transparent shadow-none border border-[#D02B38] rounded-lg"
            >
              View All Reviews
            </Button>
          </div>
        )}
      </div>

      {/* AI Summary Column */}
      <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-[30%]">
        <div className="w-full bg-[#F5F5F5] rounded-[9.55px] p-4 sm:p-6 flex flex-col gap-4 min-h-[400px]">
          <div>
            <h3 className="font-inter font-bold text-[16px] sm:text-[18px] md:text-[23.87px] leading-[20px] sm:leading-[24px] md:leading-[33.42px] text-[#111827] mb-4">
              AI-Generated Summary
            </h3>

            {facility?.aiSummary?.summary ? (
              <>
                <p className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[18px] leading-[16px] sm:leading-[22px] md:leading-[28px] text-[#374151] mb-6">
                  {facility.aiSummary.summary}
                </p>

                {/* Pros */}
                {facility.aiSummary.pros?.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Image src="/icons/like_icon.png" alt="Pros" width={19} height={19} />
                      <span className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[28.65px] text-[#16A34A]">
                        Pros
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {facility.aiSummary.pros.map((pro, index) => (
                        <div key={`pro-${index}`} className="flex items-start">
                          <Image src="/icons/check_icon.png" alt="icon" width={13} height={14} className="mt-1 flex-shrink-0" />
                          <span className="ml-2 font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#374151]">
                            {pro}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cons */}
                {facility.aiSummary.cons?.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Image src="/icons/dislike_icon.png" alt="Cons" width={19} height={19} />
                      <span className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[28.65px] text-[#DC2626]">
                        Cons
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {facility.aiSummary.cons.map((con, index) => (
                        <div key={`con-${index}`} className="flex items-start">
                          <Image src="/icons/cross_icon.png" alt="icon" width={11} height={14} className="mt-1 flex-shrink-0" />
                          <span className="ml-2 font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#374151]">
                            {con}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="font-inter font-normal text-[14px] sm:text-[16px] text-[#6B7280] text-center py-8">
                No AI summary available.
              </p>
            )}
          </div>
        </div>

        {/* Review Distribution */}
        <div className="w-full">
          <ReviewDistribution reviews={facility?.reviews || []} />
        </div>
      </div>
    </div>
  </div>

  <AllReviewsModal reviews={reviewsData} open={isModalOpen} onOpenChange={setIsModalOpen} />
</section>



          <section className="w-full bg-[#F5F5F5] py-6">
            <div className="w-full max-w-[1528px] mx-auto mt-5 bg-gray-100 rounded-lg flex flex-col gap-6 p-4 sm:p-6 md:p-6">

              {/* Heading */}
              <h2 className="font-jost font-bold text-[24px] sm:text-[28px] md:text-[32px] leading-[28px] sm:leading-[34px] md:leading-[38.4px] text-[#111827]">
                CMS Performance Data
              </h2>
              <p className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[18px] leading-[16px] sm:leading-[20px] md:leading-[28px] text-[#707070] w-full sm:w-[90%] md:w-[576px]">
                Official data from the Centers for Medicare & Medicaid Services
              </p>

              {/* Cards Grid */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mt-2 justify-center md:justify-start">

                {/* Overall Rating */}
                <div className="w-full sm:w-[48%] md:w-[464px] h-auto bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 flex flex-col mb-4 md:mb-0">
                  <h3 className="font-jost font-bold text-[18px] sm:text-2xl md:text-2xl text-[#111827] mb-4 sm:mb-6">
                    Overall Rating
                  </h3>
                  <div className="w-full h-auto min-h-[250px] sm:min-h-[300px]">
                    <FacilityRatingGauge facility={facility} />
                  </div>
                </div>

                {/* Staffing Levels */}
                <div className="w-full sm:w-[48%] md:w-[464px] h-auto bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 flex flex-col mb-4 md:mb-0">
                  <h3 className="font-jost font-bold text-[18px] sm:text-2xl md:text-2xl text-[#111827] mb-4 sm:mb-6">
                    Staffing Levels
                  </h3>
                  <div className="w-full h-auto min-h-[250px] sm:min-h-[300px]">
                    <StaffingLevelsChart facility={facility} />
                  </div>
                </div>

                {/* Quality Measures */}
                <div className="w-full sm:w-[48%] md:w-[464px] h-auto bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 flex flex-col mb-4 md:mb-0">
                  <h3 className="font-jost font-bold text-[18px] sm:text-2xl md:text-2xl text-[#111827] mb-4 sm:mb-6">
                    Quality Measures
                  </h3>
                  <div className="w-full h-auto min-h-[250px] sm:min-h-[300px]">
                    <FacilityQualityMeasures facility={facility} />
                  </div>
                </div>

                {/* Recent Health Inspections */}
                <div className="w-full md:w-[711px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6 flex flex-col gap-4 mb-4 md:mb-0">
  <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[26px] sm:leading-[30px] md:leading-[33.42px] text-[#111827]">
    Recent Health Inspections
  </h3>
  <div className="flex flex-col gap-3 mt-2">
    {getDynamicInspections(facility).map((inspection, index) => {
      const props = getInspectionProps(inspection.status);
      return (
        <div key={index} className={`w-full bg-white border-l-[4.77px] ${props.borderColor} p-3 sm:p-4 flex flex-col gap-2 shadow-sm rounded-sm`}>
          <div className="flex justify-between items-center">
            <h4 className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[16px] sm:leading-[20px] md:leading-[28.65px] text-[#111827]">
              {inspection.type}
            </h4>
            <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[14px] sm:leading-[20px] md:leading-[23.87px] text-[#4B5563]">
              {inspection.date}
            </span>
          </div>
          <p className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#4B5563]">
            {inspection.deficiencies} {inspection.deficiencies === 1 ? 'deficiency' : 'deficiencies'} found - {inspection.statusDescription}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Image src={props.iconSrc} alt={props.statusText} width={19} height={19} />
            <span className={`font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] ${props.statusColor}`}>
              {props.statusText}
            </span>
          </div>
        </div>
      );
    })}
  </div>
</div>

{/* Ownership & Financial */}
<div className="w-full md:w-[711px] h-auto bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6 flex flex-col gap-4">
  <div className="ml-0 sm:ml-2">
    <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[26px] sm:leading-[30px] md:leading-[33.42px] text-[#111827]">
      Ownership & Financial
    </h3>
    <h4 className="font-inter mt-3 sm:mt-4 font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[16px] sm:leading-[20px] md:leading-[28.65px] text-[#111827]">
      Ownership Information
    </h4>
  </div>

  <div className="flex flex-col gap-2 sm:gap-3">
    {[
      { 
        label: 'Type', 
        value: facility?.ownership_type ? cleanOwnershipType(facility.ownership_type) : 'Not specified' 
      },
      { 
        label: 'Parent Company', 
        value: facility?.chain_name || 'Independent' 
      },
      { 
        label: 'Administrator', 
        value: facility?.administrator_name || 'Not specified' 
      },
      { 
        label: 'CMS Certification', 
        value: facility?.cms_certification_number_ccn || 'Not available' 
      },
    ].map((item, index) => (
      <div key={index} className="flex justify-between items-center">
        <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16px] text-[#4B5563]">{item.label}:</span>
        <span className="font-inter font-medium text-[12px] sm:text-[14px] md:text-[16px] text-[#000] text-right max-w-[60%] break-words">
          {item.value}
        </span>
      </div>
    ))}

    <h4 className="font-inter mt-3 sm:mt-4 font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[16px] sm:leading-[20px] md:leading-[28.65px] text-[#111827]">
      Financial Performance
    </h4>

    {[
      { 
        label: 'Medicare Certified', 
        value: formatCertification('Medicare', facility) 
      },
      { 
        label: 'Medicaid Certified', 
        value: formatCertification('Medicaid', facility) 
      },
      { 
        label: 'Accepts Private Pay', 
        value: facility?.accepts_private_pay ? 
          <span className="text-[#16A34A]">Yes</span> : 
          <span className="text-[#DC2626]">No</span> 
      },
      { 
        label: 'Total Fines', 
        value: facility?.inspectionMetrics?.totalFinesInDollars ? 
          `$${facility.inspectionMetrics.totalFinesInDollars.toLocaleString()}` : 
          '$0' 
      },
    ].map((item, index) => (
      <div key={index} className="flex justify-between items-center">
        <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16px] text-[#4B5563]">{item.label}:</span>
        <span className="font-inter font-medium text-[12px] sm:text-[14px] md:text-[16px]">
          {item.value}
        </span>
      </div>
    ))}
  </div>
</div>

              </div>
            </div>
          </section>

          {/* Section */}
          <div className="w-full bg-[#F5F5F5] flex items-center justify-center py-8">
            {/* Inner container */}
            <div className="w-full max-w-[1528px] bg-[#F5F5F5] p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">

              {/* LEFT COLUMN */}
              <div className="flex flex-col w-full lg:w-2/3 lg:ml-0">
                <h2 className="font-jost font-bold text-[22px] sm:text-[26px] md:text-[32px] leading-[26px] sm:leading-[32px] md:leading-[38.4px] text-[#111827]">
                  Location & Directions
                </h2>

                <p className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[18px] leading-[20px] sm:leading-[24px] md:leading-[28px] text-[#707070] mt-3 sm:mt-4 md:mt-6 max-w-full sm:max-w-[428px]">
                  Find us easily with detailed location information
                </p>

                {/* Map container card */}
                <div className="w-full h-[300px] sm:h-[400px] md:h-[515.63px] bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] mt-4 flex items-center justify-center p-2 sm:p-4">
                  <MapView
                    facilities={facilityCoords}
                    centerCoords={mapCenter}
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                    locationName={facility?.provider_name}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN – 3 boxes */}
              <div className="flex flex-col w-full lg:w-1/3 gap-4 mt-6 lg:mt-0">

                {/* Address & Contact - Only show if we have contact data */}
                {(facility?.provider_address || facility?.telephone_number) && (
                  <div className="w-full bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6">
                    <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[28px] sm:leading-[30px] md:leading-[33.42px] text-[#111827]">
                      Address &amp; Contact
                    </h3>

                    {facility?.provider_address && (
                      <div className="flex items-start mt-3 gap-2 sm:gap-3">
                        <Image
                          src="/icons/location_icon (2).png"
                          alt="Location Icon"
                          width={14}
                          height={19}
                          className="object-contain mt-1 sm:mt-2 w-3 h-4 sm:w-[14px] sm:h-[19px]"
                        />
                        <p className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[16px] leading-[18px] sm:leading-[22px] md:leading-[24px] text-[#000000]">
                          {facility.provider_address}{" "}
                          {facility.city_town && facility.state && (
                            <span className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[16px] leading-[18px] sm:leading-[22px] md:leading-[24px] text-[#000000]">
                              {facility.city_town}, {facility.state} {facility.zip_code}
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {facility?.telephone_number && (
                      <div className="flex items-start gap-2 sm:gap-3 mt-2">
                        <Image src="/icons/phone_icon.png" alt="Phone" width={19} height={19} className="object-contain mt-1 sm:mt-2 w-4 h-4 sm:w-[19px] sm:h-[19px]" />
                        <p className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[16px] leading-[18px] sm:leading-[22px] md:leading-[24px]">
                          {formatPhoneNumber(facility.telephone_number)}
                        </p>
                      </div>
                    )}

                    <div className="flex items-start gap-2 sm:gap-3 mt-2">
                      <Image src="/icons/message_icon.png" alt="Email" width={19} height={14} className="object-contain mt-1 sm:mt-2 w-4 h-3 sm:w-[19px] sm:h-[14px]" />
                      <p className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[16px] leading-[18px] sm:leading-[22px] md:leading-[24px]">
                        {generateEmailFromFacility(facility)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Transportation - Show if we have accessibility data or location data */}
                {hasTransportationData(facility) && (
                  <div className="w-full bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6">
                    <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[28px] sm:leading-[30px] md:leading-[33.42px] text-[#111827] mb-3">
                      Transportation
                    </h3>

                    {getTransportationOptions(facility).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                        <Image src={item.icon} alt="" width={19} height={19} className="w-4 h-4 sm:w-[19px] sm:h-[19px]" />
                        <p className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[16px] leading-[18px] sm:leading-[22px] md:leading-[24px] text-[#000000]">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Nearby Services - Show if we have location data */}
                {hasNearbyServicesData(facility) && (
                  <div className="w-full bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6">
                    <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[28px] sm:leading-[30px] md:leading-[33.42px] text-[#111827] mb-3">
                      Nearby Services
                    </h3>

                    {getNearbyServices(facility).map((service, i) => (
                      <div key={i} className="flex justify-between items-center mt-1 sm:mt-2">
                        <span className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[16px] leading-[18px] sm:leading-[22px] md:leading-[24px] text-[#4B5563]">
                          {service.label}
                        </span>
                        <span className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[16px] leading-[18px] sm:leading-[22px] md:leading-[24px] text-[#000000]">
                          {service.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <SearchNursing />
          <Footer />
        </>
      )}
    </>

  )
}