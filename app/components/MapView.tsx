
import React, { useMemo } from 'react';
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
  locationName: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapView: React.FC<MapViewProps> = ({
  facilities,
  centerCoords,
  googleMapsApiKey,
  locationName,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: ['places'],
  });

  const customRedIcon = useMemo(() => {
    if (!window.google?.maps) return undefined;

    return {
      url: '/icons/red_hospital_pin.png',
      scaledSize: new window.google.maps.Size(37, 48),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(18.5, 48),
    };
  }, []);

  const center = useMemo(() => centerCoords, [centerCoords]);

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

  if (loadError)
    return (
      <div className="p-4 text-red-600">
        Error loading map: {loadError.message}
      </div>
    );
  if (!isLoaded) return <div className="p-4 text-center">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={mapOptions}
    >
      {/* Facility markers */}
      {facilities.map((facility, index) => (
        <MarkerF
          key={index}
          position={{ lat: facility.lat, lng: facility.lng }}
          title={facility.name}
          icon={customRedIcon}
        />
      ))}

      {/* ✅ Center marker now also uses the same custom icon */}
      <MarkerF
        position={center}
        title={locationName || 'Search Center'}
        icon={customRedIcon}
      />
    </GoogleMap>
  );
};

export default MapView;
