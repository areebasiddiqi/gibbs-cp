-- Update RLS to allow viewing ALL reflections
-- This makes all reflections visible to any authenticated user

DO $$ 
BEGIN
    -- Drop existing view policies to avoid conflicts
    DROP POLICY IF EXISTS "Users can view own reflections" ON reflections;
    DROP POLICY IF EXISTS "Anyone can view public reflections" ON reflections;

    -- Create a new comprehensive policy
    CREATE POLICY "Users can view all reflections"
      ON reflections FOR SELECT
      USING (true);  -- 'true' means anyone can see anything
      
END $$;
