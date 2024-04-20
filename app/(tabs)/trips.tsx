import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import Card from "@/components/Card";
import { useAuth } from "@clerk/clerk-expo";
import { useBicycles } from "../context/BicycleContext";

interface User {
  currentBookings?: { bicycleId: string }[];
  pastTrips?: { bicycleId: string }[];
}

const Trips = () => {
  const [user, setUser] = useState<User>({}); // state to hold user data includng current bookings and past trips
  const [refreshing, setRefreshing] = useState(false); // state to manage refreshing
  const { userId } = useAuth();
  const { getBicycleById } = useBicycles(); // function from bicycle cntext to retrieve bicycle by id

  // Fetch user data including current bookings and past trips
  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/fetchTrips?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const user = await response.json(); // parse the response to json

      setUser(user);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  // Function to update the booking status of the user
  const updateBooking = async () => {
    try {
      await fetch("http://localhost:3000/api/updateBooking?", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  // Effect hook to fetch user data and update booking status on mount
  useEffect(() => {
    fetchUser();
    updateBooking();
  }, []);

  // Function to handle refreshing the user data
  const handleRefresh = () => {
    setRefreshing(true);
    fetchUser();
    setRefreshing(false);
  };

  // Map the current bookings and past trips to the bicycle data
  const currentBookings = user.currentBookings?.map((booking) => getBicycleById(booking.bicycleId)) || [];
  const pastTrips = user.pastTrips?.map((trip) => getBicycleById(trip.bicycleId)) || [];

  return (
    <View className="flex-1">
      <View className="flex-1 p-4">
        <Text className="font-bold text-xl">Current Bookings</Text>
        <Card listings={currentBookings} onRefresh={handleRefresh} refreshing={refreshing} color={"Any"} />
      </View>
      <View className="flex-1 p-4">
        <Text className="font-bold text-xl">Past Trips</Text>
        <Card listings={pastTrips} onRefresh={handleRefresh} refreshing={refreshing} color={"Any"} />
      </View>
    </View>
  );
};

export default Trips;
