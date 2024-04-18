import React, { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import Card from "@/components/Card";
import bike from "@/assets/data.json";

const Explore = () => {
  return (
    <View className="flex-1 mt-[80px]">
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <Card bike={bike} />
    </View>
  );
};

export default Explore;
