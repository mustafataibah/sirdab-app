import React, { useLayoutEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { SlideInDown } from "react-native-reanimated";
import bike from "@/assets/data.json";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";

const Listing = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = (bike as any[]).find((item) => item.id === id);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Animated.ScrollView>
        <Animated.Image source={require("@/assets/images/bikeimage.png")} className="h-[300px] w-full" />
        <TouchableOpacity>
          <Text>Book Now</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
      <Animated.View
        className="absolute h-[100px] bottom-0 left-0 right-0 bg-white py-[10px] px-[20px] border-t border-gray-200"
        entering={SlideInDown.delay(200)}>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg">test</Text>
          <TouchableOpacity className="py-3 px-5 bg-red-500 rounded-lg">
            <Text className="text-lg text-white font-semibold">Button</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Listing;
