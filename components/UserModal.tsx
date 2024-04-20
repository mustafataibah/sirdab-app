import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

// UserModal component to display the user details and manage the user for managers

interface UserModalProps {
  user: any;
  visible: boolean;
  onClose: () => void;
}

// user data, visiblity state, and onClose function as props
const UserModal: React.FC<UserModalProps> = ({ user, visible, onClose }) => {
  const { userId, signOut } = useAuth();
  const [loading, setLoading] = useState(false); // loading state for when backend call

  // function to delete the user
  const handleDelete = async () => {
    if (user.id === userId) {
      Alert.alert("You cannot delete yourself.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/admin/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      });
      if (response.ok) {
        onClose();
      } else {
        console.error("Failed to delete user:", response);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // middle function in between changing their own role and changing other user's role
  // wont affect the flow unless the user is changing their own role
  // otherwise directly call the change role function
  const handleChangeRoleWarning = () => {
    if (user.id === userId) {
      Alert.alert("Warning", "You are about to change your own role, this will affect your ability to manage users", [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: () => handleChangeRole() },
      ]);
    } else {
      handleChangeRole();
    }
  };

  // function to change the role of the user
  const handleChangeRole = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/admin/changeRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id, isManager: !user.isManager }),
      });
      if (response.ok) {
        onClose();
      } else {
        console.error("Failed to change role:", response);
      }
    } catch (error) {
      console.error("Failed to change role:", error);
    } finally {
      if (user.id === userId) {
        await signOut();
      }
    }
    setLoading(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="m-[20px] bg-white rounded-2xl p-[35px] items-center shadow-lg mt-[250px] border border-neutral-300">
        <View className="flex flex-row gap-2 m-4">
          <TouchableOpacity onPress={onClose} className="bg-blue-500 mt-[20px] rounded-md p-3">
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="bg-red-500 mt-[20px] rounded-md p-3">
            <Text className="text-white font-bold">Delete User</Text>
          </TouchableOpacity>
        </View>
        <Text>Email: {user?.emailAddress}</Text>
        <Text>Role: {user?.isManager ? "Manager" : "User"}</Text>
        <Text className="font-bold text-lg">Current Bookings</Text>
        {user?.currentBookings.map((booking: any) => (
          <Text key={booking.userId}>
            {booking.bicycleId} booked at {booking.date}
          </Text>
        ))}
        <Text className="font-bold text-lg">Past Trips</Text>
        {user?.pastTrips.map((booking: any) => (
          <Text key={booking.userId}>
            {booking.bicycleId} booked at {booking.date}
          </Text>
        ))}
        <TouchableOpacity onPress={handleChangeRoleWarning} className="bg-blue-500 mt-[20px] rounded-md p-3">
          <Text className="text-white font-bold">Convert Role To {user?.isManager ? "User" : "Manager"}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default UserModal;
