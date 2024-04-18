import React from "react";
import { Modal, View, Text, Button } from "react-native";
import { User } from "@/app/types";

interface UserModalProps {
  user: User;
  visible: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-xl font-bold mb-2">{user.name}</Text>
        <Text className="mb-4">{user.emailAddress}</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default UserModal;
