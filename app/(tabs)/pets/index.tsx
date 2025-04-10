import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { QrCode, Dna, PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';

type Animal = Database['public']['Tables']['animals']['Row'];

export default function PetsScreen() {
  const [pets, setPets] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError('User not found. Please sign in.');
          return;
        }

        const { data, error: supabaseError } = await supabase
          .from('animals')
          .select()
          .eq('owner_id', user.id);

        if (supabaseError) {
          console.error('Error fetching pets:', supabaseError);
          setError(`Error fetching pets: ${supabaseError.message}`);
          return;
        }

        setPets(data || []);
      } catch (e: any) {
        console.error('Unexpected error fetching pets:', e);
        setError(`Unexpected error: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  const renderPet = ({ item }: { item: Animal }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => router.push(`/pets/${item.id}`)}
    >
      <Image
        source={{
          uri: item.profile_picture || 'https://via.placeholder.com/100',
        }}
        style={styles.petImage}
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petBreed}>{item.type}</Text>
        {item.metric_number && (
          <View style={styles.metricContainer}>
            <QrCode size={14} color="#666666" />
            <Text style={styles.metricNumber}>{item.metric_number}</Text>
          </View>
        )}
        {item.has_pedigree && (
          <TouchableOpacity
            style={styles.pedigreeLink}
            onPress={() => router.push(`/pets/${item.id}/pedigree`)}
          >
            <Dna size={16} color="#6C4AB6" />
            <Text style={styles.pedigreeText}>View Pedigree</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF9F1C"
          style={styles.loadingIndicator}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={pets}
            renderItem={renderPet}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No pets added yet</Text>
              </View>
            }
          />
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push('/pets/add')}
          >
            <PlusCircle size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  petImage: {
    width: 100,
    height: 100,
  },
  petInfo: {
    flex: 1,
    padding: 12,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: '#666666',
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metricNumber: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  pedigreeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  pedigreeText: {
    fontSize: 12,
    color: '#6C4AB6',
    marginLeft: 6,
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FF9F1C',
    padding: 14,
    borderRadius: 32,
    elevation: 6,
  },
  loadingIndicator: {
    marginTop: 100,
  },
  errorText: {
    color: '#D63031',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
