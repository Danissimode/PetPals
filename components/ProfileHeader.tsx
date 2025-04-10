import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Camera, Plus } from 'lucide-react-native';

interface ProfileHeaderProps {
  avatar: string;
  name: string;
  username: string;
  bio: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  onAvatarPress: () => void;
  onEditProfile: () => void;
}

export default function ProfileHeader({
  avatar,
  name,
  username,
  bio,
  stats,
  onAvatarPress,
  onEditProfile,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onAvatarPress} 
          style={styles.avatarContainer}
          accessibilityLabel="Change profile photo"
          accessibilityHint="Select a new profile photo">
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.avatarOverlay}>
            <View style={styles.avatarOverlayContent}>
              <Camera size={24} color="#FFFFFF" />
              <Plus size={16} color="#FFFFFF" style={styles.plusIcon} />
            </View>
            <Text style={styles.avatarOverlayText}>Change Photo</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={onEditProfile}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          accessibilityHint="Navigate to profile editing page">
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 24,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOverlayContent: {
    position: 'relative',
    alignItems: 'center',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
  },
  avatarOverlayText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  profileInfo: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FF9F1C',
    fontWeight: 'bold',
  },
});
