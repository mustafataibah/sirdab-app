import React from "react";
import { SafeAreaView, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";

const Header = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-red-500 h-[120px]">
        <View className="flex flex-row justify-between items-center p-4">
          <Link href={"/(modals)/rental"}>Booking</Link>
          <TouchableOpacity className="rounded-full bg-white p-2">
            <Feather name="search" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;
