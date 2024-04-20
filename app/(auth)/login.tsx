import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn, useUser } from "@clerk/clerk-react";

// Basic login component
const Login = () => {
  // state hooks for form fields and loading
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  // effect hook to navigate to the correct screen based on user role
  useEffect(() => {
    if (isSignedIn) {
      if (user?.publicMetadata?.isManager) {
        router.navigate("/(managerTabs)/users");
      } else {
        router.navigate("/(tabs)/explore");
      }
    }
  }, [isSignedIn]);

  // handle log in using Clerk frotend API which creates the user and sets the session
  const handleSignIn = async () => {
    setLoading(true);
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
      }
    } catch (error: any) {
      Alert.alert("Failed to sign in");
    }
    setLoading(false);
  };

  // hides keyboard when screen is tapped
  const handleScreenTap = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View className="flex-1 flex flex-col">
        <View className="bg-blue-500 absolute h-[200px] w-full">
          <View className="flex flex-row items-end pb-[30px] px-5 gap-10 h-full">
            <TouchableOpacity>
              <Text className="text-white text-3xl font-semibold">Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("(auth)/register")}>
              <Text className="text-white text-xl font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="mt-[150px] bg-white h-full rounded-l-[50px] flex-1 flex items-center justify-center">
          <View className="flex flex-col gap-[16px] p-5 w-full">
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
              className="h-[44px] border border-neutral-300 rounded-lg bg-white p-3 mb-[25px] shadow-sm focus:border-black"
            />

            <TouchableOpacity
              className="bg-blue-500 rounded-full py-4 justify-center items-center shadow-lg"
              onPress={handleSignIn}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-[16px]">Log In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
