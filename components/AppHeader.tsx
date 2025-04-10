import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Search, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';

interface AppHeaderProps {
  title?: string;
  showSearch?: boolean;
  showMessages?: boolean;
}

export default function AppHeader({ 
  title = 'PetPals',
  showSearch = true,
  showMessages = true 
}: AppHeaderProps) {
  const handleSearchPress = () => {
    router.push('/(tabs)/search');
  };

  const handleMessagesPress = () => {
    // Navigate to messages screen when implemented
    console.log('Messages pressed');
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showSearch && (
          <TouchableOpacity 
            onPress={handleSearchPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Search size={24} color="#333333" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {showMessages && (
          <TouchableOpacity 
            onPress={handleMessagesPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MessageCircle size={24} color="#333333" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    height: Platform.OS === 'ios' ? 44 : 56,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9F1C',
  },
  iconButton: {
    padding: 4,
  },
});
