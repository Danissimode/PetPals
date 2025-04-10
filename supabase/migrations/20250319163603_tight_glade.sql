/*
  # Add Social Features Policies and Indexes

  1. Purpose
    - Add RLS policies for existing social tables
    - Create indexes for better performance
    - Ensure idempotent operations

  2. Changes
    - Add RLS policies for posts, comments, stories
    - Create performance indexes
    - Add constraints and checks
*/

-- Enable RLS on existing tables
DO $$ 
BEGIN
  ALTER TABLE IF EXISTS posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS comments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS stories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS story_views ENABLE ROW LEVEL SECURITY;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
  DROP POLICY IF EXISTS "Users can create posts" ON posts;
  DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
  DROP POLICY IF EXISTS "Users can create comments" ON comments;
  DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
  DROP POLICY IF EXISTS "Stories are viewable by everyone" ON stories;
  DROP POLICY IF EXISTS "Users can create stories" ON stories;
  DROP POLICY IF EXISTS "Users can delete own stories" ON stories;
  DROP POLICY IF EXISTS "Story views are viewable by story owner" ON story_views;
  DROP POLICY IF EXISTS "Users can create story views" ON story_views;
END $$;

-- Create policies for posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for comments
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for stories
CREATE POLICY "Stories are viewable by everyone" ON stories
  FOR SELECT USING (expires_at > now());

CREATE POLICY "Users can create stories" ON stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON stories
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for story views
CREATE POLICY "Story views are viewable by story owner" ON story_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_views.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create story views" ON story_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'posts_user_id_idx') THEN
    CREATE INDEX posts_user_id_idx ON posts(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'comments_post_id_idx') THEN
    CREATE INDEX comments_post_id_idx ON comments(post_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'comments_user_id_idx') THEN
    CREATE INDEX comments_user_id_idx ON comments(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'stories_user_id_idx') THEN
    CREATE INDEX stories_user_id_idx ON stories(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'stories_expires_at_idx') THEN
    CREATE INDEX stories_expires_at_idx ON stories(expires_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'story_views_story_id_idx') THEN
    CREATE INDEX story_views_story_id_idx ON story_views(story_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'story_views_user_id_idx') THEN
    CREATE INDEX story_views_user_id_idx ON story_views(user_id);
  END IF;
END $$;
