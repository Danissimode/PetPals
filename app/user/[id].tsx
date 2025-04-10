import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase-types';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Animal = Database['public']['Tables']['animals']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const userId = Array.isArray(id) ? id[0] : id;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        setError('User ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .single();

        if (profileError) {
          throw new Error(`Error fetching profile: ${profileError.message}`);
        }

        setProfile(profileData);

        const { data: animalsData, error: animalsError } = await supabase
          .from('animals')
          .select()
          .eq('owner_id', userId);

        if (animalsError) {
          throw new Error(`Error fetching animals: ${animalsError.message}`);
        }

        setAnimals(animalsData || []);

        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select()
          .eq('user_id', userId);

        if (postsError) {
          throw new Error(`Error fetching posts: ${postsError.message}`);
        }

        setPosts(postsData || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!profile) return <Text>Profile not found.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: profile.avatar_url || 'https://placekitten.com/200/200' }}
        style={styles.avatar}
      />
      <Text>{profile.username}</Text>
      <Text>{profile.full_name}</Text>
      <Text>{profile.bio}</Text>

      <Text style={styles.sectionTitle}>Animals</Text>
      <FlatList
        data={animals}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtractor={(item) => item.id}
        style={{ flexGrow: 0 }}
      />

      <Text style={styles.sectionTitle}>Posts</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Text>{item.caption}</Text>}
        keyExtractor={(item) => item.id}
        style={{ flexGrow: 0 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
});
