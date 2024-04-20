import React, { useRef, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

// colors array to display in the header
const colors = ["Any", "Red", "Green", "Blue", "Black", "White"];

interface Props {
  onColorChanged: (category: string) => void;
}

// header for search bar which gives access to the filters modal and color selection
const Header = ({ onColorChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null); // ref for the ScrollView for colors component
  const [activeIndex, setActiveIndex] = useState(0); // state to track the active color index
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]); // ref for the colors

  // function to select the color and scroll to the selected color
  const selectColor = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
    onColorChanged(colors[index]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="h-[200px] bg-white shadow-md pt-[100px] top-[-100px]">
        <View className="flex-row items-center justify-center px-6 pb-4">
          <Link href={"/(modals)/filter"} asChild>
            <TouchableOpacity>
              <View className="w-[300px] bg-white flex-row p-[14px] items-center border border-neutral-300 shadow-lg rounded-full">
                <Ionicons name="search" size={24} />
                <View>
                  <Text className="font-semibold">Search</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 50,
            paddingHorizontal: 16,
          }}>
          {colors.map((item, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              className={`${
                activeIndex === index
                  ? "flex-1 items-center justify-center border-b-2 pb-[8px] border-black"
                  : "flex-1 items-center justify-center pb-[8px]"
              }`}
              onPress={() => selectColor(index)}>
              <Text
                className={`${
                  activeIndex === index
                    ? "text-[14px] font-semibold text-black"
                    : "text-[14px] font-semibold text-neutral-500"
                } `}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Header;
