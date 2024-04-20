import React, { useLayoutEffect, useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated from "react-native-reanimated";
import { SlideInDown } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useBicycles } from "@/app/context/BicycleContext";
import { SelectList } from "react-native-dropdown-select-list";
import Colors from "@/constants/Colors";
import DatePicker from "react-native-modern-datepicker";

// I apologize for this long code, there could be a lot of abstractions and dividing it into components
// but there is not enough time to worry about clean code, I do understand the importance I just wanted to let you
// know that I am aware of it

// For a summmary abou this file, its a page that show the bicycle data and allows user to CRUD it, managers can delete
// and update the bicycle or view who booked it and when, users can either book the bicycle cancel reservation and rate it

// interface for bicycle and user data
interface Bicycle {
  model: string;
  color: string;
  location: string;
  isAvailable: boolean | undefined;
  ratings: [];
}

interface User {
  currentBookings?: { bicycleId: string }[];
  pastTrips?: { bicycleId: string }[];
}

const Listing: React.FC = () => {
  const today = new Date().toISOString().substring(0, 10); // get today's date for the datepicker
  const [date, setDate] = useState<string>(""); // date for booking
  const { getBicycleById } = useBicycles(); // get bicycle data from the context
  const [dbUser, setDbUser] = useState<User>({}); // user data from the database
  const { id } = useLocalSearchParams<{ id: string }>(); // get bicycle id from the url params through
  const bicycle = getBicycleById(id); // get the bicycle data from the context
  const navigation = useNavigation(); // navigation hook
  const [editedBicycle, setEditedBicycle] = useState<Bicycle>({
    // state to check if the bicycle is edited and pass it to the database
    model: "",
    color: "",
    location: "",
    isAvailable: bicycle?.isAvailable,
    ratings: [],
  });
  const { user } = useUser();
  const { userId } = useAuth();

  const [userRating, setUserRating] = useState(""); // user rating for the bicycle
  const [, setNeedsRepair] = useState<string>(""); // if the bicycle needs repair

  // data for the select lists
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

  const rating = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
  ];

  const repair = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  // small error handling if the bicycle is not found
  if (!bicycle) {
    return <Text>Bicycle not found</Text>;
  }

  // set the back button in the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-white rounded-full p-2 shadow-lg border border-neutral-300">
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  // fetch the user data from the database
  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/fetchTrips?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user = await response.json();

      setDbUser(user);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  // fetch the user data when the component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  // update the bicycle data in the database for managers
  const handleUpdateBicycle = async () => {
    if (
      editedBicycle.model === bicycle.model &&
      editedBicycle.color === editedBicycle.color &&
      editedBicycle.location === bicycle.location &&
      editedBicycle.isAvailable === bicycle.isAvailable
    ) {
      Alert.alert("You must change at least one field to update the bicycle.");
      return;
    }
    try {
      await fetch("http://localhost:3000/admin/updateBicycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedBicycle,
          id: bicycle.id,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      navigation.goBack();
    }
  };

  // delete the bicycle from the database for managers
  const handleDelete = async () => {
    try {
      await fetch("http://localhost:3000/admin/deleteBicycle", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: bicycle.id,
        }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      navigation.goBack();
    }
  };

  // book the bicycle for users
  const handleBooking = async () => {
    console.log("booking", bicycle.id, user?.id, date);
    try {
      const response = await fetch("http://localhost:3000/api/bookBicycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bicycleId: bicycle.id,
          userId: user?.id,
          date: date,
        }),
      });
      if (response.ok) {
        navigation.goBack();
      } else {
        throw new Error("Failed to book bicycle");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to book bicycle");
      console.error(error);
    }
  };

  // cancel the booking for users
  const handleCancelBooking = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cancelBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bicycleId: bicycle.id,
          userId: user?.id,
        }),
      });
      if (response.ok) {
        navigation.goBack();
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to cancel booking");
      console.error(error);
    }
  };

  // submit the rating for users
  const handleSubmitRating = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/rateBicycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bicycleId: bicycle.id,
          userId: user?.id,
          rating: parseInt(userRating),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      Alert.alert("Success", "Rating submitted successfully");
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  // handle the date change for booking
  const handleDateChange = (date: string) => {
    if (date <= today) {
      Alert.alert("Invalid Date", "Please select a future date");
      return;
    }
    setDate(date);
  };

  // check if the user has already booked the bicycle or if the booking is finished and the user has not rated the bicycle
  const alreadyBooked = dbUser.currentBookings?.some((booking) => booking.bicycleId === bicycle.id);
  const finishedBooking = dbUser.pastTrips?.some((trip) => trip.bicycleId === bicycle.id);
  const hasUserRated = bicycle.ratings.some((rating: any) => rating.userId === userId);

  // if the booking is finished and the user has not rated the bicycle show the rating form
  if (finishedBooking && !hasUserRated) {
    return (
      <View className="flex-1 bg-white">
        <Animated.ScrollView>
          <View className="flex-1 items-center justify-center py-20 bg-blue-200">
            <Animated.Image source={require("@/assets/images/bikeimage.png")} className="w-[300px]" />
          </View>
          <View className="flex-1 p-4">
            <Text className="font-semibold text-lg text-center">Thanks for booking with us, please rate the Bike!</Text>
            <SelectList setSelected={(value: string) => setUserRating(value)} save="value" data={rating} />
            <Text className="font-semibold text-lg text-center">Does the bike need repair?</Text>
            <SelectList setSelected={(value: string) => setNeedsRepair(value)} save="value" data={repair} />
            <Button title="Submit" onPress={handleSubmitRating} />
          </View>
        </Animated.ScrollView>
      </View>
    );
  } else if (finishedBooking && hasUserRated) {
    // if the booking is finished and the user has rated the bicycle show a thank you message
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Thanks for rating this bicycle</Text>
        <Text> Book again</Text>
      </View>
    );
  }

  // if the user is a manager show the bicycle data and allow CRUD operations
  if (user?.publicMetadata?.isManager) {
    return (
      <View className="flex-1 bg-white">
        <Animated.ScrollView>
          <View className="flex-1 items-center justify-center py-20 bg-blue-200">
            <Animated.Image source={require("@/assets/images/bikeimage.png")} className="w-[300px]" />
          </View>
          <Text className="font-bold text-xl">Manage Bike</Text>
          <SelectList
            setSelected={(value: string) => setEditedBicycle((bicycle) => ({ ...bicycle, model: value }))}
            save="value"
            data={models}
            defaultOption={{ key: "model", value: bicycle.model }}
          />

          <Text>Color:</Text>
          <SelectList
            setSelected={(value: string) => setEditedBicycle((bicycle) => ({ ...bicycle, color: value }))}
            save="value"
            data={colors}
            defaultOption={{ key: "color", value: bicycle.color }}
          />

          <Text>Location:</Text>
          <SelectList
            setSelected={(value: string) => setEditedBicycle((bicycle) => ({ ...bicycle, location: value }))}
            save="value"
            data={locations}
            defaultOption={{ key: "location", value: bicycle.location }}
          />
          <Text>Available</Text>
          {editedBicycle.isAvailable ? (
            <TouchableOpacity onPress={() => setEditedBicycle((bicycle) => ({ ...bicycle, isAvailable: false }))}>
              <Text>Press to change availability to No</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditedBicycle((bicycle) => ({ ...bicycle, isAvailable: true }))}>
              <Text>Press to change availability to Yes</Text>
            </TouchableOpacity>
          )}
          <Text>Rating:</Text>
          <Text>{bicycle.averageRating}</Text>
          <Text>Needs Repair: {bicycle.needsRepair}</Text>

          <View className="mt-5">
            {bicycle.currentUid && <Text className="font-bold text-lg"> Currently Booked By </Text>}
            {bicycle.currentUid && (
              <Text>
                {bicycle.currentUid} at {bicycle.currentBookingDate}
              </Text>
            )}
            <Text className="font-bold text-lg"> Past Bookings </Text>
            {bicycle.pastBookings.map((booking) => (
              <Text>
                {booking.userId} booked at {booking.date}
              </Text>
            ))}
          </View>
        </Animated.ScrollView>
        <Animated.View
          className="absolute h-[100px] bottom-0 left-0 right-0 bg-white py-[10px] px-[20px] border-t border-gray-200"
          entering={SlideInDown.delay(200)}>
          <View className="flex flex-row justify-between items-center">
            <TouchableOpacity className="py-3 px-5 bg-red-500 rounded-lg" onPress={handleDelete}>
              <Text className="text-lg text-white font-semibold">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 px-5 bg-blue-500 rounded-lg ml-auto" onPress={handleUpdateBicycle}>
              <Text className="text-lg text-white font-semibold">Update</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  } else {
    // if the user is not a manager show the booking form
    return (
      <View className="flex-1 bg-white">
        <Animated.ScrollView>
          <View className="flex-1 items-center justify-center py-20 bg-blue-200">
            <Animated.Image source={require("@/assets/images/bikeimage.png")} className="w-[300px]" />
          </View>
          {alreadyBooked ? (
            <Text className="text-xl font-bold">Already Booked</Text>
          ) : (
            <View className="flex-1 justify-center items-center pb-[100px]">
              <Text className="text-xl font-bold mt-5">Book Now</Text>
              <Text className="text-lg font-semibold mt-5">Model: {bicycle.model}</Text>
              <Text className="text-lg font-semibold">Color: {bicycle.color}</Text>
              <Text className="text-lg font-semibold">Location: {bicycle.location}</Text>
              <DatePicker
                options={{
                  defaultFont: "sf",
                  headerFont: "sf-sb",
                  mainColor: Colors.primary,
                  borderColor: "transparent",
                }}
                current={today}
                selected={date}
                mode={"calendar"}
                onSelectedChange={handleDateChange}
              />
            </View>
          )}
        </Animated.ScrollView>
        <Animated.View
          className="absolute h-[100px] bottom-0 left-0 right-0 bg-white py-[10px] px-[20px] border-t border-gray-200"
          entering={SlideInDown.delay(200)}>
          <View className="flex flex-row justify-between items-center">
            {alreadyBooked ? (
              <TouchableOpacity className="py-3 px-5 bg-blue-500 rounded-lg ml-auto" onPress={handleCancelBooking}>
                <Text className="text-lg text-white font-semibold">Cancel Booking</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="py-3 px-5 bg-blue-500 rounded-lg ml-auto" onPress={handleBooking}>
                <Text className="text-lg text-white font-semibold">Book</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    );
  }
};

export default Listing;
