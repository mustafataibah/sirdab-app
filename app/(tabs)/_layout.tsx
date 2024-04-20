import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

// UserTabs component that sets up the tab navigator for the user
const UserTabs = () => (
  <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary, tabBarLabelStyle: { fontFamily: "sf-b" } }}>
    <Tabs.Screen
      name="explore"
      options={{
        tabBarLabel: "Explore", // Label under the icon
        tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="trips"
      options={{
        headerTitle: "Trips", // Title for nav header
        tabBarLabel: "Trips",
        tabBarIcon: ({ color, size }) => <Feather name="triangle" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        headerTitle: "Profile",
        tabBarLabel: "Profile",
        tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
      }}
    />
  </Tabs>
);

export default UserTabs;
