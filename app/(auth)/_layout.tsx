import React from "react";
import { Stack } from "expo-router";

const Layout = () => (
  <Stack>
    <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    <Stack.Screen name="register" options={{ headerShown: false }} />
    <Stack.Screen name="login" options={{ headerShown: false }} />
  </Stack>
);

export default Layout;
