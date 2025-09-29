"use client";

import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

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

export default function HomePage() {
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const query = new URLSearchParams({ zip, city, state }).toString();
      const res = await fetch(`http://13.61.57.246:5000/api/facilities/with-reviews?${query}`);
      const result = await res.json();
      console.log("Fetched facilities:", result);
      setFacilities(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Nursing Home Finder</h1>

      {/* Search Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Zip"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Loading..." : "Search"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {/* Results */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((f: Facility, index: number) => (
          <div key={index} className="border rounded-lg shadow-md bg-white p-5">
            <h2 className="text-xl font-semibold">{f.name}</h2>
            <p className="text-gray-600">
              {f.address}, {f.city}, {f.state} {f.zip}
            </p>
            <p className="text-gray-500 text-sm">📞 {f.phone}</p>
            <p className="mt-1 font-medium">⭐ Rating: {f.rating}</p>

            {/* AI Summary */}
            {f.aiSummary && (
              <div className="mt-3">
                <p className="text-gray-700">
                  <strong>Summary:</strong> {f.aiSummary.summary}
                </p>

                <div className="mt-2">
                  <strong>Pros:</strong>
                  <ul className="list-disc ml-6 text-green-700">
                    {f.aiSummary.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2">
                  <strong>Cons:</strong>
                  <ul className="list-disc ml-6 text-red-700">
                    {f.aiSummary.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Google Photo */}
            {f.photo && (
              <div className="mt-3">
                <img
                  src={f.photo}
                  alt={`${f.name} photo`}
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Google Map */}
            {isLoaded && f.lat && f.lng && (
              <div className="mt-4 h-48 w-full">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{ lat: f.lat, lng: f.lng }}
                  zoom={14}
                >
                  <Marker position={{ lat: f.lat, lng: f.lng }} />
                </GoogleMap>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
