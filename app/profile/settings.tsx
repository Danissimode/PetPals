import React, { useState } from 'react';
    import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform, Dimensions, Alert } from 'react-native';
    import { Stack, router } from 'expo-router';
    import { Lock, Globe, Bell, Smartphone, Shield, LogOut, Trash2, ChevronRight, ChevronLeft } from 'lucide-react-native';

    const { height: SCREEN_HEIGHT } = Dimensions.get('window');

    const SECTIONS = {
      account: [
        { id: 'password', title: 'Change Password', icon: Lock, route: '/profile/password' },
        { id: '2fa', title: 'Two-Factor Authentication', icon: Shield, route: '/profile/2fa' },
        { id: 'devices', title: 'Connected Devices', icon: Smartphone, route: '/profile/devices' },
      ],
      privacy: [
        { id: 'visibility', title: 'Profile Visibility', icon: Lock },
        { id: 'data', title: 'Data & Privacy', icon: Lock, route: '/profile/privacy' },
        { id: 'cookies', title: 'Cookie Preferences', icon: Shield, route: '/profile/cookies' },
      ],
      notifications: [
        { id: 'push', title: 'Push Notifications', icon: Bell },
        { id: 'email', title: 'Email Notifications', icon: Bell },
        { id: 'sounds', title: 'Notification Sounds', icon: Bell },
      ],
      language: [
        { id: 'app_language', title: 'App Language', icon: Globe, route: '/profile/language' },
        { id: 'region', title: 'Region', icon: Globe, route: '/profile/region' },
      ],
      danger: [
        { id: 'delete', title: 'Delete Account', icon: Trash2, danger: true },
      ],
    };

    export default function SettingsScreen() {
      const [profileVisibility, setProfileVisibility] = useState(true);
      const [pushEnabled, setPushEnabled] = useState(true);
      const [emailEnabled, setEmailEnabled] = useState(true);
      const [soundEnabled, setSoundEnabled] = useState(true);

      const handleBack = () => {
        router.back();
      };

      const handleLogout = () => {
        const logoutAction = () => {
          router.replace('/');
        };

        if (Platform.OS === 'web') {
          if (window.confirm('Are you sure you want to logout?')) {
            logoutAction();
          }
        } else {
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Logout',
                style: 'destructive',
                onPress: logoutAction,
              },
            ],
            { cancelable: true }
          );
        }
      };

      const handleDeleteAccount = () => {
        const deleteAction = () => {
          router.replace('/');
        };

        if (Platform.OS === 'web') {
          if (window.confirm('This action cannot be undone. All your data will be permanently deleted.')) {
            deleteAction();
          }
        } else {
          Alert.alert(
            'Delete Account',
            'This action cannot be undone. All your data will be permanently deleted.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: deleteAction,
              },
            ],
            { cancelable: true }
          );
        }
      };

      const handleNavigation = (route?: string) => {
        if (route) {
          router.push(route);
        }
      };

      const renderSection = (title: string, items: any[]) => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionContent}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingItem,
                  index === items.length - 1 && styles.lastItem,
                  item.danger && styles.dangerItem,
                ]}
                onPress={() => {
                  if (item.danger) {
                    handleDeleteAccount();
                  } else if (item.route) {
                    handleNavigation(item.route);
                  }
                }}>
                <View style={styles.settingItemLeft}>
                  <item.icon
                    size={20}
                    color={item.danger ? '#FF3B30' : '#333333'}
                    style={styles.itemIcon}
                  />
                  <Text style={[
                    styles.settingItemText,
                    item.danger && styles.dangerText,
                  ]}>
                    {item.title}
                  </Text>
                </View>
                {item.id === 'visibility' ? (
                  <Switch
                    value={profileVisibility}
                    onValueChange={setProfileVisibility}
                    trackColor={{ false: '#D1D1D6', true: '#FFD5A5' }}
                    thumbColor={profileVisibility ? '#FF9F1C' : '#FFFFFF'}
                  />
                ) : item.id === 'push' ? (
                  <Switch
                    value={pushEnabled}
                    onValueChange={setPushEnabled}
                    trackColor={{ false: '#D1D1D6', true: '#FFD5A5' }}
                    thumbColor={pushEnabled ? '#FF9F1C' : '#FFFFFF'}
                  />
                ) : item.id === 'email' ? (
                  <Switch
                    value={emailEnabled}
                    onValueChange={setEmailEnabled}
                    trackColor={{ false: '#D1D1D6', true: '#FFD5A5' }}
                    thumbColor={emailEnabled ? '#FF9F1C' : '#FFFFFF'}
                  />
                ) : item.id === 'sounds' ? (
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    trackColor={{ false: '#D1D1D6', true: '#FFD5A5' }}
                    thumbColor={soundEnabled ? '#FF9F1C' : '#FFFFFF'}
                  />
                ) : item.route ? (
                  <ChevronRight size={20} color="#8E8E93" />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );

      return (
        <>
          <Stack.Screen 
            options={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_right',
            }} 
          />
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <ChevronLeft size={24} color="#333333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerRight} />
              </View>

              <ScrollView style={styles.content}>
                {renderSection('Account', SECTIONS.account)}
                {renderSection('Privacy', SECTIONS.privacy)}
                {renderSection('Notifications', SECTIONS.notifications)}
                {renderSection('Language & Region', SECTIONS.language)}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <LogOut size={20} color="#FF9F1C" />
                  <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {renderSection('Danger Zone', SECTIONS.danger)}

                <View style={styles.footer}>
                  <TouchableOpacity 
                    style={styles.footerLink}
                    onPress={() => handleNavigation('/legal/terms')}>
                    <Text style={styles.footerLinkText}>Terms of Service</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.footerLink}
                    onPress={() => handleNavigation('/legal/privacy')}>
                    <Text style={styles.footerLinkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.footerLink}
                    onPress={() => handleNavigation('/help')}>
                    <Text style={styles.footerLinkText}>Help Center</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.versionInfo}>
                  <Text style={styles.versionText}>Version 1.0.0 (Build 123)</Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </>
      );
    }

    const styles = StyleSheet.create({
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },
      modalContent: {
        height: SCREEN_HEIGHT * 0.9,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
      },
      backButton: {
        padding: 8,
      },
      headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
      },
      headerRight: {
        width: 40,
      },
      content: {
        flex: 1,
      },
      section: {
        marginBottom: 24,
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8E8E93',
        marginLeft: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
      },
      sectionContent: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
      },
      settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
      },
      settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      itemIcon: {
        marginRight: 12,
      },
      settingItemText: {
        fontSize: 16,
        color: '#333333',
      },
      lastItem: {
        borderBottomWidth: 0,
      },
      dangerItem: {
        borderBottomWidth: 0,
      },
      dangerText: {
        color: '#FF3B30',
      },
      logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        marginBottom: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
      },
      logoutText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#FF9F1C',
        fontWeight: 'bold',
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 16,
      },
      footerLink: {
        marginHorizontal: 8,
        marginVertical: 4,
      },
      footerLinkText: {
        color: '#8E8E93',
        fontSize: 14,
      },
      versionInfo: {
        alignItems: 'center',
        paddingBottom: 32,
      },
      versionText: {
        color: '#8E8E93',
        fontSize: 12,
      },
    });
