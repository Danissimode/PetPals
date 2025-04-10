import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { MapPin, Bell, BellOff } from 'lucide-react-native';

// Mock data for notifications
const NOTIFICATIONS_DATA = [
  {
    id: '1',
    type: 'lost_pet',
    title: 'URGENT: Lost Dog Alert',
    message: 'A Golden Retriever named Max was reported lost near your area.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    location: 'Central Park, New York',
    timeAgo: '15 minutes ago',
    isUrgent: true,
    isRead: false,
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'Sarah commented on your post: "Your dog is so cute! What training method did you use?"',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    timeAgo: '2 hours ago',
    isRead: true,
  },
  {
    id: '3',
    type: 'like',
    title: 'New Likes',
    message: 'Michael and 15 others liked your photo of Luna.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    timeAgo: '5 hours ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'found_pet',
    title: 'Possible Match Found',
    message: 'Someone reported finding a cat that matches Luna\'s description.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    location: 'Brooklyn Heights',
    timeAgo: '1 day ago',
    isUrgent: true,
    isRead: false,
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Vaccination Reminder',
    message: 'Max\'s annual vaccination is due in 3 days. Schedule an appointment with your vet.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    timeAgo: '1 day ago',
    isRead: true,
  },
  {
    id: '6',
    type: 'expert',
    title: 'Expert Response',
    message: 'Dr. Johnson answered your question about pet nutrition.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    timeAgo: '2 days ago',
    isRead: true,
  },
];

const NotificationItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        !item.isRead && styles.unreadNotification
      ]} 
      onPress={() => onPress(item.id)}
    >
      <View style={styles.notificationContent}>
        <Image source={{ uri: item.image }} style={styles.notificationImage} />
        <View style={styles.notificationTextContainer}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>
              {item.isUrgent && <Text style={styles.urgentText}>URGENT: </Text>}
              {item.title}
            </Text>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message}
          </Text>
          {item.location && (
            <View style={styles.locationContainer}>
              <MapPin size={12} color="#8E8E93" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          )}
        </View>
      </View>
      {item.isUrgent && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'urgent'

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'urgent') return notification.isUrgent;
    return true;
  });

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}>
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.activeFilterTab]}
          onPress={() => setFilter('unread')}>
          <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'urgent' && styles.activeFilterTab]}
          onPress={() => setFilter('urgent')}>
          <Text style={[styles.filterText, filter === 'urgent' && styles.activeFilterText]}>Urgent</Text>
        </TouchableOpacity>
      </View>

      {/* Notification preferences card */}
      <View style={styles.preferencesCard}>
        <View style={styles.preferencesHeader}>
          <Bell size={20} color="#FF9F1C" />
          <Text style={styles.preferencesTitle}>Notification Preferences</Text>
        </View>
        <View style={styles.preferencesOptions}>
          <View style={styles.preferenceOption}>
            <Text style={styles.preferenceText}>Lost Pet Alerts</Text>
            <View style={styles.toggleButton}>
              <View style={styles.toggleButtonInner} />
            </View>
          </View>
          <View style={styles.preferenceOption}>
            <Text style={styles.preferenceText}>Comments & Likes</Text>
            <View style={[styles.toggleButton, styles.toggleButtonOff]}>
              <View style={[styles.toggleButtonInner, styles.toggleButtonInnerOff]} />
            </View>
          </View>
        </View>
      </View>

      {/* Notifications list */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={({ item }) => <NotificationItem item={item} onPress={markAsRead} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <BellOff size={48} color="#CCCCCC" />
          <Text style={styles.emptyStateTitle}>No notifications</Text>
          <Text style={styles.emptyStateMessage}>
            You don't have any {filter !== 'all' ? filter : ''} notifications at the moment.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: '#FFF3E0',
  },
  filterText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeFilterText: {
    color: '#FF9F1C',
    fontWeight: 'bold',
  },
  preferencesCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  preferencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  preferencesOptions: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingTop: 12,
  },
  preferenceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceText: {
    fontSize: 14,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CD964',
    padding: 2,
    justifyContent: 'center',
  },
  toggleButtonOff: {
    backgroundColor: '#E5E5EA',
  },
  toggleButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleButtonInnerOff: {
    alignSelf: 'flex-start',
  },
  notificationsList: {
    paddingHorizontal: 16,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9F1C',
  },
  notificationContent: {
    flexDirection: 'row',
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  urgentText: {
    color: '#FF9F1C',
  },
  timeAgo: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  actionButton: {
    backgroundColor: '#FF9F1C',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
