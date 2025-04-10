// ... (Existing code) ...

      const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
      const [animals, setAnimals] = useState<Animal[]>([]);

      useEffect(() => {
        const fetchAnimals = async () => {
          const { data: animalsData, error } = await supabase
            .from('animals')
            .select()
            .eq('owner_id', user?.id);

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
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error || !user) throw new Error('No user');

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
              animal_id: selectedAnimal, // Add animal_id
              created_at: new Date().toISOString(),
            },
          ]);

          // ... (Rest of the code) ...
        } catch (err) {
          // ... (Error handling) ...
        } finally {
          // ... (Cleanup) ...
        }
      };

      return (
        <ScrollView style={styles.container}>
          {/* ... (Existing UI elements) ... */}

          <View style={styles.animalSelector}>
            <Text style={styles.selectorLabel}>Post on behalf of:</Text>
            <View style={styles.animalOptions}>
              <TouchableOpacity
                style={[styles.animalOption, selectedAnimal === null && styles.selectedAnimalOption]}
                onPress={() => setSelectedAnimal(null)}
              >
                <Text style={styles.animalOptionText}>You</Text>
              </TouchableOpacity>
              {animals.map((animal) => (
                <TouchableOpacity
                  key={animal.id}
                  style={[styles.animalOption, selectedAnimal === animal.id && styles.selectedAnimalOption]}
                  onPress={() => setSelectedAnimal(animal.id)}
                >
                  <Text style={styles.animalOptionText}>{animal.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ... (Rest of the UI elements) ... */}
        </ScrollView>
      );
    }

    // ... (Existing styles) ...

    const styles = StyleSheet.create({
      // ... (Existing styles) ...
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
