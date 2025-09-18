// import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const text = searchParams.get("text") || "";

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "Summarize the following nursing facility in 3 concise sentences." },
//         { role: "user", content: text },
//       ],
//       max_tokens: 150,
//     });

//     const summary = completion.choices[0].message?.content || "";
//     return NextResponse.json({ summary });
//   } catch (error: any) {
//     console.error("OpenAI Error:", error);
//     return NextResponse.json({ summary: error.message || "Failed to generate summary" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const place_id = searchParams.get("place_id");

  if (!place_id) return NextResponse.json({ summary: "Place ID is required" });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,rating,formatted_address,reviews&key=${process.env.GOOGLE_API_KEY}`
  );
  const data = await res.json();

  if (!data.result) return NextResponse.json({ summary: "Place not found" });

  const place = data.result;

  // Create a simple summary from Google data
  const summary = `${place.name} is located at ${place.formatted_address}. It has a rating of ${place.rating || "N/A"} stars and ${place.reviews?.length || 0} reviews.`;

  return NextResponse.json({ summary, reviews: place.reviews || [] });
}

