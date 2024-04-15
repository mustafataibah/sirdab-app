import React, { useState } from "react";
import { View, Text, Switch, TextInput, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { createUser } from "../firebase/userController";

const Register = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isManager, setIsManager] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });

      if (completeSignUp.createdSessionId) {
        await createUser(completeSignUp.createdSessionId, emailAddress, isManager ? true : false);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      router.navigate("/(tabs)/explore");
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-5">
      <TextInput
        className="border border-gray-300 p-2 w-80"
        onChangeText={setEmailAddress}
        value={emailAddress}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 p-2 w-80"
        onChangeText={setPassword}
        value={password}
        placeholder="Enter your password"
        secureTextEntry
        autoCapitalize="none"
      />
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isManager ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => setIsManager((previousState) => !previousState)}
        value={isManager}
      />
      <Text>Register as {isManager ? "Manager" : "User"}</Text>
      <Button title="Create Account" onPress={handleSignUp} />
      {pendingVerification && (
        <View>
          <View>
            <TextInput value={code} placeholder="Code..." onChangeText={(code) => setCode(code)} />
          </View>
          <TouchableOpacity onPress={onPressVerify}>
            <Text>Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text onPress={() => router.navigate("/(auth)/login")}>Already have an account? Login</Text>
    </View>
  );
};

export default Register;
