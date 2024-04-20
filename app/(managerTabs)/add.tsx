import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

interface Bicycle {
  model: string;
  color: string;
  location: string;
}

const AddBicycle = () => {
  const [bicycle, setBicycle] = useState<Bicycle>({
    model: "",
    color: "",
    location: "",
  });

  const models = [
    { label: "Mountain Bike", value: "Mountain Bike" },
    { label: "Road Bike", value: "Road Bike" },
    { label: "Hybrid Bike", value: "Hybrid Bike" },
    { label: "Electric Bike", value: "Electric Bike" },
  ];
  const colors = [
    { label: "Red", value: "Red" },
    { label: "Blue", value: "Blue" },
    { label: "Green", value: "Green" },
    { label: "Black", value: "Black" },
  ];

  const locations = [
    { label: "Khobar", value: "Khobar" },
    { label: "Riyadh", value: "Riyadh" },
    { label: "Jeddah", value: "Jeddah" },
  ];

  const handleAddBicycle = async () => {
    if (!bicycle.model || !bicycle.color || !bicycle.location) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await fetch("http://localhost:3000/admin/addBicycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bicycle,
          ratings: [],
          isAvailable: true,
        }),
      });
    } catch (error) {
      console.error("Failed to add bicycle:", error);
      Alert.alert("Error", "Failed to add bicycle.");
    } finally {
      setBicycle({ model: "", color: "", location: "" });
      router.navigate("/(managerTabs)/bicycles");
    }
  };

  return (
    <View className="flex-1 p-[20px] bg-[#f5f5f5]">
      <Text className="text-[16px] text-black mb-[5px]">Model:</Text>
      <SelectList
        setSelected={(value: string) => setBicycle((bicycle) => ({ ...bicycle, model: value }))}
        save="value"
        data={models}
      />
      <Text className="text-[16px] text-black mb-[5px]">Color:</Text>
      <SelectList
        setSelected={(value: string) => setBicycle((bicycle) => ({ ...bicycle, color: value }))}
        save="value"
        data={colors}
      />
      <Text className="text-[16px] text-black mb-[5px]">Location:</Text>
      <SelectList
        setSelected={(value: string) => setBicycle((bicycle) => ({ ...bicycle, location: value }))}
        save="value"
        data={locations}
      />
      <View className="mt-[20px]">
        <Button title="Add Bicycle" onPress={handleAddBicycle} />
      </View>
    </View>
  );
};

export default AddBicycle;
