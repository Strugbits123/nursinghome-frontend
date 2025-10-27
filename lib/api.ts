export interface FacilityResponse {
  message: string;
  zip: string;
  city: string;
  state: string;
  summary?: string;
  pros?: string[];
  cons?: string[];
}

export async function getFacilities(zip: string, city: string, state: string): Promise<FacilityResponse> {
  const params = new URLSearchParams({ zip, city, state });
  const res = await fetch(`https://app.carenav.io/api/facilities/with-reviews?${params.toString()}`, {
    next: { revalidate: 0 }, // no caching
  });

  if (!res.ok) throw new Error("Failed to fetch facilities");

  return res.json();
}
