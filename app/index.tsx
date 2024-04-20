import React from "react";
import { View, Text } from "react-native";

// Basic splash screen
// Displays for a second then the useffect in the _layout.tsx file hides it
const App = () => {
  return (
    <View className="w-screen h-screen bg-blue-500 justify-center items-center">
      <Text className="text-white font-bold text-[40px]">Sirdab Bike App</Text>
    </View>
  );
};

export default App;
