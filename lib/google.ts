export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
   if (!apiKey) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing"
    );
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "OK" && data.results[0]) {
    return data.results[0].geometry.location;
  }

  return null;
}

export async function getPlacePhoto(placeName: string, city: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
   if (!apiKey) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing"
    );
  }
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    placeName + " " + city
  )}&inputtype=textquery&fields=photos,place_id&key=${apiKey}`;

  const res = await fetch(searchUrl);
  const data = await res.json();

  if (data.candidates?.[0]?.photos?.[0]?.photo_reference) {
    const photoRef = data.candidates[0].photos[0].photo_reference;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`;
  }

  return null;
}
