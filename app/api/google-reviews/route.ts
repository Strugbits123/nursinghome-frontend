import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const place_id = searchParams.get("place_id");

  if (!place_id) return NextResponse.json({ reviews: [] });

  const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=review&key=${process.env.GOOGLE_API_KEY}`);
  const data = await res.json();
  return NextResponse.json({ reviews: data.result?.reviews || [] });
}