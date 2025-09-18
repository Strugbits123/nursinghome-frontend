import { NextRequest, NextResponse } from "next/server";
import wixClient from "@/config/wixConfig";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";

  try {
    let query = wixClient.items.query("Facilities");

    // Add filters
    if (zip) query = query.eq("zip", zip);
    if (city) query = query.eq("city", city);
    if (state) query = query.eq("city1", state);

    const { items } = await query.find();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return NextResponse.json({ items: [], error: "Failed to fetch facilities" }, { status: 500 });
  }
}