import React from "react";
import { Text, View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import DatePicker from "react-native-modern-datepicker";
import Colors from "@/constants/Colors";
import { useData } from "@/app/context/DataContext";
import { useNavigation } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";

// Data for the select lists
const models = [
  { label: "All Models", value: "All Models" },
  { label: "Mountain Bike", value: "Mountain Bike" },
  { label: "Road Bike", value: "Road Bike" },
  { label: "Hybrid Bike", value: "Hybrid Bike" },
  { label: "Electric Bike", value: "Electric Bike" },
];

const locations = [
  { label: "All Locations", value: "All Locations" },
  { label: "Khobar", value: "Khobar" },
  { label: "Riyadh", value: "Riyadh" },
  { label: "Jeddah", value: "Jeddah" },
];

const ratings = [
  { label: "All Ratings", value: 0 },
  { label: "1 Star", value: 1 },
  { label: "2 Stars", value: 2 },
  { label: "3 Stars", value: 3 },
  { label: "4 Stars", value: 4 },
  { label: "5 Stars", value: 5 },
];

// Filter component that allows user to filter bicycles
const Filter = () => {
  // set the datepicker to today
  const today = new Date().toISOString().substring(0, 10);
  // grab the filters and functions from the context
  const { setSelectedDate, selectedDate, setSelectedModel, setSelectedLocation, setSelectedRating } = useData();
  const navigation = useNavigation();

  // handler for date changes from the datepicker component
  const handleDateChange = (date: string) => {
    if (date <= today) {
      Alert.alert("Invalid Date", "Please select a future date");
      return;
    }
    setSelectedDate(date);
  };

  // handler to reset filters using the context functions
  const handleResetFilters = () => {
    setSelectedDate(today);
    setSelectedModel("All Models");
    setSelectedLocation("All Locations");
    setSelectedRating(0);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white rounded-lg shadow-sm px-3 gap-4 pt-5">
        <View>
          <Text className="text-lg text-center text-gray-500">Select a date to see the available bicycles</Text>
          <DatePicker
            options={{
              defaultFont: "sf",
              headerFont: "sf-sb",
              mainColor: Colors.primary,
              borderColor: "transparent",
            }}
            current={today}
            selected={selectedDate}
            mode={"calendar"}
            onSelectedChange={handleDateChange}
          />
        </View>
        <View>
          <Text>Model:</Text>
          <SelectList setSelected={setSelectedModel} save="value" data={models} />
        </View>
        <View>
          <Text>Location:</Text>
          <SelectList setSelected={setSelectedLocation} save="value" data={locations} />
        </View>
        <View className="mb-[200px]">
          <Text>Rating:</Text>
          <SelectList setSelected={(value: number) => setSelectedRating(value)} save="value" data={ratings} />
        </View>
      </ScrollView>
      <View className="absolute h-[100px] bottom-0 left-0 right-0 bg-white py-[10px] px-[20px] border-t border-gray-200">
        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity className="py-3 px-5 bg-blue-500 rounded-lg flex flex-row" onPress={handleResetFilters}>
            <Text className="text-lg text-white font-semibold">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-5 bg-blue-500 rounded-lg ml-auto flex flex-row"
            onPress={() => navigation.goBack()}>
            <Feather name="search" size={24} color="white" />
            <Text className="text-lg text-white font-semibold">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Filter;
