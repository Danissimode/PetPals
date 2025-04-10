import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { navigateToUser } from '../../lib/navigation';

type Animal = Database['public']['Tables']['animals']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AnimalProfile() {
  const { id } = useLocalSearchParams();
  const animalId = Array.isArray(id) ? id[0] : id;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimalData = async () => {
      if (!animalId) {
        setError('Animal ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const { data: animalData, error: animalError } = await supabase
          .from('animals')
          .select()
          .eq('id', animalId)
          .single();

        if (animalError) {
          throw new Error(`Error fetching animal: ${animalError.message}`);
        }

        if (!animalData) {
          throw new Error('Animal not found.');
        }

        setAnimal(animalData);

        const { data: ownerData, error: ownerError } = await supabase
          .from('profiles')
          .select()
          .eq('id', animalData.owner_id)
          .single();

        if (ownerError) {
          throw new Error(`Error fetching owner: ${ownerError.message}`);
        }

        setOwner(ownerData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalData();
  }, [animalId]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!animal || !owner) return <Text>Animal or owner not found.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: animal.profile_picture || 'https://placekitten.com/200/200' }}
        style={styles.avatar}
      />
      <Text>{animal.name}</Text>
      <Text>Type: {animal.type}</Text>
      <Text>Age: {animal.age}</Text>

      <TouchableOpacity onPress={() => navigateToUser(owner.id)}>
        <Text style={styles.link}>Owner: {owner.username}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
