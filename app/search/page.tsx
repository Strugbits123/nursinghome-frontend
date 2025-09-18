"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 39.8283, lng: -98.5795 }; // Center USA

export default function SearchPage() {
  const params = useSearchParams();
  const [facilities, setFacilities] = useState<any[]>([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    async function fetchFacilities() {
      const query = params.toString();
      const res = await fetch(`/api/facilities?${query}`);
      const data = await res.json();
      setFacilities(data.items || []);
    }
    fetchFacilities();
  }, [params]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Search Results</h1>

      {/* List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((f) => (
          <div key={f._id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{f.name}</h2>
            <p>{f.address}, {f.city}, {f.state} {f.zip}</p>
            <p>⭐ {f.cms_rating} | Beds: {f.beds}</p>
            <p className="text-sm text-gray-600">{f.ownership}</p>
          </div>
        ))}
      </div>

      {/* Map View */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={4}
          center={facilities.length ? 
            { lat: facilities[0].lat, lng: facilities[0].lng } : defaultCenter
          }
        >
          {facilities.map((f) => (
            <Marker key={f._id} position={{ lat: f.lat, lng: f.lng }} />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}