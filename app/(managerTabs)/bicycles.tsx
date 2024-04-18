import React, { useState, useEffect } from "react";
import { View, ScrollView, Button } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import UserCard from "@/components/UserCard";
import UserModal from "@/app/(modals)/user";
import { User } from "@/app/types";

const Users = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchBicycles();
  }, []);

  const fetchBicycles = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/fetchBicycles");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.navigate("(auth)/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Button title="Log out" onPress={handleSignOut} />
      <ScrollView>
        {users.map((user) => (
          <UserCard key={user.id} user={user} onPress={() => setSelectedUser(user)} />
        ))}
      </ScrollView>
      {selectedUser && <UserModal user={selectedUser} visible={!!selectedUser} onClose={() => setSelectedUser(null)} />}
    </View>
  );
};

export default Users;
