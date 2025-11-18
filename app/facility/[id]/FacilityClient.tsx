"use client";
import { useEffect, useState } from "react";

export default function FacilityClient({
  initialFacility,
  id,
}: {
  initialFacility: any;
  id: string;
}) {
  const [facility, setFacility] = useState(initialFacility);

  useEffect(() => {
    async function fetchFacility() {
      const res = await fetch(`/facility?id=${id}`);
      const data = await res.json();

      // If no AI summary → call /api/ai-summary
      if (!data.ai_summary && data.reviews?.length > 0) {
        const aiRes = await fetch("/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            facilityId: id,
            reviews: data.reviews,
          }),
        });
        const aiData = await aiRes.json();
        data.ai_summary = aiData;
      }

      setFacility(data);
    }
    if (id) fetchFacility();
  }, [id]);

  return (
    <div>
      <h1>{facility.description_fld}</h1>
      <p>
        {facility.address}, {facility.city} {facility.zip}
      </p>
      <p>Beds: {facility.beds}</p>
      <p>Rating: {facility.cms_rating}⭐</p>

      <h2>AI Summary</h2>
      {facility.ai_summary ? (
        <div>
          <p>{facility.ai_summary.summary}</p>
          <ul>
            <li>
              <strong>Pros:</strong> {facility.ai_summary.pros}
            </li>
            <li>
              <strong>Cons:</strong> {facility.ai_summary.cons}
            </li>
          </ul>
        </div>
      ) : (
        <p>No AI summary available.</p>
      )}

      <h2>Google Reviews</h2>
      <ul>
        {facility.reviews?.map((r: any, i: number) => (
          <li key={i}>
            <strong>{r.author}</strong>: {r.comment} ({r.rating}⭐)
          </li>
        ))}
      </ul>
    </div>
  );
}