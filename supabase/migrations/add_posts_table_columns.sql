/*
      # Add missing columns to posts table

      1. Changes
        - Added missing columns to the `posts` table: `type`, `location`, `tags`, `reward`, `created_at`.
        - Ensured correct data types for each column.
        - Added default values where appropriate.

      2. Security
        - Enabled Row Level Security (RLS) on the `posts` table.
        - Added RLS policies to control access to posts based on user authentication.  Authenticated users can only read, update, and delete their own posts.

      3. Notes
        - This migration assumes the `posts` table already exists. If not, create it first.
        - The `type` column is defined as `text` to allow for future extensibility.  Consider using an `enum` if the types are fixed.
        - The `tags` column is an array of text to allow for multiple tags.
        - The `reward` column is nullable to allow for posts without rewards.
    */

    -- Add missing columns to the posts table
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'regular';
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS location TEXT;
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS reward NUMERIC;
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    -- Enable Row Level Security (RLS)
    ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

    -- RLS policies for authenticated users
    CREATE POLICY "Users can read own posts" ON posts FOR SELECT TO authenticated USING (auth.uid() = user_id);
    CREATE POLICY "Users can create posts" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update own posts" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete own posts" ON posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

    -- Add index for user_id
    CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts (user_id);
