import React, { useState } from "react";
import { TextInput, View, TouchableOpacity, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-react";
// import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
// import { useOAuth } from "@clerk/clerk-expo";

// enum Strategy {
//   Google = "oauth_google",
//   Apple = "oauth_apple",
// }

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // useWarmUpBrowser();

  // const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  // const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

  // const onSelectAuth = async (strategy: Strategy) => {
  //   const selectedAuth = {
  //     [Strategy.Google]: googleAuth,
  //     [Strategy.Apple]: appleAuth,
  //   }[strategy];

  //   try {
  //     const { createdSessionId, setActive } = await selectedAuth();

  //     if (createdSessionId) {
  //       setActive!({ session: createdSessionId });
  //       router.navigate("(tabs)/explore");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSignIn = async () => {
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status !== "complete") {
      }

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.navigate("/(tabs)/explore");
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <View className="flex-1 bg-white p-[26px] justify-center items-center">
      <View className="flex flex-col gap-[8px] w-full">
        <TextInput
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          className="h-[44px] border border-neutral-300 rounded-lg bg-white w-full p-3"
        />
        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          className="h-[44px] border border-neutral-300 rounded-lg bg-white w-full p-3"
        />
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
      {/* <View className="flex flex-col gap-[8px] w-full my-[20px]">
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.Google)}
          className="justify-center items-center h-[44px] bg-blue-500 rounded-lg">
          <Text className="text-white font-bold">Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectAuth(Strategy.Apple)}
          className="justify-center items-center h-[44px] bg-black rounded-lg">
          <Text className="text-white font-bold">Sign in with Apple</Text>
        </TouchableOpacity>
      </View> */}
      <TouchableOpacity onPress={() => router.navigate("(auth)/register")}>
        <Text className="text-blue-500 font-bold">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
