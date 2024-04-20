import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// BicycleContext to manage bicycle data accross the app
// The context provides the bicycles state, fetchBicycles function to fetch bicycles from the server

interface Bicycle {
  id: string;
  model: string;
  color: string;
  location: string;
  averageRating: number;
  ratings: { userId: string; rating: number }[];
  pastBookings: { userId: string; date: string }[];
  currentUid: string;
  currentBookingDate: string;
  needsRepair: string;
  createdAt: Date;
  isAvailable: boolean | undefined;
}

interface BicycleContextType {
  bicycles: Bicycle[];
  fetchBicycles: () => Promise<void>;
  addBicycle: (bicycle: Bicycle) => void;
  getBicycleById: (id: string) => Bicycle | undefined;
}

const BicycleContext = createContext<BicycleContextType | undefined>(undefined);

// custom hook to use the BisycleContext within a provider
export const useBicycles = () => {
  const context = useContext(BicycleContext);
  if (!context) {
    throw new Error("useBicycles must be used within a BicycleProvider");
  }
  return context;
};

// Provider component that manages the bicycle data and provides it to child components (the app)
export const BicycleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bicycles, setBicycles] = useState<Bicycle[]>([]);

  // async call to fetch bicycles from the server
  const fetchBicycles = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/fetchBicycles");
      const data = await response.json();
      setBicycles(data);
    } catch (error) {
      console.error("Failed to fetch bicycles:", error);
    }
  };

  // function to add a bicycle to the bicycles state
  const addBicycle = (bicycle: Bicycle) => {
    setBicycles([...bicycles, bicycle]);
  };

  // function to get a bicycle by id
  const getBicycleById = (id: string) => {
    return bicycles.find((b) => b.id === id);
  };

  // effect hook to fetch bicycles on mount
  useEffect(() => {
    fetchBicycles();
  }, []);

  // provide context to children
  return (
    <BicycleContext.Provider value={{ bicycles, fetchBicycles, addBicycle, getBicycleById }}>
      {children}
    </BicycleContext.Provider>
  );
};
