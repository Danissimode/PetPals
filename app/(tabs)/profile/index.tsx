import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import {
  Award,
  Heart,
  MessageCircle,
  Settings,
  PawPrint as Paw,
  Footprints,
  LogOut,
} from 'lucide-react-native';

import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'activity'>('posts');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();

      if (!error) {
        setProfile(data);
        setAvatar(data?.avatar_url || null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  const handleEditProfile = () => router.push('/profile/edit');
  const handleSettings = () => router.push('/profile/settings');
  const handleMyPets = () => router.push('/pets');
  const handleLogout = () => signOut();

  const handleAvatarPress = () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      console.log('Native image picker logic');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.size > MAX_FILE_SIZE) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9F1C" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#999' }}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleSettings}
          style={styles.settingsButton}
          accessibilityLabel="Settings"
        >
          <Settings size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.settingsButton}
          accessibilityLabel="Logout"
        >
          <LogOut size={24} color="#D63031" />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Image
            source={{ uri: avatar || 'https://placekitten.com/200/200' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{profile.full_name}</Text>
        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
          <Footprints size={24} color="#FF9F1C" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleMyPets}>
          <Paw size={24} color="#FF9F1C" />
          <Text style={styles.actionButtonText}>My Pets</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {['posts', 'saved', 'activity'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.emptyState}>
        {activeTab === 'posts' ? (
          <>
            <MessageCircle size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No posts yet</Text>
            <Text style={styles.emptyStateMessage}>
              Share your pet moments with the community
            </Text>
          </>
        ) : activeTab === 'saved' ? (
          <>
            <Heart size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No saved posts yet</Text>
            <Text style={styles.emptyStateMessage}>
              Posts you save will appear here
            </Text>
          </>
        ) : (
          <>
            <Award size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No recent activity</Text>
            <Text style={styles.emptyStateMessage}>
              Your recent interactions and achievements will appear here
            </Text>
          </>
        )}
      </View>

      {Platform.OS === 'web' && (
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  settingsButton: {
    padding: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9F1C',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9F1C',
  },
  tabText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FF9F1C',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
