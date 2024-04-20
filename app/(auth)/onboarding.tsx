import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View, SafeAreaView, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Feather } from "@expo/vector-icons";

// static onboarding steps data
const onboardingSteps = [
  {
    title: "Welcome",
    description: "Welcome to the app! Let's get started.",
  },
  {
    title: "Book a bicycle",
    description: "Book a bicycle for your next adventure.",
  },
  {
    title: "Enjoy your ride",
    description: "Enjoy your ride and have fun!",
  },
];

export default function Onboarding() {
  const [screenIndex, setScreenIndex] = useState(0); // state to track the current onboarding screen
  const data = onboardingSteps[screenIndex]; // data for current screen

  // function to handle the continue button
  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  // function to skip onboarding and navigate to the register screen
  const endOnboarding = async () => {
    try {
      await SecureStore.setItemAsync("onboardingComplete", "true");
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
    }
    setScreenIndex(0);
    router.navigate("(auth)/register");
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-blue-500">
      <View className="flex-row gap-[8px] mx-[15px]">
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            className={`flex-1 h-[3px] rounded-[10px] ${index === screenIndex ? "bg-[#CEF202]" : "bg-[#1a1a1a]"}`}
          />
        ))}
      </View>
      <View className="flex-1 justify-center items-center">
        <Feather name={"star"} size={100} color="white" />
        <Text className="text-[20px] font-bold text-white">{data.title}</Text>
        <Text className="text-[16px] text-white">{data.description}</Text>
      </View>
      <View className="p-[20px flex-1">
        <View className="mt-auto">
          <View className="mt-[20px] flex flex-row items-center gap-[20px]">
            <Text
              onPress={endOnboarding}
              className="text-[16px] p-[15px] px-[25px] rounded-[50px] font-bold text-white">
              Skip
            </Text>
            <Pressable onPress={onContinue} className="flex-1 items-center rounded-full bg-[#1a1a1a]">
              <Text className="text-[16px] p-[15px] px-[25px] rounded-[50px] font-bold text-white">Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
