import { NextResponse } from "next/server";
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
async function fetchGooglePlace(input: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const placeUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    input
  )}&inputtype=textquery&fields=photos,place_id,geometry&key=${apiKey}`;

  const res = await fetch(placeUrl);
  const data = await res.json();

  if (!data.candidates || data.candidates.length === 0) {
    return { lat: null, lng: null, photo: null };
  }

  const candidate = data.candidates[0];
  const lat = candidate.geometry?.location?.lat ?? null;
  const lng = candidate.geometry?.location?.lng ?? null;

  let photo: string | null = null;
  if (candidate.photos && candidate.photos.length > 0) {
    const photoRef = candidate.photos[0].photo_reference;
    photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoRef}&key=${apiKey}`;
  }

  return { lat, lng, photo };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip") || "";
    const city = searchParams.get("city") || "";
    const state = searchParams.get("state") || "";

    const backendRes = await fetch(
      `https://app.carenav.io/api/facilities/with-reviews?zip=${zip}&city=${city}&state=${state}`
    );
    const facilities = await backendRes.json();

    const enriched = await Promise.all(
      facilities.map(async (f: Facility) => {
        const place = await fetchGooglePlace(`${f.name} ${f.city}`);
        return {
          ...f,
          lat: place.lat,
          lng: place.lng,
          photo: place.photo,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Failed to fetch facilities" }, { status: 500 });
  }
}
