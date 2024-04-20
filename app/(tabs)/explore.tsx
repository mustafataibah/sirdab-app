import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { useBicycles } from "@/app/context/BicycleContext";

// Expllore component that serves as a view for showing available bicycles
const Explore = () => {
  const { bicycles, fetchBicycles } = useBicycles();
  const [refreshing, setRefreshing] = useState(false);
  const [color, setColor] = useState<string>("Any");

  // effect hook to fetch bicycles on mount
  useEffect(() => {
    fetchBicycles();
  }, []);

  // function to handle refreshing the bicycles
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBicycles();
    setRefreshing(false);
  };

  // function to update the color state for when the color changes when filtering
  const onDataChanged = (color: string) => {
    setColor(color);
  };

  return (
    <View className="flex-1 mt-[80px]">
      <Stack.Screen
        options={{
          header: () => <Header onColorChanged={onDataChanged} />,
        }}
      />
      <Card listings={bicycles} onRefresh={handleRefresh} refreshing={refreshing} color={color} />
    </View>
  );
};

export default Explore;
