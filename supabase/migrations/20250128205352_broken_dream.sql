/*
  # Add Animals Feature

  1. New Tables
    - `animals`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `type` (text)
      - `age` (integer)
      - `description` (text, nullable)
      - `profile_picture` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add `animal_tags` array to posts table

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
ALTER TABLE posts ADD COLUMN IF NOT EXISTS animal_tags uuid[] DEFAULT '{}';

-- Enable RLS
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

-- Animals policies
CREATE POLICY "Users can view animals"
  ON animals FOR SELECT
  USING (true);

CREATE POLICY "Users can create own animals"
  ON animals FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own animals"
  ON animals FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own animals"
  ON animals FOR DELETE
  USING (auth.uid() = owner_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS animals_owner_id_idx ON animals(owner_id);
CREATE INDEX IF NOT EXISTS animals_name_idx ON animals(name);
CREATE INDEX IF NOT EXISTS animals_type_idx ON animals(type);
