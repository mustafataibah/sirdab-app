import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User } from "@/app/types";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => (
  <TouchableOpacity onPress={onPress} className="bg-white p-4 rounded-lg m-2 shadow">
    <Text>{user.emailAddress}</Text>
  </TouchableOpacity>
);

export default UserCard;
