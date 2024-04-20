import React, { useCallback, useState } from "react";
import { View } from "react-native";
import Card from "@/components/Card";
import { useFocusEffect } from "expo-router";
import { useBicycles } from "@/app/context/BicycleContext";

const Bicycles = () => {
  const { bicycles, fetchBicycles } = useBicycles();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchBicycles();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBicycles();
    setRefreshing(false);
  };

  return (
    <View className="flex-1">
      <Card listings={bicycles} onRefresh={handleRefresh} refreshing={refreshing} color={"Any"} />
    </View>
  );
};

export default Bicycles;
