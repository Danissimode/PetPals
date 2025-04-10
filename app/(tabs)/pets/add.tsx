import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Camera, Calendar, Dna, Award } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AddPetScreen() {
  const [petInfo, setPetInfo] = useState({
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    color: '',
    metricNumber: '',
    hasPedigree: false,
  });

  const [image, setImage] = useState(null);

  const handleSave = () => {
    // Here would be the logic to save the pet
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.imageUpload}
        onPress={() => {/* Handle image upload */}}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Camera size={32} color="#666666" />
            <Text style={styles.uploadText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pet Name *</Text>
          <TextInput
            style={styles.input}
            value={petInfo.name}
            onChangeText={(text) => setPetInfo({ ...petInfo, name: text })}
            placeholder="Enter pet's name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Species *</Text>
          <TextInput
            style={styles.input}
            value={petInfo.species}
            onChangeText={(text) => setPetInfo({ ...petInfo, species: text })}
            placeholder="e.g., Dog, Cat"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed *</Text>
          <TextInput
            style={styles.input}
            value={petInfo.breed}
            onChangeText={(text) => setPetInfo({ ...petInfo, breed: text })}
            placeholder="Enter breed"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Calendar size={20} color="#666666" />
            <Text style={styles.dateText}>
              {petInfo.birthDate || 'Select birth date'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={petInfo.color}
            onChangeText={(text) => setPetInfo({ ...petInfo, color: text })}
            placeholder="Enter color"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Metric Number</Text>
          <TextInput
            style={styles.input}
            value={petInfo.metricNumber}
            onChangeText={(text) => setPetInfo({ ...petInfo, metricNumber: text })}
            placeholder="Enter metric number if available"
          />
        </View>

        <TouchableOpacity 
          style={styles.pedigreeButton}
          onPress={() => setPetInfo({ ...petInfo, hasPedigree: !petInfo.hasPedigree })}>
          <Dna size={24} color={petInfo.hasPedigree ? '#FF9F1C' : '#666666'} />
          <View style={styles.pedigreeInfo}>
            <Text style={styles.pedigreeTitle}>Has Pedigree</Text>
            <Text style={styles.pedigreeDescription}>
              Add pedigree information and track lineage
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, !petInfo.name && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!petInfo.name}>
          <Text style={styles.saveButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#666666',
    fontSize: 14,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666666',
  },
  pedigreeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  pedigreeInfo: {
    marginLeft: 12,
  },
  pedigreeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  pedigreeDescription: {
    fontSize: 14,
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#FF9F1C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#FFD5A5',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
