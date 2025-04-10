import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Award, Heart, MessageCircle, Settings, PawPrint as Paw, Footprints } from 'lucide-react-native';
import ProfileHeader from '@/components/ProfileHeader';

// Mock user data
const USER = {
  name: 'Alex Johnson',
  username: '@alexj',
  bio: 'Dog lover & trainer. Passionate about helping pets find their forever homes.',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  location: 'New York, NY',
  memberSince: 'January 2023',
  stats: {
    posts: 48,
    followers: 256,
    following: 124,
  },
  badges: [
    { id: '1', name: 'Super Rescuer', icon: '🏆' },
    { id: '2', name: 'Pet Expert', icon: '🔍' },
    { id: '3', name: 'Community Hero', icon: '⭐' },
  ],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('posts');
  const [avatar, setAvatar] = useState(USER.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleSettings = () => {
    router.push('/profile/settings');
  };

  const handleMyPets = () => {
    router.push('/pets');
  };

  const handleAvatarPress = () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    } else {
      // Handle native image picker
      console.log('Open native image picker');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      // Show error message for file size
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={handleSettings}
            style={styles.settingsButton}
            accessibilityLabel="Settings"
            accessibilityHint="Open settings menu">
            <Settings size={24} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>

      <ProfileHeader
        avatar={avatar}
        name={USER.name}
        username={USER.username}
        bio={USER.bio}
        stats={USER.stats}
        onAvatarPress={handleAvatarPress}
        onEditProfile={handleEditProfile}
      />

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

      <View style={styles.contentSection}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}>
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}>
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
            onPress={() => setActiveTab('activity')}>
            <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>Activity</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'posts' ? (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No posts yet</Text>
            <Text style={styles.emptyStateMessage}>
              Share your pet moments with the community
            </Text>
          </View>
        ) : activeTab === 'saved' ? (
          <View style={styles.emptyState}>
            <Heart size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No saved posts yet</Text>
            <Text style={styles.emptyStateMessage}>
              Posts you save will appear here for easy access
            </Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Award size={48} color="#CCCCCC" />
            <Text style={styles.emptyStateTitle}>No recent activity</Text>
            <Text style={styles.emptyStateMessage}>
              Your recent interactions and achievements will appear here
            </Text>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9F1C',
  },
  contentSection: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
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
