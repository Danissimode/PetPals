import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Chrome as Home,
  Search,
  CirclePlus as PlusCircle,
  Bell,
  User,
} from 'lucide-react-native';
import { Tabs } from 'expo-router';
import AppHeader from './AppHeader';

const THEME = {
  colors: {
    primary: '#FFC857',
    accent: '#FF9F1C',
    background: '#FFF3E0',
    text: '#4A4A4A',
    rose: '#D88C9A',
    purple: '#6A4C93',
  },
};

export default function AppTabBar() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.colors.accent,
        tabBarInactiveTintColor: THEME.colors.text,
        tabBarLabelStyle: { display: 'none' },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        header: (props) => <AppHeader title={props.options.title} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'PetPals',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Find Pets & Services',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create Post',
          tabBarIcon: ({ color }) => (
            <View style={styles.createButton}>
              <PlusCircle size={32} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
