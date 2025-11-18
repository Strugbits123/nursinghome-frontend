import { Facility } from "../context/FacilitiesContext";

interface Coords {
  lat: number;
  lng: number;
}
export interface SponsoredBy {
  name: string;
  email: string;
  phone: string;
  submittedAt: string;
}

export interface SponsoredData {
  priority: number;
  startDate: string | Date;
  endDate: string | Date;
  sponsoredBy?: SponsoredBy;
}

export interface RawFacility {
  _id: string;
  googleName?: string;
  provider_name?: string;
  provider_address?: string;
  city_town?: string;
  state?: string;
  zip_code?: string;
  ownership_type?: string;
  aiSummary?: {
    pros?: string[];
    cons?: string[];
  };
  location?: string;
  latitude?: number;
  longitude?: number;
  photo?: string;
  number_of_certified_beds?: number;
  overall_rating?: number;
  telephone_number?: number | string;
   // Sponsored facility properties
  isSponsored?: boolean;
  sponsoredData?: SponsoredData;
}

// Example Haversine distance function
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

export const mapRawFacilityToCard = (raw: RawFacility, currentCoords?: Coords | null): Facility => {
  const id = raw._id;
  const name = raw.googleName || raw.provider_name || "";

  const address =
    raw.location ||
    `${raw.provider_address || ""}, ${raw.city_town || ""}, ${raw.state || ""}, ${raw.zip_code || ""}`.replace(
      /, ,/g,
      ","
    );

  const isNonProfit = raw.ownership_type?.toLowerCase().includes("non-profit") || false;
  const pros = raw.aiSummary?.pros?.join(", ") || "No specific pros listed";
  const cons = raw.aiSummary?.cons?.join(", ") || "No specific cons listed";

  const status: Facility["status"] = "Accepting";

  // Distance calculation
  let distance: number | null = null;
  if (currentCoords && raw.latitude != null && raw.longitude != null) {
    distance = calculateDistance(raw.latitude, raw.longitude, currentCoords.lat, currentCoords.lng);
  }

  return {
    _id: id,
    id,
    name,
    address,
    city: raw.city_town || "",
    state: raw.state || "",
    zip: raw.zip_code || "",
    phone: raw.telephone_number != null ? String(raw.telephone_number) : "",
    beds: raw.number_of_certified_beds || 0,
    lat: raw.latitude || 0,
    lng: raw.longitude || 0,
    isNonProfit,
    provider_name: raw.provider_name || "",
    legal_business_name: "",
    pros,
    cons,
    imageUrl: raw.photo || null,
    isFeatured: false,
    distance,
    status,
    hours: "Open 24/7",
    rating: raw.overall_rating || 0,
  };
};
