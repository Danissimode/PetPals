import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { navigateToUser } from '../lib/navigation';

interface UserCardProps {
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <TouchableOpacity onPress={() => navigateToUser(user.id)} style={styles.container}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <Text>{user.username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
});
