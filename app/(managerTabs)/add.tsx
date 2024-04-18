import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const AddBicycle = () => {
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleAddBicycle = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/addBicycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, color, location, rating, isAvailable }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Bicycle added successfully!");
        setModel("");
        setColor("");
      } else {
        Alert.alert("Error", "Failed to add bicycle.");
      }
    } catch (error) {
      console.error("Failed to add bicycle:", error);
      Alert.alert("Error", "Failed to add bicycle.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Model:</Text>
      <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="Enter model" />
      <Text style={styles.label}>Color:</Text>
      <TextInput style={styles.input} value={color} onChangeText={setColor} placeholder="Enter color" />
      <Text style={styles.label}>Location:</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter location" />
      <Text style={styles.label}>Rating:</Text>
      {/* <TextInput style={styles.input} value={rating} onChangeText={setRating} placeholder="Enter rating" /> */}
      <Text style={styles.label}>Is Available:</Text>
      {/* <TextInput
        style={styles.input}
        value={isAvailable}
        onChangeText={setIsAvailable}
        placeholder="Enter availability"
      /> */}

      <View style={styles.buttonContainer}>
        <Button title="Add Bicycle" onPress={handleAddBicycle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AddBicycle;
