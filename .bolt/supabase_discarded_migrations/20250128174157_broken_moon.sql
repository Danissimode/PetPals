/*
  # Add Animals Feature

  1. New Tables
    - `animals`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `type` (text)
      - `age` (integer)
      - `description` (text)
      - `profile_picture` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add animal_tags array to posts table
    
  3. Security
    - Enable RLS on animals table
    - Add policies for CRUD operations
*/

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  age integer NOT NULL,
  description text,
  profile_picture text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add animal_tags to posts
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'animal_tags'
  ) THEN
    ALTER TABLE posts ADD COLUMN animal_tags uuid[] DEFAULT '{}';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Animals policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'animals' AND policyname = 'Animals are viewable by everyone'
  ) THEN
    CREATE POLICY "Animals are viewable by everyone"
      ON animals FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'animals' AND policyname = 'Users can create animals'
  ) THEN
    CREATE POLICY "Users can create animals"
      ON animals FOR INSERT
      WITH CHECK (auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'animals' AND policyname = 'Users can update own animals'
  ) THEN
    CREATE POLICY "Users can update own animals"
      ON animals FOR UPDATE
      USING (auth.uid() = owner_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'animals' AND policyname = 'Users can delete own animals'
  ) THEN
    CREATE POLICY "Users can delete own animals"
      ON animals FOR DELETE
      USING (auth.uid() = owner_id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS animals_owner_id_idx ON animals(owner_id);
CREATE INDEX IF NOT EXISTS animals_name_idx ON animals(name);
CREATE INDEX IF NOT EXISTS animals_type_idx ON animals(type);
