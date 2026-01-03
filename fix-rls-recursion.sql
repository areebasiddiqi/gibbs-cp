-- Fix infinite recursion in RLS policies

-- 1. Create a helper function to check ownership without triggering RLS
-- SECURITY DEFINER means this runs with the privileges of the creator (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION is_reflection_owner(_reflection_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM reflections
    WHERE id = _reflection_id
    AND user_id = auth.uid()
  );
END;
$$;

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Owners can view shares" ON reflection_shares;
DROP POLICY IF EXISTS "Owners can insert shares" ON reflection_shares;
DROP POLICY IF EXISTS "Owners can delete shares" ON reflection_shares;
DROP POLICY IF EXISTS "Shared users can view reflections" ON reflections;
DROP POLICY IF EXISTS "Shared users can update reflections" ON reflections;

-- 3. Re-create reflection_shares policies using the helper function
CREATE POLICY "Owners can view shares"
    ON reflection_shares FOR SELECT
    USING ( is_reflection_owner(reflection_id) );

CREATE POLICY "Owners can insert shares"
    ON reflection_shares FOR INSERT
    WITH CHECK ( is_reflection_owner(reflection_id) );

CREATE POLICY "Owners can delete shares"
    ON reflection_shares FOR DELETE
    USING ( is_reflection_owner(reflection_id) );

-- 4. Re-create reflections policies
-- Use auth.jwt() ->> 'email' to get current user's email efficiently
CREATE POLICY "Shared users can view reflections"
    ON reflections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM reflection_shares
            WHERE reflection_shares.reflection_id = reflections.id
            AND reflection_shares.email = (auth.jwt() ->> 'email')
        )
    );

CREATE POLICY "Shared users can update reflections"
    ON reflections FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM reflection_shares
            WHERE reflection_shares.reflection_id = reflections.id
            AND reflection_shares.email = (auth.jwt() ->> 'email')
            AND reflection_shares.permission = 'edit'
        )
    );
