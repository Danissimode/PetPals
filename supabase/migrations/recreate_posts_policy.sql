/*
      # Recreate "Users can create posts for their animals" policy on posts table

      1. Changes
        - Drops the existing "Users can create posts for their animals" policy if it exists.
        - Creates a new "Users can create posts for their animals" policy with improved logic using a correlated subquery within the WITH CHECK clause.
        - Ensures Row Level Security (RLS) is enabled for the `posts` table.

      2. Security
        - This migration ensures that only authenticated users can create posts, and only if the `animal_id` is NULL or belongs to the authenticated user.  The policy efficiently handles both cases using a correlated subquery.

      3. Notes
        - This migration is idempotent; running it multiple times will have no additional effect after the first execution.
        - The use of a correlated subquery within WITH CHECK is the most efficient and reliable way to implement this RLS policy in Supabase.
    */

    -- Drop the existing policy if it exists
    DROP POLICY IF EXISTS "Users can create posts for their animals" ON posts;

    -- Recreate the policy using a correlated subquery within WITH CHECK
    CREATE POLICY "Users can create posts for their animals"
      ON posts
      FOR INSERT
      TO authenticated
      WITH CHECK (
        animal_id IS NULL
        OR EXISTS (
          SELECT 1
          FROM animals
          WHERE animals.id = posts.animal_id
            AND animals.owner_id = auth.uid()
        )
      );

    -- Ensure RLS is enabled
    ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
