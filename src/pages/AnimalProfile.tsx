import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Animal = Database['public']['Tables']['animals']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function AnimalProfile() {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;

      const { data: animalData } = await supabase
        .from('animals')
        .select()
        .eq('id', id)
        .single();

      if (animalData) {
        setAnimal(animalData);

        const { data: ownerData } = await supabase
          .from('profiles')
          .select()
          .eq('id', animalData.owner_id)
          .single();

        if (ownerData) {
          setOwner(ownerData);
        }
      }
    };

    fetchAnimal();
  }, [id]);

  if (!animal || !owner) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64">
          {animal.profile_picture ? (
            <img
              src={animal.profile_picture}
              alt={animal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <PawPrint className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{animal.name}</h1>
              <p className="text-gray-600 capitalize">{animal.type}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Age</p>
              <p className="text-xl font-semibold">{animal.age} years</p>
            </div>
          </div>

          {animal.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700">{animal.description}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Owner</h2>
            <div className="flex items-center space-x-3">
              <img
                src={owner.avatar_url || 'https://via.placeholder.com/40'}
                alt={owner.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{owner.username}</p>
                {owner.full_name && (
                  <p className="text-sm text-gray-600">{owner.full_name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
