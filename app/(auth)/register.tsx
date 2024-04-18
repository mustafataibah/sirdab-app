import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";

const Register = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isLoaded, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    if (!isLoaded) return;

    if (isManager && managerPassword !== process.env.EXPO_PUBLIC_MANAGER_PASSWORD) {
      Alert.alert("Invalid admin password");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ emailAddress, password, isManager }),
      });
      const data = await response.json();

      if (response.ok) {
        const completeSignIn = await signIn?.create({
          identifier: emailAddress,
          password,
        });

        if (completeSignIn?.status !== "complete") {
          Alert.alert("Failed to sign in");
        }

        if (completeSignIn?.status === "complete") {
          await setActive({ session: completeSignIn.createdSessionId });
          if (isManager) {
            router.navigate("/(managerTabs)/users");
          } else {
            router.navigate("/(tabs)/explore");
          }
        }
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      Alert.alert("Registration error, please try again later");
    }
    setLoading(false);
  };

  const handleScreenTap = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View className="flex-1 flex flex-col">
        <View className="bg-blue-500 absolute h-[200px] w-full">
          <View className="flex flex-row items-end pb-[30px] px-5 gap-10 h-full">
            <TouchableOpacity onPress={() => router.navigate("(auth)/login")}>
              <Text className="text-white text-xl font-semibold">Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-white text-3xl font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="mt-[150px] bg-white h-full rounded-l-[50px] flex-1 flex items-center justify-center">
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
            {isManager && (
              <TextInput
                autoCapitalize="none"
                onChangeText={setManagerPassword}
                value={managerPassword}
                secureTextEntry={true}
                placeholder="Admin Password"
                className="h-[44px] border border-neutral-300 rounded-lg bg-white p-3 mb-[25px] shadow-sm focus:border-black"
              />
            )}

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
    </TouchableWithoutFeedback>
  );
};

export default Register;
