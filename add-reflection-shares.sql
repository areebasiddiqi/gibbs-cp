-- Create reflection_shares table
CREATE TABLE IF NOT EXISTS reflection_shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reflection_id UUID REFERENCES reflections(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    permission TEXT DEFAULT 'edit' CHECK (permission IN ('view', 'edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(reflection_id, email)
);

-- Enable RLS
ALTER TABLE reflection_shares ENABLE ROW LEVEL SECURITY;

-- Policies for reflection_shares

-- 1. Owners can view shares for their reflections
CREATE POLICY "Owners can view shares"
    ON reflection_shares FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM reflections
            WHERE reflections.id = reflection_shares.reflection_id
            AND reflections.user_id = auth.uid()
        )
    );

-- 2. Owners can insert shares
CREATE POLICY "Owners can insert shares"
    ON reflection_shares FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM reflections
            WHERE reflections.id = reflection_shares.reflection_id
            AND reflections.user_id = auth.uid()
        )
    );

-- 3. Owners can delete shares
CREATE POLICY "Owners can delete shares"
    ON reflection_shares FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM reflections
            WHERE reflections.id = reflection_shares.reflection_id
            AND reflections.user_id = auth.uid()
        )
    );

-- Update REFLECTIONS policies to allow shared access

-- 1. Shared users can VIEW reflections
CREATE POLICY "Shared users can view reflections"
    ON reflections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM reflection_shares
            WHERE reflection_shares.reflection_id = reflections.id
            AND reflection_shares.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- 2. Shared users can UPDATE reflections (if permission is 'edit')
CREATE POLICY "Shared users can update reflections"
    ON reflections FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM reflection_shares
            WHERE reflection_shares.reflection_id = reflections.id
            AND reflection_shares.email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND reflection_shares.permission = 'edit'
        )
    );
