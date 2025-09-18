"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
interface Coords {
  lat: number;
  lon: number;
}

interface FacilitiesContextType {
  facilities: any[];
  setFacilities: React.Dispatch<React.SetStateAction<any[]>>;
  coords: Coords | null;
  setCoords: React.Dispatch<React.SetStateAction<Coords | null>>;
  locationName: string;
  setLocationName: React.Dispatch<React.SetStateAction<string>>;
}

// Default value
const FacilitiesContext = createContext<FacilitiesContextType | undefined>(
  undefined
);

interface FacilitiesProviderProps {
  children: ReactNode;
}

export const FacilitiesProvider: React.FC<FacilitiesProviderProps> = ({
  children,
}) => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locationName, setLocationName] = useState<string>("");

  return (
    <FacilitiesContext.Provider
      value={{
        facilities,
        setFacilities,
        coords,
        setCoords,
        locationName,
        setLocationName,
      }}
    >
      {children}
    </FacilitiesContext.Provider>
  );
};

export const useFacilities = (): FacilitiesContextType => {
  const context = useContext(FacilitiesContext);
  if (context === undefined) {
    throw new Error("useFacilities must be used within a FacilitiesProvider");
  }
  return context;
};
