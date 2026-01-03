-- Add is_public column if it doesn't exist
-- This is safe to run multiple times
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reflections' 
        AND column_name = 'is_public'
    ) THEN
        ALTER TABLE reflections ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add the public viewing policy if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reflections' 
        AND policyname = 'Anyone can view public reflections'
    ) THEN
        CREATE POLICY "Anyone can view public reflections"
          ON reflections FOR SELECT
          USING (is_public = true);
    END IF;
END $$;
