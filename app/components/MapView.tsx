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

  /**
   * Create the custom marker icon *only after* Google Maps is loaded
   */
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
   * Fit all markers + center into the viewport
   */
  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (facilities.length === 0) {
        map.setCenter(centerCoords);
        map.setZoom(12);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(centerCoords);
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
      onLoad={onMapLoad}
    >
      {/* Facility markers */}
      {facilities.map((facility, index) => (
        <MarkerF
          key={index}
          position={{ lat: facility.lat, lng: facility.lng }}
          title={facility.name}
          icon={customMarkerIcon}
        />
      ))}

      {/* Center marker */}
      <MarkerF
        position={centerCoords}
        title={locationName || "Search Center"}
        icon={customMarkerIcon}
      />
    </GoogleMap>
  );
};

export default MapView;
