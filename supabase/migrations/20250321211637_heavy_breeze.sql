/*
  # Add User Roles and Profile Types

  1. New Tables
    - `roles` - User role definitions
      - `id` (uuid, primary key)
      - `name` (text) - 'super_admin', 'admin', 'moderator', 'user'
      - `description` (text)
      - `created_at` (timestamp)

    - `user_roles` - User role assignments
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `role_id` (uuid, foreign key)
      - `created_at` (timestamp)
      - `created_by` (uuid, foreign key)

    - `profile_types` - Profile type definitions
      - `id` (uuid, primary key)
      - `name` (text) - 'personal', 'pro_personal', 'pro_business'
      - `description` (text)
      - `created_at` (timestamp)

    - `user_profiles` - Extended user profile information
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `profile_type_id` (uuid, foreign key)
      - `first_name` (text)
      - `last_name` (text)
      - `bio` (text)
      - `phone` (text)
      - `location` (text)
      - `preferences` (jsonb)
      - `services` (jsonb) - For pro accounts
      - `experience` (jsonb) - For pro accounts
      - `pricing` (jsonb) - For pro accounts
      - `availability` (jsonb) - For pro accounts
      - `company_name` (text) - For business accounts
      - `company_description` (text) - For business accounts
      - `licenses` (jsonb) - For business accounts
      - `business_hours` (jsonb) - For business accounts
      - `business_address` (text) - For business accounts
      - `business_contacts` (jsonb) - For business accounts
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Secure role assignments
*/

-- Create roles table
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE CHECK (name IN ('super_admin', 'admin', 'moderator', 'user')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) NOT NULL,
  role_id uuid REFERENCES roles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id) NOT NULL,
  UNIQUE(user_id, role_id)
);

-- Create profile_types table
CREATE TABLE profile_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE CHECK (name IN ('personal', 'pro_personal', 'pro_business')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) NOT NULL UNIQUE,
  profile_type_id uuid REFERENCES profile_types(id) NOT NULL,
  first_name text,
  last_name text,
  bio text,
  phone text,
  location text,
  preferences jsonb DEFAULT '{}'::jsonb,
  services jsonb DEFAULT '{}'::jsonb,
  experience jsonb DEFAULT '{}'::jsonb,
  pricing jsonb DEFAULT '{}'::jsonb,
  availability jsonb DEFAULT '{}'::jsonb,
  company_name text,
  company_description text,
  licenses jsonb DEFAULT '{}'::jsonb,
  business_hours jsonb DEFAULT '{}'::jsonb,
  business_address text,
  business_contacts jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for roles
CREATE POLICY "Roles are viewable by authenticated users" ON roles
  FOR SELECT TO authenticated USING (true);

-- Policies for user_roles
CREATE POLICY "User roles are viewable by admins" ON user_roles
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('super_admin', 'admin')
  ));

CREATE POLICY "Super admins can manage all roles" ON user_roles
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'super_admin'
  ));

CREATE POLICY "Admins can manage non-super-admin roles" ON user_roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
    AND NOT EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = user_roles.role_id
      AND r.name = 'super_admin'
    )
  );

-- Policies for profile_types
CREATE POLICY "Profile types are viewable by authenticated users" ON profile_types
  FOR SELECT TO authenticated USING (true);

-- Policies for user_profiles
CREATE POLICY "User profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert initial roles
INSERT INTO roles (name, description) VALUES
  ('super_admin', 'Super Administrator with full system access'),
  ('admin', 'Administrator with limited system access'),
  ('moderator', 'Content moderator'),
  ('user', 'Regular user');

-- Insert profile types
INSERT INTO profile_types (name, description) VALUES
  ('personal', 'Standard personal account'),
  ('pro_personal', 'Professional personal account'),
  ('pro_business', 'Professional business account');

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name = role_name
  );
END;
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles()
RETURNS TABLE (role_name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT r.name
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = auth.uid();
END;
$$;

-- Create function to check if user has admin access
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('super_admin', 'admin', 'moderator')
  );
END;
$$;
