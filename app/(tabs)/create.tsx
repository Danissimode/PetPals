import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { Camera, Image as ImageIcon, MapPin, Tag, X } from 'lucide-react-native';

export default function CreateScreen() {
  const [postType, setPostType] = useState('regular'); // 'regular', 'lost', 'found'
  const [selectedImage, setSelectedImage] = useState(null);
  const [postText, setPostText] = useState('');
  const [location, setLocation] = useState('');
  const [petTags, setPetTags] = useState([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setPetTags([...petTags, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...petTags];
    updatedTags.splice(index, 1);
    setPetTags(updatedTags);
  };

  const mockSelectImage = () => {
    setSelectedImage('https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  };

  const mockTakePhoto = () => {
    setSelectedImage('https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  };

  const mockGetLocation = () => {
    setLocation('Central Park, New York');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postTypeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, postType === 'regular' && styles.selectedTypeButton]}
          onPress={() => setPostType('regular')}>
          <Text style={[styles.typeButtonText, postType === 'regular' && styles.selectedTypeButtonText]}>Regular Post</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, postType === 'lost' && styles.selectedTypeButton]}
          onPress={() => setPostType('lost')}>
          <Text style={[styles.typeButtonText, postType === 'lost' && styles.selectedTypeButtonText]}>Lost Pet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, postType === 'found' && styles.selectedTypeButton]}
          onPress={() => setPostType('found')}>
          <Text style={[styles.typeButtonText, postType === 'found' && styles.selectedTypeButtonText]}>Found Pet</Text>
        </TouchableOpacity>
      </View>

      {postType !== 'regular' && (
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>
            {postType === 'lost' ? '🔍 Lost Pet Alert' : '🐾 Found Pet Report'}
          </Text>
          <Text style={styles.alertDescription}>
            {postType === 'lost'
              ? 'This post will be highlighted in the community and sent as an alert to users in your area.'
              : 'Thank you for helping! This post will be matched with lost pet reports in the area.'}
          </Text>
        </View>
      )}

      <View style={styles.imageSection}>
        {selectedImage ? (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setSelectedImage(null)}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageOptions}>
            <TouchableOpacity style={styles.imageOptionButton} onPress={mockTakePhoto}>
              <Camera size={24} color="#FF9F1C" />
              <Text style={styles.imageOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageOptionButton} onPress={mockSelectImage}>
              <ImageIcon size={24} color="#FF9F1C" />
              <Text style={styles.imageOptionText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TextInput
        style={styles.postInput}
        placeholder={
          postType === 'regular'
            ? "What's happening with your pet today?"
            : postType === 'lost'
            ? 'Describe your lost pet (breed, color, name, etc.)'
            : 'Describe the pet you found (breed, color, etc.)'
        }
        multiline
        value={postText}
        onChangeText={setPostText}
      />

      {(postType === 'lost' || postType === 'found') && (
        <View style={styles.tagsSection}>
          <View style={styles.sectionHeader}>
            <Tag size={16} color="#666666" />
            <Text style={styles.sectionTitle}>Pet Details</Text>
          </View>
          <View style={styles.tagsContainer}>
            {petTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                  <X size={14} color="#666666" />
                </TouchableOpacity>
              </View>
            ))}
            {showTagInput ? (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder="Add detail (e.g., 'Brown', 'Collar')"
                  value={newTag}
                  onChangeText={setNewTag}
                  autoFocus
                  onSubmitEditing={handleAddTag}
                />
                <TouchableOpacity onPress={handleAddTag}>
                  <Text style={styles.addTagButton}>Add</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addTagContainer} onPress={() => setShowTagInput(true)}>
                <Text style={styles.addTagText}>+ Add Detail</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.locationSection}>
        <View style={styles.sectionHeader}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.sectionTitle}>Location</Text>
        </View>
        <TouchableOpacity style={styles.locationButton} onPress={mockGetLocation}>
          {location ? (
            <Text style={styles.locationText}>{location}</Text>
          ) : (
            <Text style={styles.addLocationText}>Add Location</Text>
          )}
        </TouchableOpacity>
      </View>

      {postType === 'lost' && (
        <View style={styles.rewardSection}>
          <Text style={styles.rewardTitle}>Add Reward (Optional)</Text>
          <View style={styles.rewardInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.rewardInput}
              placeholder="Amount"
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.postButton,
          (!selectedImage || !postText) && styles.disabledPostButton,
        ]}
        disabled={!selectedImage || !postText}>
        <Text style={styles.postButtonText}>
          {postType === 'regular' ? 'Post' : postType === 'lost' ? 'Post Lost Pet Alert' : 'Post Found Pet Report'}
        </Text>
      </TouchableOpacity>

      {postType === 'lost' && (
        <View style={styles.aiTip}>
          <Text style={styles.aiTipText}>
            <Text style={styles.aiTipBold}>AI Tip:</Text> Lost pet posts with clear photos and detailed descriptions have a 70% higher chance of successful recovery.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  postTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedTypeButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  typeButtonText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  selectedTypeButtonText: {
    color: '#FF9F1C',
    fontWeight: 'bold',
  },
  alertBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FF9F1C',
  },
  alertDescription: {
    fontSize: 14,
    color: '#666666',
  },
  imageSection: {
    marginBottom: 16,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderStyle: 'dashed',
  },
  imageOptionButton: {
    alignItems: 'center',
  },
  imageOptionText: {
    marginTop: 8,
    color: '#666666',
  },
  selectedImageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInput: {
    minHeight: 100,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  tagsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    marginRight: 6,
    fontSize: 14,
  },
  addTagContainer: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  addTagText: {
    color: '#FF9F1C',
    fontSize: 14,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 6 : 0,
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
  },
  addTagButton: {
    color: '#FF9F1C',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  locationSection: {
    marginBottom: 16,
  },
  locationButton: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  locationText: {
    fontSize: 14,
  },
  addLocationText: {
    color: '#FF9F1C',
    fontSize: 14,
  },
  rewardSection: {
    marginBottom: 16,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rewardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666666',
    marginRight: 4,
  },
  rewardInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#FF9F1C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledPostButton: {
    backgroundColor: '#FFD5A5',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiTip: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  aiTipText: {
    fontSize: 14,
    color: '#666666',
  },
  aiTipBold: {
    fontWeight: 'bold',
  },
});
