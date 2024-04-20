import React from "react";
import { Stack } from "expo-router";

// layout component that sets up navigation for auth screens
const Layout = () => (
  <Stack>
    <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    <Stack.Screen name="register" options={{ headerShown: false }} />
    <Stack.Screen name="login" options={{ headerShown: false }} />
  </Stack>
);

export default Layout;
