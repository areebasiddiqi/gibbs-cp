-- 🛠️ FIX EVERYTHING SCRIPT
-- Run this script to:
-- 1. Fix the database relationship so author names show up
-- 2. Update security policies so EVERYONE can see ALL reflections

BEGIN;

-- 1. Fix Foreign Key (Reflections -> Profiles)
DO $$ 
BEGIN
    -- Drop old constraint if exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'reflections_user_id_fkey') THEN
        ALTER TABLE reflections DROP CONSTRAINT reflections_user_id_fkey;
    END IF;

    -- Add new constraint pointing to profiles
    ALTER TABLE reflections 
    ADD CONSTRAINT reflections_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE;
END $$;

-- 2. Update RLS Policies (Allow Global Viewing)
DO $$ 
BEGIN
    -- Drop all existing select policies to start fresh
    DROP POLICY IF EXISTS "Users can view own reflections" ON reflections;
    DROP POLICY IF EXISTS "Anyone can view public reflections" ON reflections;
    DROP POLICY IF EXISTS "Users can view all reflections" ON reflections;

    -- Create one policy to rule them all: View Everything
    CREATE POLICY "Users can view all reflections"
      ON reflections FOR SELECT
      USING (true);
      
    -- Ensure users can still only update/delete their OWN reflections
    -- (These might already exist, but good to be safe)
    DROP POLICY IF EXISTS "Users can update own reflections" ON reflections;
    CREATE POLICY "Users can update own reflections"
      ON reflections FOR UPDATE
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can delete own reflections" ON reflections;
    CREATE POLICY "Users can delete own reflections"
      ON reflections FOR DELETE
      USING (auth.uid() = user_id);
      
    DROP POLICY IF EXISTS "Users can insert own reflections" ON reflections;
    CREATE POLICY "Users can insert own reflections"
      ON reflections FOR INSERT
      WITH CHECK (auth.uid() = user_id);

END $$;

COMMIT;
