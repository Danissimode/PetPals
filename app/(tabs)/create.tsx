import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { supabase } from '../../lib/supabase'; // путь к supabase клиенту проверь по своей структуре
import { uploadImage } from '../../utils/uploadImage'; // путь проверь
import { Animal } from '../../types'; // если у тебя типы вынесены в отдельный файл

export default function CreateScreen() {
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null); // уточни тип при необходимости
  const [postType, setPostType] = useState('regular');
  const [location, setLocation] = useState<string | null>(null);
  const [petTags, setPetTags] = useState<string[]>([]);
  const [reward, setReward] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      setUser(data?.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchAnimals = async () => {
      if (!user?.id) return;
      const { data: animalsData, error } = await supabase
        .from('animals')
        .select()
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching animals:', error);
        return;
      }

      setAnimals(animalsData || []);
    };

    fetchAnimals();
  }, [user]);

  const handlePost = async () => {
    if (!selectedImage || !postText.trim()) return;

    try {
      setIsPosting(true);
      setUploadError(null);

      const imageUrl = await uploadImage(selectedImage);

      await supabase.from('posts').insert([
        {
          user_id: user.id,
          caption: postText.trim(),
          image_url: imageUrl,
          type: postType,
          location,
          tags: petTags,
          reward: reward ? Number(reward) : null,
          animal_id: selectedAnimal,
          created_at: new Date().toISOString(),
        },
      ]);

      // сброс полей после публикации
      setPostText('');
      setSelectedImage(null);
      setSelectedAnimal(null);
      setPetTags([]);
      setReward(null);
    } catch (err) {
      console.error('Error creating post:', err);
      setUploadError('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* UI элементов может быть больше — вставляй сюда форму */}
      <View style={styles.animalSelector}>
        <Text style={styles.selectorLabel}>Post on behalf of:</Text>
        <View style={styles.animalOptions}>
          <TouchableOpacity
            style={[
              styles.animalOption,
              selectedAnimal === null && styles.selectedAnimalOption,
            ]}
            onPress={() => setSelectedAnimal(null)}
          >
            <Text style={styles.animalOptionText}>You</Text>
          </TouchableOpacity>
          {animals.map((animal) => (
            <TouchableOpacity
              key={animal.id}
              style={[
                styles.animalOption,
                selectedAnimal === animal.id && styles.selectedAnimalOption,
              ]}
              onPress={() => setSelectedAnimal(animal.id)}
            >
              <Text style={styles.animalOptionText}>{animal.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  animalSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  animalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  animalOption: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAnimalOption: {
    backgroundColor: '#FF9F1C',
  },
  animalOptionText: {
    fontSize: 14,
    color: '#333333',
  },
});
