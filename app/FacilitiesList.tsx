"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FacilitiesList() {
  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    async function loadFacilities() {
      const res = await fetch("/api/facilities?zip=90001");
      const data = await res.json();
      setFacilities(data.items || []);
    }
    loadFacilities().catch(console.error);
  }, []);

  return (
    <div>
      <h2>Facilities</h2>
      <ul>
        {facilities.map((f) => (
          <li key={f._id}>
            <Link href={`/facility/${f._id}`}>
              <strong>{f.description_fld}</strong>
            </Link>
            <br />
            {f.address}, {f.city}, {f.city1} {f.zip} <br />
            Beds: {f.beds} | Rating: {f.cms_rating}⭐ <br />
            Services: <span dangerouslySetInnerHTML={{ __html: f.services }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
