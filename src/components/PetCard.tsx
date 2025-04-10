import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PawPrint } from 'lucide-react-native';
import { navigateToAnimal } from '../lib/navigation';

interface PetCardProps {
  animal: {
    id: string;
    name: string;
    type: string;
    profile_picture: string;
  };
}

export const PetCard: React.FC<PetCardProps> = ({ animal }) => {
  return (
    <TouchableOpacity onPress={() => navigateToAnimal(animal.id)} style={styles.container}>
      <Image source={{ uri: animal.profile_picture }} style={styles.avatar} />
      <Text>{animal.name}</Text>
      <Text>{animal.type}</Text>
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
