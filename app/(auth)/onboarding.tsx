import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";

// const onboardingSteps = [
//   {
//     icon: "Icon",
//     title: "Title",
//     description: "Description",
//   },
//   {
//     icon: "Icon",
//     title: "Title",
//     description: "Description",
//   },
//   {
//     icon: "Icon",
//     title: "Title",
//     description: "Description",
//   },
// ];

export default function Onboarding() {
  const [screenIndex, setScreenIndex] = useState(0);

  // const data = onboardingSteps[screenIndex];

  const onContinue = () => {
    // const isLastScreen = screenIndex === onboardingSteps.length - 1;
    const isLastScreen = screenIndex === 2;
    if (isLastScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  // const onBack = () => {
  //   const isFirstScreen = screenIndex === 0;
  //   if (isFirstScreen) {
  //     endOnboarding();
  //   } else {
  //     setScreenIndex(screenIndex - 1);
  //   }
  // };

  const endOnboarding = async () => {
    try {
      await SecureStore.setItemAsync("onboardingComplete", "true");
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
    }
    setScreenIndex(0);
    router.navigate("(auth)/register");
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.stepIndicatorContainer}>
        {/* {onboardingSteps.map((step, index) => (
          <View
            key={index}
            style={[styles.stepIndicator, { backgroundColor: index === screenIndex ? "#CEF202" : "grey" }]}
          />
        ))} */}
      </View>

      <View style={styles.pageContent}>
        <View style={styles.footer}>
          <View style={styles.buttonsRow}>
            <Text onPress={endOnboarding} style={styles.buttonText}>
              Skip
            </Text>

            <Pressable onPress={onContinue} style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#15141A",
  },
  pageContent: {
    padding: 20,
    flex: 1,
  },
  image: {
    alignSelf: "center",
    margin: 20,
    marginTop: 70,
  },
  title: {
    color: "#FDFDFD",
    fontSize: 50,
    letterSpacing: 1.3,
    marginVertical: 10,
  },
  description: {
    color: "gray",
    fontSize: 20,
    lineHeight: 28,
  },
  footer: {
    marginTop: "auto",
  },
  buttonsRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#302E38",
    borderRadius: 50,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#FDFDFD",
    fontSize: 16,
    padding: 15,
    paddingHorizontal: 25,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 15,
  },
  stepIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: "gray",
    borderRadius: 10,
  },
});
