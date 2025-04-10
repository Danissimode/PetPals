import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react-native';
import Comments from '@/components/Comments';
import ShareSheet from '@/components/ShareSheet';

const FEED_DATA = [
  {
    id: '1',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    pet: {
      name: 'Max',
      type: 'Golden Retriever',
    },
    content: 'Max learned a new trick today! So proud of his progress with the training program.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    likes: 124,
    comments: [
      {
        id: '1',
        user: {
          name: 'Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad80d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        },
        content: 'He\'s so adorable! What training method did you use?',
        timestamp: '2 hours ago',
        likes: 5
      },
      {
        id: '2',
        user: {
          name: 'Michael Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        },
        content: 'Amazing progress! Keep it up 🎉',
        timestamp: '1 hour ago',
        likes: 2
      },
    ],
    location: 'Central Park, New York',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    pet: {
      name: 'Luna',
      type: 'Siamese Cat',
    },
    content: 'Luna enjoying her new cat tree! Best purchase ever. Any recommendations for cat toys?',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    likes: 89,
    comments: 14,
    location: 'Home Sweet Home',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    pet: {
      name: 'Buddy',
      type: 'Labrador Mix',
    },
    content: 'URGENT: Lost dog spotted near Riverside Park. Appears to be a beagle mix, wearing a red collar. Please contact if seen!',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    likes: 215,
    comments: 42,
    location: 'Riverside Park, Chicago',
    timestamp: '30 minutes ago',
    isAlert: true,
  },
];

const STORIES_DATA = [
  {
    id: '1',
    user: {
      name: 'Your Story',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    isYourStory: true,
  },
  {
    id: '2',
    user: {
      name: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    hasNewStory: true,
  },
  {
    id: '3',
    user: {
      name: 'Jessica',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    hasNewStory: true,
  },
  {
    id: '4',
    user: {
      name: 'Mark',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    hasNewStory: false,
  },
  {
    id: '5',
    user: {
      name: 'Sophia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    },
    hasNewStory: true,
  },
];

const StoryItem = ({ item }) => {
  return (
    <View style={styles.storyItem}>
      <View style={[styles.storyAvatarContainer, item.hasNewStory && styles.storyAvatarContainerActive]}>
        <Image source={{ uri: item.user.avatar }} style={styles.storyAvatar} />
        {item.isYourStory && (
          <View style={styles.addStoryButton}>
            <Text style={styles.addStoryButtonText}>+</Text>
          </View>
        )}
      </View>
      <Text style={[styles.storyName, item.isYourStory && styles.yourStoryText]} numberOfLines={1}>
        {item.user.name}
      </Text>
    </View>
  );
};

const FeedItem = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [showComments, setShowComments] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const handleAddComment = (content: string) => {
    // In a real app, this would make an API call
    console.log('Adding comment:', content);
  };

  return (
    <View style={[styles.feedItem, item.isAlert && styles.alertItem]}>
      {item.isAlert && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>LOST PET ALERT</Text>
        </View>
      )}
      <View style={styles.feedHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={12} color="#8E8E93" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      
      <Image source={{ uri: item.image }} style={styles.feedImage} />
      
      <View style={styles.feedActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart size={24} color={liked ? '#FF9F1C' : '#8E8E93'} fill={liked ? '#FF9F1C' : 'none'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowComments(true)}>
          <MessageCircle size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowShareSheet(true)}>
          <Share2 size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.feedContent}>
        <Text style={styles.likesCount}>{likesCount} likes</Text>
        <Text style={styles.contentText}>
          <Text style={styles.petName}>{item.pet.name} </Text>
          <Text style={styles.petType}>({item.pet.type}): </Text>
          {item.content}
        </Text>
        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Text style={styles.commentsLink}>View all {item.comments?.length || 0} comments</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}>
        <Comments
          postId={item.id}
          visible={showComments}
          onClose={() => setShowComments(false)}
          comments={item.comments || []}
          onAddComment={handleAddComment}
        />
      </Modal>

      <Modal
        visible={showShareSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowShareSheet(false)}>
        <ShareSheet
          visible={showShareSheet}
          onClose={() => setShowShareSheet(false)}
          url={`https://yourapp.com/posts/${item.id}`}
          title={`Check out ${item.pet.name}'s post!`}
        />
      </Modal>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.storiesContainer}>
        <FlatList
          data={STORIES_DATA}
          renderItem={({ item }) => <StoryItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <View style={styles.aiTipCard}>
        <View style={styles.aiTipHeader}>
          <Text style={styles.aiTipTitle}>🤖 AI Pet Tip of the Day</Text>
        </View>
        <Text style={styles.aiTipContent}>
          Regular brushing can reduce shedding in long-haired dogs by up to 90%. Try to brush your Golden Retriever 2-3 times a week!
        </Text>
      </View>
      
      {FEED_DATA.map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  storiesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  storyAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarContainerActive: {
    borderColor: '#FF9F1C',
  },
  storyAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  storyName: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#666666',
  },
  yourStoryText: {
    color: '#FF9F1C',
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF9F1C',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addStoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiTipCard: {
    backgroundColor: '#FFF3E0',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiTipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  aiTipContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  feedItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  alertItem: {
    borderWidth: 2,
    borderColor: '#FF9F1C',
  },
  alertBanner: {
    backgroundColor: '#FF9F1C',
    padding: 8,
    alignItems: 'center',
  },
  alertText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  feedImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  feedActions: {
    flexDirection: 'row',
    padding: 12,
  },
  actionButton: {
    marginRight: 16,
  },
  feedContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  likesCount: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contentText: {
    lineHeight: 20,
    marginBottom: 8,
  },
  petName: {
    fontWeight: 'bold',
  },
  petType: {
    fontStyle: 'italic',
  },
  commentsLink: {
    color: '#8E8E93',
    fontSize: 14,
  },
});
