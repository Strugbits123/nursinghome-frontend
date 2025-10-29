

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


interface FacilityData {
  _id: string;
  cms_certification_number_ccn: string;
  provider_name: string;
  legal_business_name: string;
  overall_rating: string;
  health_inspection_rating: string;
  staffing_rating: string;
  qm_rating: string;
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

  provider_address: string;
  city_town: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  ownership_type: string;
  provider_type: string;
  chain_name: string | null;
  administrator_name: string;
  accepts_private_pay: boolean;
  number_of_certified_beds: number;
  telephone_number: string;
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
                Sunset Manor Care Center
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

          <div className="w-full h-auto md:min-h-[900px] bg-[#F5F5F5] mt-[33px]">
            <div className="w-full max-w-[1527px] h-auto md:h-[778px] mx-auto mt-[23px] bg-[#F5F5F5] p-4 sm:p-6 flex flex-col space-y-4 sm:space-y-6">
              <h2 className="font-jost font-bold text-[24px] sm:text-[32px] leading-[28px] sm:leading-[38.4px] text-[#111827] ml-4 sm:ml-10">
                Services & Facility Details
              </h2>

              <p className="font-inter font-normal text-[14px] sm:text-[18px] leading-[20px] sm:leading-[28px] text-[#707070] ml-4 sm:ml-10">
                Comprehensive care services and amenities available
              </p>

              <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 mt-6 px-4 md:px-10">

