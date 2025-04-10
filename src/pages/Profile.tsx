import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AnimalCard } from '../components/AnimalCard';
import { AddAnimalModal } from '../components/AddAnimalModal';
import type { Database } from '../lib/supabase-types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Animal = Database['public']['Tables']['animals']['Row'];

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      const { data: profiles } = await supabase
        .from('profiles')
        .select()
        .eq('username', username)
        .single();

      if (profiles) {
        setProfile(profiles);
        
        const { data: userAnimals } = await supabase
          .from('animals')
          .select()
          .eq('owner_id', profiles.id);
          
        if (userAnimals) {
          setAnimals(userAnimals);
        }

        const { data: { user } } = await supabase.auth.getUser();
        setIsOwner(user?.id === profiles.id);
      }
    };

    fetchProfile();
  }, [username]);

  const handleAnimalAdded = async () => {
    if (profile) {
      const { data: userAnimals } = await supabase
        .from('animals')
        .select()
        .eq('owner_id', profile.id);
        
      if (userAnimals) {
        setAnimals(userAnimals);
      }
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <img
          src={profile.avatar_url || 'https://via.placeholder.com/150'}
          alt={profile.username}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          {profile.full_name && (
            <p className="text-gray-600">{profile.full_name}</p>
          )}
          {profile.bio && <p className="mt-2">{profile.bio}</p>}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pets</h2>
          {isOwner && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Pet</span>
            </button>
          )}
        </div>

        {animals.length === 0 ? (
          <p className="text-gray-500">No pets added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>

      <AddAnimalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAnimalAdded}
      />
    </div>
  );
}
