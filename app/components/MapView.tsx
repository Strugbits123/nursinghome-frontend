import React, { useMemo, useCallback } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

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
  width: "100%",
  height: "100%",
};

const MapView: React.FC<MapViewProps> = ({
  facilities,
  centerCoords,
  googleMapsApiKey,
  markerIconUrl = "/icons/red_hospital_pin.png",
  locationName,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
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

  const customMarkerIcon = useMemo(() => {
    if (!isLoaded || !window.google?.maps) return undefined;
    return {
      url: markerIconUrl,
      scaledSize: new window.google.maps.Size(37, 48),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(18.5, 48),
    };
  }, [markerIconUrl, isLoaded]);

  /**
   * Fit all markers from current page into viewport
   */
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      // If no facilities on current page, use center coords
      if (facilities.length === 0) {
        map.setCenter(centerCoords);
        map.setZoom(12);
        return;
      }

      // If only one facility, center on it with a good zoom level
      if (facilities.length === 1) {
        map.setCenter({ lat: facilities[0].lat, lng: facilities[0].lng });
        map.setZoom(14);
        return;
      }

      // For multiple facilities, fit bounds with padding
      const bounds = new window.google.maps.LatLngBounds();
      facilities.forEach((f) => bounds.extend({ lat: f.lat, lng: f.lng }));
      
      // Add some padding to ensure markers aren't at the very edge
      const padding = 50;
      map.fitBounds(bounds, padding);
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
      onLoad={onMapLoad}
    >
      {/* Show only facilities from current page */}
      {facilities.map((facility, index) => (
        <MarkerF
          key={`${facility.lat}-${facility.lng}-${index}`}
          position={{ lat: facility.lat, lng: facility.lng }}
          title={facility.name}
          icon={customMarkerIcon}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;