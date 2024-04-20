import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

// Basic component to allow admin to create a new user (appears as a modal instead of navigating to (auth)/register)
const CreateUser = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useSignUp();

  const router = useRouter();

  // function to handle sign up of a new user
  const handleSignUp = async () => {
    setLoading(true);
    if (!isLoaded) return;

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ emailAddress, password, isManager }),
      });

      // if successful go back (only accessible from (managerTabs)/users so no need for checking user type or navigation.goBack())
      if (response.status === 200) {
        Alert.alert("User created successfully");
        router.navigate("(managerTabs)/users");
      }
    } catch (error) {
      Alert.alert("Registration error, please try again later");
    }
    setLoading(false);
  };

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="bg-white h-full flex-1 flex items-center justify-center">
        <View className="flex flex-col gap-[16px] p-5 w-full">
          <View className="flex flex-row justify-center items-center p-6 gap-3">
            <Text className="text-gray-500 text-md font-medium">User</Text>
            <Switch
              trackColor={{ false: "#ffffff", true: "#1a1a1a" }}
              thumbColor={isManager ? "#3b83f6" : "#ffffff"}
              ios_backgroundColor="#1a1a1a"
              onValueChange={() => setIsManager((previousState) => !previousState)}
              value={isManager}
            />
            <Text className="text-gray-500 text-md font-medium">Admin</Text>
          </View>
          <TextInput
            autoCapitalize="none"
            onChangeText={setEmailAddress}
            value={emailAddress}
            placeholder="Email"
            className="h-[44px] border border-neutral-300 rounded-lg bg-white p-3 shadow-sm focus:border-black"
          />
          <TextInput
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            className="h-[44px] border border-neutral-300 rounded-lg bg-white p-3 shadow-sm focus:border-black"
          />

          <TouchableOpacity
            className="bg-blue-500 rounded-full py-4 justify-center items-center shadow-lg"
            onPress={handleSignUp}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-[16px]">Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateUser;
