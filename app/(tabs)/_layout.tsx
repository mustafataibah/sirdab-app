import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const UserTabs = () => (
  <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary, tabBarLabelStyle: { fontFamily: "sf-b" } }}>
    <Tabs.Screen
      name="explore"
      options={{
        tabBarLabel: "Explore",
        tabBarIcon: ({ color, size }) => <Feather name="search" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="trips"
      options={{
        tabBarLabel: "Trips",
        tabBarIcon: ({ color, size }) => <Feather name="activity" color={color} size={size} />,
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
      }}
    />
  </Tabs>
);

export default UserTabs;
