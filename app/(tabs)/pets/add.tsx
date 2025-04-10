import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera, Calendar, Dna } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
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

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setPetInfo({ ...petInfo, birthDate: iso });
    }
  };

  const handleSave = async () => {
    const { data, error } = await supabase.from('animals').insert([
      {
        name: petInfo.name,
        type: petInfo.species,
        breed: petInfo.breed,
        birth_date: petInfo.birthDate || null,
        color: petInfo.color,
        metric_number: petInfo.metricNumber,
        profile_picture: imageUri,
        has_pedigree: petInfo.hasPedigree,
      },
    ]);

    if (error) {
      console.error('Error saving pet:', error.message);
      return;
    }

    router.replace('/(tabs)/pets');
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Camera size={32} color="#666666" />
            <Text style={styles.uploadText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        {[
          { label: 'Pet Name *', value: 'name', placeholder: 'Enter name' },
          { label: 'Species *', value: 'species', placeholder: 'e.g. Dog, Cat' },
          { label: 'Breed *', value: 'breed', placeholder: 'Enter breed' },
          { label: 'Color', value: 'color', placeholder: 'Enter color' },
          { label: 'Metric Number', value: 'metricNumber', placeholder: 'Optional ID' },
        ].map(({ label, value, placeholder }) => (
          <View style={styles.inputGroup} key={value}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={petInfo[value as keyof typeof petInfo]}
              onChangeText={(text) =>
                setPetInfo({ ...petInfo, [value]: text })
              }
              placeholder={placeholder}
            />
          </View>
        ))}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color="#666666" />
            <Text style={styles.dateText}>
              {petInfo.birthDate || 'Select birth date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={petInfo.birthDate ? new Date(petInfo.birthDate) : new Date()}
              onChange={handleDateChange}
              maximumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.pedigreeButton}
          onPress={() =>
            setPetInfo({ ...petInfo, hasPedigree: !petInfo.hasPedigree })
          }
        >
          <Dna
            size={24}
            color={petInfo.hasPedigree ? '#FF9F1C' : '#666666'}
          />
          <View style={styles.pedigreeInfo}>
            <Text style={styles.pedigreeTitle}>Has Pedigree</Text>
            <Text style={styles.pedigreeDescription}>
              Add pedigree information and track lineage
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            !petInfo.name || !petInfo.breed || !petInfo.species
              ? styles.saveButtonDisabled
              : {},
          ]}
          onPress={handleSave}
          disabled={!petInfo.name || !petInfo.breed || !petInfo.species}
        >
          <Text style={styles.saveButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
