// // app/components/MapView.tsx

// import React, { useMemo } from "react";
// import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

// interface FacilityCoord {
//   lat: number;
//   lng: number;
//   name: string;
// }

// interface MapViewProps {
//   facilities: FacilityCoord[];
//   centerCoords: { lat: number; lng: number };
//   googleMapsApiKey: string;
//   locationName: string;
// }

// const containerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const MapView: React.FC<MapViewProps> = ({
//   facilities,
//   centerCoords,
//   googleMapsApiKey,
//   locationName,
// }) => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: googleMapsApiKey,
//     libraries: ["places"],
//   });

//   // ✅ Hooks run unconditionally
//   const customRedIcon = useMemo(() => {
//     if (!window.google?.maps) return undefined;
//     return {
//       url: "/icons/red_hospital_pin.png",
//       scaledSize: new window.google.maps.Size(37, 48),
//       origin: new window.google.maps.Point(0, 0),
//       anchor: new window.google.maps.Point(18.5, 48),
//     };
//   }, []);

//   const center = useMemo(() => centerCoords, [centerCoords]);
//   const mapOptions = useMemo(
//     () => ({
//       disableDefaultUI: false,
//       zoomControl: true,
//       streetViewControl: false,
//       mapTypeControl: false,
//       fullscreenControl: false,
//     }),
//     []
//   );

//   // ✅ Return JSX after hooks
//   if (loadError) {
//     return (
//       <div className="p-4 text-red-600">
//         Error loading map: {loadError.message}
//       </div>
//     );
//   }

//   return (
//     <>
//       {!isLoaded ? (
//         <div className="p-4 text-center">Loading Map...</div>
//       ) : (
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={center}
//           zoom={12}
//           options={mapOptions}
//         >
//           {facilities.map((facility, index) => (
//             <MarkerF
//               key={index}
//               position={{ lat: facility.lat, lng: facility.lng }}
//               title={facility.name}
//               icon={customRedIcon}
//             />
//           ))}

//           <MarkerF
//             position={center}
//             title={locationName || "Search Center"}
//           />
//         </GoogleMap>
//       )}
//     </>
//   );
// };

// export default MapView;
import React, { useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

interface FacilityCoord {
  lat: number;
  lng: number;
  name: string;
}

interface MapViewProps {
  facilities: FacilityCoord[];
  centerCoords: { lat: number; lng: number };
  googleMapsApiKey: string;
  markerIconUrl?: string;
  locationName?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapView: React.FC<MapViewProps> = ({
  facilities,
  centerCoords,
  googleMapsApiKey,
  markerIconUrl = '/icons/red_hospital_pin.png',
  locationName,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ['places'],
  });

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }),
    []
  );

  const icon = useMemo(() => {
    if (!window.google?.maps) return undefined;
    return {
      url: markerIconUrl,
      scaledSize: new window.google.maps.Size(37, 48),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(18.5, 48),
    };
  }, [markerIconUrl]);

  /** Fit map to all markers on load */
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (facilities.length === 0) {
        map.setCenter(centerCoords);
        map.setZoom(12);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      facilities.forEach((f) => bounds.extend({ lat: f.lat, lng: f.lng }));
      map.fitBounds(bounds);
    },
    [facilities, centerCoords]
  );

  if (loadError) return <div>Error loading map: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Map…</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={centerCoords}
      zoom={12}
      options={mapOptions}
      onLoad={onMapLoad} // <— fit bounds here
    >
      {facilities.map((facility, index) => (
        <MarkerF
          key={index}
          position={{ lat: facility.lat, lng: facility.lng }}
          title={facility.name}
          icon={icon}
        />
      ))}

      {/* Optionally show a marker for the search center */}
      <MarkerF position={centerCoords} title={locationName || 'Search Center'} />
    </GoogleMap>
  );
};

export default MapView;
