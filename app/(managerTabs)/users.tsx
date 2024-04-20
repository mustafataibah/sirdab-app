import React, { useState, useCallback } from "react";
import { View, ScrollView, Button, TouchableOpacity, Text } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import UserModal from "@/components/UserModal";
import { Link } from "expo-router";
import { useFocusEffect } from "expo-router";

interface User {
  emailAddress: string;
  name: string;
  id: string;
}

const Users = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.navigate("(auth)/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/fetchUsers");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handlePressUser = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Button title="Log out" onPress={handleSignOut} />
      <Link href={"/(modals)/createUser"} asChild>
        <Button title="Create User" />
      </Link>

      <ScrollView>
        <Button title="Refresh" onPress={handleRefresh} />
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            className="bg-white p-4 rounded-lg m-2 shadow"
            onPress={() => handlePressUser(user)}>
            <Text>{user.emailAddress}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedUser && <UserModal user={selectedUser} visible={modalVisible} onClose={() => setModalVisible(false)} />}
    </View>
  );
};

export default Users;
