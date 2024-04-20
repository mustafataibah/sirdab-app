import React, { createContext, useContext, ReactNode, useState } from "react";

// DataContext to manage filtering data for the user
// I faced problems with passing props to the filter modal since I am using file based routing
// and since I am low on time I just decided to make a contet to manage the filtering data

interface DataContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDate must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // The data saved are the selected date, model, location and rating these are basically what the user can filter by
  // Default values are set so that the user can see all bicycles on the first render
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("All Models");
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [selectedRating, setSelectedRating] = useState(0);

  if (!selectedDate) {
    setSelectedDate(new Date().toISOString().substring(0, 10));
  }

  return (
    <DataContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedLocation,
        setSelectedLocation,
        selectedModel,
        setSelectedModel,
        selectedRating,
        setSelectedRating,
      }}>
      {children}
    </DataContext.Provider>
  );
};
