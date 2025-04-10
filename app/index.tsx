import React from 'react';
    import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
    import { useQuery } from 'react-query';
    import { supabase } from '../lib/supabase';
    import { PostCard } from '../components/PostCard';

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
            id,
            user_id,
            caption,
            image_url,
            type,
            created_at,
            user:profiles(username, avatar_url)
          `
        )
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching posts: ${error.message}`);
      }
      return data;
    };

    export default function Index() {
      const { data: posts, isLoading, error } = useQuery('posts', fetchPosts);

      if (isLoading) {
        return <ActivityIndicator size="large" color="#FF9F1C" />;
      }

      if (error) {
        return <Text>Error: {error.message}</Text>;
      }

      return (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id}
          style={styles.container}
        />
      );
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        padding: 16,
      },
    });
