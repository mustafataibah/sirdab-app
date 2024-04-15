import React from "react";
import { Button, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const Profile = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.navigate("(auth)/login");
  };

  return (
    <View>
      <Button title="Log out" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;