                {/* Medical Services */}
                <div className="w-full md:flex-1 bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6 h-auto md:h-[334px]">
                  <h3 className="font-inter font-bold text-[20px] sm:text-[23.87px] leading-[26px] sm:leading-[33.42px] text-[#111827] mb-4">
                    Medical Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { icon: "/icons/medical_icon1.png", label: "24/7 Nursing Care" },
                      { icon: "/icons/medical_icon2.png", label: "Medication Management" },
                      { icon: "/icons/medical_icon3.png", label: "Skilled Doctors" },
                      { icon: "/icons/medical_icon4.png", label: "Emergency Response" },
                      { icon: "/icons/medical_icon5.png", label: "Pharmacy Support" },
                      { icon: "/icons/medical_icon6.png", label: "Rehab Programs" },
                    ].map((service, idx) => (
                      <div key={idx} className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-3 sm:p-4">
                        <Image
                          src={service.icon}
                          alt={service.label}
                          width={27}
                          height={24}
                          className="w-[20px] sm:w-[27px] h-[20px] sm:h-[23.87px] mr-3"
                        />
                        <span className="font-inter font-medium text-[14px] sm:text-[16.71px] leading-[20px] sm:leading-[23.87px] text-black">
                          {service.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities & Activities */}
                <div className="w-full md:flex-1 bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] p-6 h-auto md:h-[334px]">
                  <h3 className="font-inter font-bold text-[20px] sm:text-[23.87px] leading-[26px] sm:leading-[33.42px] text-[#111827] mb-4">
                    Amenities & Activities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { icon: "/icons/medical_icon1.png", label: "Dining Room" },
                      { icon: "/icons/medical_icon2.png", label: "Music Therapy" },
                      { icon: "/icons/medical_icon3.png", label: "Garden Courtyard" },
                      { icon: "/icons/medical_icon4.png", label: "Activity Room" },
                      { icon: "/icons/medical_icon5.png", label: "Library" },
                      { icon: "/icons/medical_icon6.png", label: "Entertainment Room" },
                    ].map((amenity, idx) => (
                      <div key={idx} className="bg-[#F5F5F5] rounded-[9.55px] flex items-center p-3 sm:p-4">
                        <Image
                          src={amenity.icon}
                          alt={amenity.label}
                          width={27}
                          height={24}
                          className="w-[20px] sm:w-[27px] h-[20px] sm:h-[23.87px] mr-3"
                        />
                        <span className="font-inter font-medium text-[14px] sm:text-[16.71px] leading-[20px] sm:leading-[23.87px] text-black">
                          {amenity.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>



              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-10">

                {/* Capacity & Rooms Card */}
                <div className="w-full h-auto bg-white rounded-[9.55px] shadow-sm p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[18px] sm:text-[23.87px] leading-[24px] sm:leading-[33.42px] text-black mb-3 sm:mb-4">
                    Capacity & Rooms
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { label: "Total Beds:", value: "120" },
                      { label: "Private Rooms:", value: "45" },
                      { label: "Semi-Private:", value: "75" },
                      { label: "Current Occupancy:", value: "92%" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="font-inter font-normal text-[14px] sm:text-[19.1px] leading-[20px] sm:leading-[28.65px] text-[#4B5563]">
                          {item.label}
                        </span>
                        <span className="font-inter font-medium text-[14px] sm:text-[19.1px] leading-[20px] sm:leading-[28.65px] text-black">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information Card */}
                <div className="w-full h-auto bg-white rounded-[9.55px] shadow-sm p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[18px] sm:text-[23.87px] leading-[24px] sm:leading-[33.42px] text-black mb-3 sm:mb-4">
                    Contact Information
                  </h3>

                  {[
                    { icon: "/icons/phone_icon.png", label: "(323) 555-0123", width: 19, height: 19 },
                    { icon: "/icons/email_icon.png", label: "info@sunsetmanor.com", width: 19, height: 15 },
                    { icon: "/icons/location_icon (2).png", label: "1234 Sunset Boulevard Los Angeles, CA 90028", width: 14, height: 19 },
                    { icon: "/icons/earth_icon.png", label: "www.sunsetmanor.com", width: 19, height: 19 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center mt-3 gap-2 sm:gap-3">
                      <Image src={item.icon} alt={item.label} width={item.width} height={item.height} />
                      <span className="font-inter font-normal text-[14px] sm:text-[19.1px] leading-[20px] sm:leading-[28.65px] text-black">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Visiting Hours Card */}
                <div className="w-full h-auto bg-white rounded-[9.55px] shadow-sm p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[18px] sm:text-[23.87px] leading-[24px] sm:leading-[33.42px] text-black mb-3 sm:mb-4">
                    Visiting Hours
                  </h3>

                  {[
                    { label: "Monday - Friday:", value: "9:00 AM - 8:00 PM" },
                    { label: "Saturday:", value: "10:00 AM - 6:00 PM" },
                    { label: "Sunday:", value: "12:00 PM - 5:00 PM" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between mb-2 sm:mb-3">
                      <span className="font-inter font-normal text-[14px] sm:text-[19.1px] leading-[20px] sm:leading-[28.65px] text-[#4B5563]">
                        {item.label}
                      </span>
                      <span className="font-inter font-medium text-[14px] sm:text-[19.1px] leading-[20px] sm:leading-[28.65px] text-black">
                        {item.value}
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center mt-6 sm:mt-10 gap-2 sm:gap-3">
                    <Image src="/icons/expectation_icon.png" alt="Note" width={17} height={17} />
                    <p className="font-inter font-normal text-[12px] sm:text-[16.71px] leading-[16px] sm:leading-[23.87px] text-[#4B5563]">
                      Please call ahead to schedule visits
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
              <div className="flex flex-col md:flex-row gap-6 md:gap-6">

                {/* Reviews Column */}
                <div className="flex-1 w-full md:w-[954px] h-auto md:h-[1097px] bg-white rounded-[9.55px] shadow-[0px_1.19px_2.39px_0px_#0000000D] md:ml-0 lg:ml-10 p-4 sm:p-6 flex flex-col">

                  {/* Header */}
                  <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="font-inter font-bold text-[16px] sm:text-[18px] md:text-[23.87px] leading-[20px] sm:leading-[24px] md:leading-[33.42px] text-[#111827]">
                      Recent Reviews
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Image src="/icons/star_icon.png" alt="star" width={19} height={19} />
                      <span className="font-inter font-bold text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[28.65px] text-[#111827]">
                        {facility.rating ? facility.rating.toFixed(1) : ''}
                      </span>
                      <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#4B5563]">
                        ({facility.reviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Reviews */}
                  <div className="flex-grow overflow-y-auto pr-0 md:pr-4">
                    {reviewsData.length > 0 ? (
                      reviewsToShow.map((review, index) => (
                        <div key={index} className={`w-full ${index < 4 ? 'border-b-[1.19px] border-gray-300' : ''} mt-4 sm:mt-6 pb-4 sm:pb-6 flex items-start`}>
                          <Image
                            src={review.profile_photo_url || '/icons/default_avatar.png'}
                            alt={review.author_name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover mr-3 sm:mr-4 flex-shrink-0"
                          />
                          <div className="flex flex-col ml-2 sm:ml-4 flex-grow">
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
                      <p className="font-inter text-center text-gray-500 mt-10 text-[14px] sm:text-[16px] md:text-[18px]">
                        No recent Google reviews available for this facility.
                      </p>
                    )}
                  </div>

                  {/* View All Button */}
                  {hasMoreReviews && (
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-3 sm:mt-4 w-[140px] sm:w-[154px] h-[28px] sm:h-[28.65px] text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[28.65px] font-inter font-medium text-[#D02B38] bg-transparent hover:bg-transparent shadow-none flex-shrink-0"
                    >
                      View All Reviews
                    </Button>
                  )}
                </div>

                {/* AI Summary Column */}
                <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[458px]">
                  <div className="w-full h-auto md:h-[486px] bg-[#F5F5F5] rounded-[9.55px] p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
                    <div className="ml-2 sm:ml-4">
                      <h3 className="font-inter font-bold text-[16px] sm:text-[18px] md:text-[23.87px] leading-[20px] sm:leading-[24px] md:leading-[33.42px] text-[#111827] mt-3 mb-2 sm:mb-4">
                        AI-Generated Summary
                      </h3>

                      {facility.aiSummary?.summary && (
                        <p className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[18px] leading-[16px] sm:leading-[22px] md:leading-[28px] text-[#374151] mb-4 sm:mb-6 pr-0 md:pr-4">
                          {facility.aiSummary.summary}
                        </p>
                      )}

                      {/* Pros */}
                      {facility.aiSummary?.pros?.length > 0 && (
                        <>
                          <div className="flex items-center mt-2 space-x-2">
                            <Image src="/icons/like_icon.png" alt="Pros" width={19} height={19} />
                            <span className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[28.65px] text-[#16A34A]">
                              Pros
                            </span>
                          </div>
                          <div className="mt-2 flex flex-col gap-2 pr-0 md:pr-4">
                            {facility.aiSummary.pros.map((pro, index) => (
                              <div key={`pro-${index}`} className="flex items-start">
                                <Image src="/icons/check_icon.png" alt="icon" width={13} height={14} className="mt-1 flex-shrink-0" />
                                <span className="ml-2 font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#374151]">
                                  {pro}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Cons */}
                      {facility.aiSummary?.cons?.length > 0 && (
                        <>
                          <div className="flex items-center mt-4 sm:mt-6 space-x-2">
                            <Image src="/icons/dislike_icon.png" alt="Cons" width={19} height={19} />
                            <span className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[28.65px] text-[#DC2626]">
                              Cons
                            </span>
                          </div>
                          <div className="mt-2 flex flex-col gap-2 pr-0 md:pr-4">
                            {facility.aiSummary.cons.map((con, index) => (
                              <div key={`con-${index}`} className="flex items-start">
                                <Image src="/icons/cross_icon.png" alt="icon" width={11} height={14} className="mt-1 flex-shrink-0" />
                                <span className="ml-2 font-inter font-normal text-[12px] sm:text-[14px] md:text-[16.71px] leading-[16px] sm:leading-[20px] md:leading-[23.87px] text-[#374151]">
                                  {con}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Review Distribution */}
                  <ReviewDistribution reviews={facility.reviews} />
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
                    {facilityInspections.map((inspection, index) => {
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
                            {inspection.deficiencies} deficiencies found - {inspection.statusDescription}
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
                      { label: 'Type', value: facility.ownership_type || '' },
                      { label: 'Parent Company', value: facility.chain_name || 'Independent' },
                      { label: 'Administrator', value: facility.administrator_name || '' },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[19.1px] text-[#4B5563]">{item.label}:</span>
                        <span className="font-inter font-medium text-[12px] sm:text-[14px] md:text-[19.1px] text-[#000]">{item.value}</span>
                      </div>
                    ))}

                    <h4 className="font-inter mt-3 sm:mt-4 font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[16px] sm:leading-[20px] md:leading-[28.65px] text-[#111827]">
                      Financial Performance
                    </h4>

                    {[
                      { label: 'Medicare Certified', value: formatCertification('Medicare', facility) },
                      { label: 'Medicaid Certified', value: formatCertification('Medicaid', facility) },
                      { label: 'Accepts Private Pay', value: facility.accepts_private_pay ? formatCertification('Medicare', facility) : formatCertification('No', facility) },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-inter font-normal text-[12px] sm:text-[14px] md:text-[19.1px] text-[#4B5563]">{item.label}:</span>
                        <span className="font-inter font-medium text-[12px] sm:text-[14px] md:text-[19.1px] text-[#16A34A]">{item.value}</span>
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

                {/* Address & Contact */}
                <div className="w-full bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[28px] sm:leading-[30px] md:leading-[33.42px] text-[#111827]">
                    Address &amp; Contact
                  </h3>

                  <div className="flex items-start mt-3 gap-2 sm:gap-3">
                    <Image
                      src="/icons/location_icon (2).png"
                      alt="Location Icon"
                      width={14}
                      height={19}
                      className="object-contain mt-1 sm:mt-2"
                    />
                    <p className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[25.65px] text-[#000000]">
                      1234 Sunset Boulevard{" "}
                      <span className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[25.65px] text-[#000000]">
                        Los Angeles, CA 90028
                      </span>
                    </p>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 mt-2">
                    <Image src="/icons/phone_icon.png" alt="Phone" width={19} height={19} className="object-contain mt-1 sm:mt-2" />
                    <p className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[25.65px]">
                      (123) 456-7890
                    </p>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 mt-2">
                    <Image src="/icons/message_icon.png" alt="Email" width={19} height={14} className="object-contain mt-1 sm:mt-2" />
                    <p className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[19.1px] leading-[18px] sm:leading-[22px] md:leading-[25.65px]">
                      info@sunsetmanor.com
                    </p>
                  </div>
                </div>

                {/* Transportation */}
                <div className="w-full bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[28px] sm:leading-[30px] md:leading-[33.42px] text-[#111827] mb-3">
                    Transportation
                  </h3>

                  {[
                    { icon: "/icons/transpotation_icon.png", text: "Bus Lines 2, 4, 302 nearby" },
                    { icon: "/icons/car_icon.png", text: "Free visitor parking available" },
                    { icon: "/icons/wheel_chair_icon.png", text: "Wheelchair accessible entrance" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                      <Image src={item.icon} alt="" width={19} height={19} className="w-[19px] h-[19px]" />
                      <p className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[16.71px] leading-[18px] sm:leading-[22px] md:leading-[23.87px] text-[#000000]">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Nearby Services */}
                <div className="w-full bg-white rounded-[9.55px] shadow-[0_1.19px_2.39px_0_rgba(0,0,0,0.05)] p-4 sm:p-6">
                  <h3 className="font-inter font-bold text-[20px] sm:text-[22px] md:text-[23.87px] leading-[28px] sm:leading-[30px] md:leading-[33.42px] text-[#111827] mb-3">
                    Nearby Services
                  </h3>

                  {[
                    { label: "Hospital:", value: "0.8 miles" },
                    { label: "Pharmacy:", value: "0.3 miles" },
                    { label: "Shopping:", value: "0.5 miles" },
                    { label: "Restaurant:", value: "0.2 miles" },
                  ].map((service, i) => (
                    <div key={i} className="flex justify-between items-center mt-1 sm:mt-2">
                      <span className="font-inter font-normal text-[14px] sm:text-[16px] md:text-[16.71px] leading-[18px] sm:leading-[22px] md:leading-[23.87px] text-[#4B5563]">
                        {service.label}
                      </span>
                      <span className="font-inter font-medium text-[14px] sm:text-[16px] md:text-[16.71px] leading-[18px] sm:leading-[22px] md:leading-[23.87px] text-[#000000]">
                        {service.value}
                      </span>
                    </div>
                  ))}
                </div>
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