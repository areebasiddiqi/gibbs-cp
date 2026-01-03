-- Restore correct RLS policies for reflections

-- Drop the permissive policy if it exists
DROP POLICY IF EXISTS "Users can view all reflections" ON reflections;

-- Drop potentially conflicting policies just in case
DROP POLICY IF EXISTS "Users can view own reflections" ON reflections;
DROP POLICY IF EXISTS "Anyone can view public reflections" ON reflections;

-- Re-create the correct policies

-- 1. Users can view their own reflections
CREATE POLICY "Users can view own reflections"
  ON reflections FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Anyone can view public reflections
CREATE POLICY "Anyone can view public reflections"
  ON reflections FOR SELECT
  USING (is_public = true);

-- Ensure RLS is enabled
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
