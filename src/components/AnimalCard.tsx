import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import type { Database } from '../lib/supabase-types';

type Animal = Database['public']['Tables']['animals']['Row'];

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <Link to={`/animals/${animal.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {animal.profile_picture ? (
          <img
            src={animal.profile_picture}
            alt={animal.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <PawPrint className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold">{animal.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{animal.type}</p>
          <p className="text-sm text-gray-500">{animal.age} years old</p>
          {animal.description && (
            <p className="mt-2 text-sm text-gray-700 line-clamp-2">
              {animal.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
