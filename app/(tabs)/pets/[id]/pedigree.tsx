import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';
import PedigreeTree from '@/components/pedigree/PedigreeTree';

type Animal = Database['public']['Tables']['animals']['Row'];

export default function PedigreePage() {
  const { id } = useLocalSearchParams();
  const petId = Array.isArray(id) ? id[0] : id;

  const [pet, setPet] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!petId) return;

    const fetchPet = async () => {
      const { data, error } = await supabase
        .from('animals')
        .select()
        .eq('id', petId)
        .single();

      if (!error) {
        setPet(data);
      }
      setLoading(false);
    };

    fetchPet();
  }, [petId]);

  if (loading) return <Text>Loading...</Text>;
  if (!pet) return <Text>Pet not found</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{pet.name}'s Pedigree</Text>
      <PedigreeTree rootPetId={pet.id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
