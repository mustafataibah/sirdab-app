import React from "react";
import { Button, View, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

// Proile component currently only allows user to log out
const Profile = () => {
  const { signOut } = useAuth();

  const router = useRouter();

  // Async function to handle sign out (async becuase of the signOut function from Clerk)
  const handleSignOut = async () => {
    try {
      await signOut();
      router.navigate("(auth)/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">Welcome</Text>
      <Button title="Log out" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;
