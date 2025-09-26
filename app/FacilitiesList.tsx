"use client";
import { useEffect, useState } from "react";
import Link from "next/link";


interface Facility {
  _id: string;
  name: string;
  description_fld?: string;
  cms_rating?: string | null;
  services?: string | null;
  beds?: number | null;
  city1?: string | null;
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

export default function FacilitiesList() {
  const [facilities, setFacilities] = useState<Facility[]>([]);

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
        {facilities.map((f: Facility, index: number) => (
          <li key={index}>
            <Link href={`/facility/${f._id}`}>
              <strong>{f.description_fld}</strong>
            </Link>
            <br />
            {f.address}, {f.city}, {f.city1} {f.zip} <br />
            Beds: {f.beds} | Rating: {f.cms_rating}⭐ <br />
            Services: <span dangerouslySetInnerHTML={{ __html: f.services ?? '' }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
