import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ClerkProvider, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    sf: require("../assets/fonts/SF-Pro-Display-Regular.otf"),
    "sf-sb": require("../assets/fonts/SF-Pro-Display-Semibold.otf"),
    "sf-b": require("../assets/fonts/SF-Pro-Display-Bold.otf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const { isLoaded, user, isSignedIn } = useUser();
  const [loaded, setLoaded] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Primative onboarding check
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await SecureStore.getItemAsync("onboardingComplete");
        if (onboardingStatus === "true") {
          setOnboardingComplete(false);
        }
      } catch (error) {
        console.error("Error retrieving onboarding status:", error);
      } finally {
        setLoaded(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  // TODO FIX THIS
  useEffect(() => {
    if (loaded && isLoaded && !isSignedIn && !onboardingComplete) {
      router.replace("/(auth)/onboarding");
    } else if (loaded && isLoaded && isSignedIn) {
      if (user?.publicMetadata?.isManager) {
        router.replace("/(managerTabs)/users");
      } else {
        router.replace("/(tabs)/explore");
      }
    } else if (loaded && isLoaded && onboardingComplete) {
      router.replace("/(auth)/register");
    }
  }, [loaded, isLoaded]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(managerTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: "", headerTransparent: true }} />
      <Stack.Screen
        name="(modals)/rental"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="chevron-left" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
