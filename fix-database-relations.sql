-- Fix Foreign Key to reference profiles instead of auth.users
-- This allows PostgREST to join reflections with profiles

DO $$ 
BEGIN
    -- Drop the old constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'reflections_user_id_fkey' 
        AND table_name = 'reflections'
    ) THEN
        ALTER TABLE reflections DROP CONSTRAINT reflections_user_id_fkey;
    END IF;

    -- Add the new constraint referencing profiles
    -- We use the same name to keep it simple, or a new name
    ALTER TABLE reflections 
    ADD CONSTRAINT reflections_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE;
END $$;
