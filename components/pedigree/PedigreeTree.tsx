 import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';

type Animal = Database['public']['Tables']['animals']['Row'];

interface PedigreeTreeProps {
  rootPetId: string;
}

export default function PedigreeTree({ rootPetId }: PedigreeTreeProps) {
  const [tree, setTree] = useState<{
    root: Animal | null;
    father: Animal | null;
    mother: Animal | null;
    paternalGrandparents: { father: Animal | null; mother: Animal | null };
    maternalGrandparents: { father: Animal | null; mother: Animal | null };
  }>({
    root: null,
    father: null,
    mother: null,
    paternalGrandparents: { father: null, mother: null },
    maternalGrandparents: { father: null, mother: null },
  });

  useEffect(() => {
    if (!rootPetId) return;

    const fetchTree = async () => {
      const fetchAnimal = async (id?: string | null): Promise<Animal | null> => {
        if (!id) return null;
        const { data, error } = await supabase
          .from('animals')
          .select()
          .eq('id', id)
          .single();
        return error ? null : data;
      };

      const root = await fetchAnimal(rootPetId);
      const father = await fetchAnimal(root?.father_id);
      const mother = await fetchAnimal(root?.mother_id);
      const paternalGrandfather = await fetchAnimal(father?.father_id);
      const paternalGrandmother = await fetchAnimal(father?.mother_id);
      const maternalGrandfather = await fetchAnimal(mother?.father_id);
      const maternalGrandmother = await fetchAnimal(mother?.mother_id);

      setTree({
        root,
        father,
        mother,
        paternalGrandparents: {
          father: paternalGrandfather,
          mother: paternalGrandmother,
        },
        maternalGrandparents: {
          father: maternalGrandfather,
          mother: maternalGrandmother,
        },
      });
    };

    fetchTree();
  }, [rootPetId]);

  const renderPetBox = (pet: Animal | null, label?: string) => {
    if (!pet) return null;
    return (
      <View style={styles.petBox}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>{pet.breed || pet.type}</Text>
      </View>
    );
  };

  return (
    <View style={styles.treeContainer}>
      {renderPetBox(tree.root, 'Pet')}
      <View style={styles.level}>
        {renderPetBox(tree.father, 'Father')}
        {renderPetBox(tree.mother, 'Mother')}
      </View>
      <View style={styles.level}>
        {renderPetBox(tree.paternalGrandparents.father, 'Paternal Grandfather')}
        {renderPetBox(tree.paternalGrandparents.mother, 'Paternal Grandmother')}
        {renderPetBox(tree.maternalGrandparents.father, 'Maternal Grandfather')}
        {renderPetBox(tree.maternalGrandparents.mother, 'Maternal Grandmother')}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  treeContainer: {
    gap: 24,
  },
  level: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  petBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    width: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#00000022',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  details: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  label: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
    textAlign: 'center',
  },
});
