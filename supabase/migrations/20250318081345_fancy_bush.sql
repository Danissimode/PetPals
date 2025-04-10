/*
  # Initial Schema for Animal Registry

  1. New Tables
    - `users` - User accounts
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `full_name` (text)
      - `language` (text) - 'en' or 'uk'

    - `animals` - Animal records
      - `id` (uuid, primary key) 
      - `owner_id` (uuid, foreign key)
      - `metric_number` (text, unique, optional)
      - `full_name` (text, optional)
      - `nickname` (text)
      - `species_id` (uuid, foreign key)
      - `breed_id` (uuid, foreign key)
      - `color_id` (uuid, foreign key)
      - `birth_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `species` - Animal species reference
      - `id` (uuid, primary key)
      - `name_en` (text)
      - `name_uk` (text)

    - `breeds` - Animal breeds reference
      - `id` (uuid, primary key)
      - `species_id` (uuid, foreign key)
      - `name_en` (text)
      - `name_uk` (text)

    - `colors` - Animal colors reference
      - `id` (uuid, primary key)
      - `name_en` (text)
      - `name_uk` (text)

    - `pedigree_relations` - Animal family relationships
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key)
      - `relative_id` (uuid, foreign key)
      - `relation_type` (text) - 'parent', 'child', 'sibling'
      - `confirmed` (boolean)
      - `created_at` (timestamp)

    - `pedigree_requests` - Requests to confirm relations
      - `id` (uuid, primary key)
      - `from_user_id` (uuid, foreign key)
      - `to_user_id` (uuid, foreign key)
      - `animal_id` (uuid, foreign key)
      - `relative_id` (uuid, foreign key)
      - `relation_type` (text)
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Secure user data and animal ownership

  3. Indexes
    - Add indexes for frequent queries
    - Optimize search performance
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  full_name text,
  language text DEFAULT 'en' CHECK (language IN ('en', 'uk'))
);

-- Species reference table
CREATE TABLE species (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en text NOT NULL,
  name_uk text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Breeds reference table
CREATE TABLE breeds (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  species_id uuid REFERENCES species(id),
  name_en text NOT NULL,
  name_uk text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Colors reference table
CREATE TABLE colors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en text NOT NULL,
  name_uk text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Animals table
CREATE TABLE animals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid REFERENCES users(id) NOT NULL,
  metric_number text UNIQUE,
  full_name text,
  nickname text NOT NULL,
  species_id uuid REFERENCES species(id) NOT NULL,
  breed_id uuid REFERENCES breeds(id) NOT NULL,
  color_id uuid REFERENCES colors(id) NOT NULL,
  birth_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pedigree relations table
CREATE TABLE pedigree_relations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  relative_id uuid REFERENCES animals(id) NOT NULL,
  relation_type text NOT NULL CHECK (relation_type IN ('parent', 'child', 'sibling')),
  confirmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(animal_id, relative_id, relation_type)
);

-- Pedigree requests table
CREATE TABLE pedigree_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id uuid REFERENCES users(id) NOT NULL,
  to_user_id uuid REFERENCES users(id) NOT NULL,
  animal_id uuid REFERENCES animals(id) NOT NULL,
  relative_id uuid REFERENCES animals(id) NOT NULL,
  relation_type text NOT NULL CHECK (relation_type IN ('parent', 'child', 'sibling')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedigree_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedigree_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Policies for animals
CREATE POLICY "Animals are viewable by owner" ON animals
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Animals are editable by owner" ON animals
  FOR ALL TO authenticated
  USING (owner_id = auth.uid());

-- Policies for pedigree relations
CREATE POLICY "Pedigree relations are viewable by related animal owners" ON pedigree_relations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE (animals.id = pedigree_relations.animal_id OR animals.id = pedigree_relations.relative_id)
      AND animals.owner_id = auth.uid()
    )
  );

-- Policies for pedigree requests
CREATE POLICY "Pedigree requests are viewable by involved users" ON pedigree_requests
  FOR SELECT TO authenticated
  USING (
    from_user_id = auth.uid() OR to_user_id = auth.uid()
  );

CREATE POLICY "Pedigree requests are creatable by from_user" ON pedigree_requests
  FOR INSERT TO authenticated
  WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Pedigree requests are updatable by to_user" ON pedigree_requests
  FOR UPDATE TO authenticated
  USING (to_user_id = auth.uid());

-- Policies for reference tables
CREATE POLICY "Reference data is readable by all authenticated users" ON species
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Reference data is readable by all authenticated users" ON breeds
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Reference data is readable by all authenticated users" ON colors
  FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX animals_metric_number_idx ON animals(metric_number);
CREATE INDEX animals_full_name_idx ON animals(full_name);
CREATE INDEX pedigree_relations_animal_id_idx ON pedigree_relations(animal_id);
CREATE INDEX pedigree_relations_relative_id_idx ON pedigree_relations(relative_id);
CREATE INDEX pedigree_requests_status_idx ON pedigree_requests(status);
CREATE INDEX breeds_species_id_idx ON breeds(species_id);

-- Function to search for potential relatives
CREATE OR REPLACE FUNCTION search_potential_relatives(
  p_metric_number text,
  p_full_name text
) RETURNS TABLE (
  animal_id uuid,
  owner_id uuid,
  similarity double precision
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.owner_id,
    GREATEST(
      COALESCE(
        CASE 
          WHEN p_metric_number IS NOT NULL AND a.metric_number IS NOT NULL 
          THEN similarity(p_metric_number, a.metric_number)
          ELSE 0
        END,
        0
      ),
      COALESCE(
        CASE 
          WHEN p_full_name IS NOT NULL AND a.full_name IS NOT NULL 
          THEN similarity(p_full_name, a.full_name)
          ELSE 0
        END,
        0
      )
    ) as similarity_score
  FROM animals a
  WHERE 
    (p_metric_number IS NOT NULL AND a.metric_number IS NOT NULL AND 
     similarity(p_metric_number, a.metric_number) > 0.8)
    OR
    (p_full_name IS NOT NULL AND a.full_name IS NOT NULL AND 
     similarity(p_full_name, a.full_name) > 0.8)
  ORDER BY similarity_score DESC;
END;
$$;
