import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import Card from "@/components/Card";

const Explore = () => {
  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
      <Card />
    </View>
  );
};

export default Explore;
