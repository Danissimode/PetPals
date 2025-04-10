import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { Send, X, Heart, Smile } from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_COMMENT_LENGTH = 500;

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

interface CommentsProps {
  postId: string;
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export default function Comments({ postId, visible, onClose, comments: initialComments, onAddComment }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSending, setIsSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setError(null));
    }
  }, [error]);

  const handleSubmit = async () => {
    const trimmedComment = newComment.trim();
    
    if (!trimmedComment) {
      setError('Comment cannot be empty');
      return;
    }

    if (trimmedComment.length > MAX_COMMENT_LENGTH) {
      setError(`Comment must be ${MAX_COMMENT_LENGTH} characters or less`);
      return;
    }

    try {
      setIsSending(true);
      setError(null);
      
      const newCommentObj = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
        },
        content: replyingTo 
          ? `@${replyingTo} ${trimmedComment}`
          : trimmedComment,
        timestamp: 'Just now',
        likes: 0,
        isLiked: false
      };

      setComments(prevComments => [newCommentObj, ...prevComments]);
      
      setNewComment('');
      setReplyingTo(null);
      setCharacterCount(0);
      
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
      
      await onAddComment(trimmedComment);
      
    } catch (err) {
      setComments(prevComments => prevComments.filter(c => c.id !== Date.now().toString()));
      setError('Failed to send comment. Please try again.');
      setNewComment(trimmedComment);
    } finally {
      setIsSending(false);
    }
  };

  const handleTextChange = (text: string) => {
    setNewComment(text);
    setCharacterCount(text.length);
    setError(null);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          };
        }
        return comment;
      })
    );
  };

  const handleReply = (username: string) => {
    setReplyingTo(username);
    setNewComment(`@${username} `);
    inputRef.current?.focus();
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={() => handleLikeComment(item.id)}
          >
            <Heart 
              size={16} 
              color={item.isLiked ? '#FF3B30' : '#8E8E93'} 
              fill={item.isLiked ? '#FF3B30' : 'none'}
            />
            {item.likes > 0 && (
              <Text style={[styles.actionText, item.isLiked && styles.likedText]}>
                {item.likes}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.replyButton}
            onPress={() => handleReply(item.user.name)}
          >
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#333333" />
              </TouchableOpacity>
              <Text style={styles.title}>Comments</Text>
              <View style={styles.headerRight} />
            </View>

            {error && (
              <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            <FlatList
              ref={listRef}
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentsList}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No comments yet</Text>
                  <Text style={styles.emptyStateSubtext}>Be the first to comment!</Text>
                </View>
              }
            />

            <View style={styles.bottomContainer}>
              {replyingTo && (
                <View style={styles.replyingToContainer}>
                  <Text style={styles.replyingToText}>
                    Replying to <Text style={styles.replyingToName}>@{replyingTo}</Text>
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setReplyingTo(null);
                    setNewComment('');
                    setCharacterCount(0);
                  }}>
                    <X size={16} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.emojiButton}>
                  <Smile size={24} color="#8E8E93" />
                </TouchableOpacity>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={handleTextChange}
                  multiline
                  maxLength={MAX_COMMENT_LENGTH}
                  editable={!isSending}
                  placeholderTextColor="#8E8E93"
                />
                <View style={styles.inputActions}>
                  {characterCount > 0 && (
                    <Text style={[
                      styles.characterCount,
                      characterCount > MAX_COMMENT_LENGTH && styles.characterCountError
                    ]}>
                      {characterCount}/{MAX_COMMENT_LENGTH}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={[
                      styles.sendButton,
                      (!newComment.trim() || isSending) && styles.sendButtonDisabled
                    ]}
                    disabled={!newComment.trim() || isSending}>
                    {isSending ? (
                      <ActivityIndicator size="small" color="#FF9F1C" />
                    ) : (
                      <Send
                        size={20}
                        color={newComment.trim() ? '#FF9F1C' : '#8E8E93'}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerRight: {
    width: 40,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  commentsList: {
    padding: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
    color: '#333333',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 4,
  },
  replyButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  likedText: {
    color: '#FF3B30',
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
  },
  replyingToText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  replyingToName: {
    color: '#FF9F1C',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emojiButton: {
    padding: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 80,
    fontSize: 14,
    color: '#333333',
  },
  inputActions: {
    position: 'absolute',
    right: 24,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 8,
  },
  characterCountError: {
    color: '#FF3B30',
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
