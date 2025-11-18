"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function FacilityPage() {
  const params = useParams();
  const facilityId = params?.id;
  const [facility, setFacility] = useState<any>(null);
  const [google, setGoogle] = useState<any>(null);

  useEffect(() => {
    if (!facilityId) return;

    // 1. Get facility from your DB API
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/${facilityId}`)
      .then((res) => res.json())
      .then((data) => {
        setFacility(data);

        // 2. Fetch Google details by text
        if (data.name && data.city) {
          const q = `${data.name} ${data.city} ${data.state} ${data.zip}`;
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/google/details-by-text?q=${encodeURIComponent(q)}`)
            .then((res) => res.json())
            .then((g) => setGoogle(g));
        }
      });
  }, [facilityId]);

  if (!facility) return <p>Loading facility...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{facility.name}</h1>
      <p className="text-gray-600">{facility.address}</p>

      {/* Google Photos */}
      {google?.photos?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
          {google.photos.slice(0, 6).map((url: string, i: number) => (
            <Image
              key={i}
              src={url}
              alt={facility.name}
              className="rounded-lg shadow"
            />
          ))}
        </div>
      )}

      {/* Google Reviews */}
      {google?.reviews?.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-3">Reviews</h2>
          <div className="space-y-4">
            {google.reviews.slice(0, 5).map((r: any, i: number) => (
              <div key={i} className="border p-4 rounded-lg shadow-sm">
                <p className="font-semibold">{r.author}</p>
                <p className="text-yellow-600">⭐ {r.rating}</p>
                <p className="text-gray-700">{r.text}</p>
                <p className="text-sm text-gray-500">{r.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
