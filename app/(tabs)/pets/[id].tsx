import React, { useState, useEffect } from 'react';
    import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
    import { useLocalSearchParams } from 'expo-router';
    import { Dna, Award, QrCode, Calendar, Palette, MapPin, Edit2 } from 'lucide-react-native';
    import { supabase } from '@/lib/supabase';
    import type { Database } from '@/lib/supabase-types';

    type Animal = Database['public']['Tables']['animals']['Row'];

    export default function PetProfileScreen() {
      const { id } = useLocalSearchParams();
      const [pet, setPet] = useState<Animal | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const fetchPet = async () => {
          if (!id) return;

          const { data, error } = await supabase
            .from('animals')
            .select()
            .eq('id', id)
            .single();

          if (error) {
            console.error("Error fetching pet:", error);
            setIsLoading(false);
            return;
          }

          setPet(data);
          setIsLoading(false);
        };

        fetchPet();
      }, [id]);

      if (isLoading) {
        return <ActivityIndicator size="large" color="#FF9F1C" style={styles.loadingIndicator} />;
      }

      if (!pet) {
        return <Text>Pet not found</Text>;
      }

      return (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: pet.profile_picture || 'https://via.placeholder.com/250' }} style={styles.coverImage} />
            <TouchableOpacity style={styles.editButton}>
              <Edit2 size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.basicInfo}>
              <Text style={styles.name}>{pet.name}</Text>
              <Text style={styles.breed}>{pet.type}</Text>
              {pet.metric_number && (
                <View style={styles.metricContainer}>
                  <QrCode size={16} color="#666666" />
                  <Text style={styles.metricNumber}>{pet.metric_number}</Text>
                </View>
              )}
              {pet.birth_date && (
                <View style={styles.infoItem}>
                  <Calendar size={20} color="#666666" />
                  <Text style={styles.infoLabel}>Birth Date</Text>
                  <Text style={styles.infoValue}>{pet.birth_date}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
      },
      header: {
        position: 'relative',
      },
      coverImage: {
        width: '100%',
        height: 250,
      },
      editButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
      },
      content: {
        padding: 16,
      },
      basicInfo: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
      },
      breed: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 8,
      },
      metricContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      metricNumber: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 8,
      },
      infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      infoItem: {
        alignItems: 'center',
        flex: 1,
      },
      infoLabel: {
        fontSize: 12,
        color: '#666666',
        marginTop: 4,
        marginBottom: 2,
      },
      infoValue: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
      },
      loadingIndicator: {
        marginTop: 100,
      }
    });
