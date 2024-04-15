import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

const Listing = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Listing</Text>
    </View>
  );
};

export default Listing;
