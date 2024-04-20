import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const ManagerTabs = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary, tabBarLabelStyle: { fontFamily: "sf-b" } }}>
      <Tabs.Screen
        name="users"
        options={{
          tabBarLabel: "Users",
          tabBarIcon: ({ color, size }) => <Feather name="users" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => <Feather name="plus" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bicycles"
        options={{
          tabBarLabel: "Bicycles",
          tabBarIcon: ({ color, size }) => <Feather name="database" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
};

export default ManagerTabs;
