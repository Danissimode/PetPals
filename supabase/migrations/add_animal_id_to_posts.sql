/*
      # Add animal_id column to posts table and correct RLS policy

      1. Changes
        - Adds an optional `animal_id` column (UUID) to the `posts` table.
        - Adds a foreign key constraint referencing the `animals` table.
        - Creates a function `is_animal_owner` to check ownership.
        - Corrects the RLS policy to use the function for efficient and correct ownership check.

      2. Security
        - Row Level Security (RLS) policies are updated to maintain data integrity and access control. Only the owner of the animal can post on its behalf.

      3. Notes
        - This migration is designed to be idempotent. If the column already exists, no changes will be made.
        - The RLS policy now uses a function for efficient and correct ownership check.  This avoids the limitations of using `NEW` within a correlated subquery in Supabase's RLS.
    */

    -- Add animal_id column with foreign key constraint
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS animal_id UUID REFERENCES animals(id);

    -- Create a function to check animal ownership
    CREATE OR REPLACE FUNCTION is_animal_owner(p_animal_id UUID, p_user_id UUID)
      RETURNS BOOLEAN AS $$
    BEGIN
      RETURN (p_animal_id IS NULL) OR EXISTS (SELECT 1 FROM animals WHERE id = p_animal_id AND owner_id = p_user_id);
    END;
    $$ LANGUAGE plpgsql;

    -- Drop the existing policy if it exists
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.table_privileges WHERE grantee = 'authenticated' AND privilege_type = 'INSERT' AND table_name = 'posts') THEN
        DROP POLICY IF EXISTS "Users can create posts for their animals" ON posts;
      END IF;
    END $$;

    -- Recreate the policy using the function
    CREATE POLICY "Users can create posts for their animals"
      ON posts
      FOR INSERT
      TO authenticated
      WITH CHECK (is_animal_owner(animal_id, auth.uid()));
