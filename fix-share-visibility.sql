-- Fix Redirect Issue: Allow invited users to view their own share records

-- The previous policies only allowed the OWNER to view reflection_shares.
-- But the 'reflections' policy relies on the user being able to 'see' the share record
-- to grant access. If the user can't SELECT the share record, the EXISTS clause returns false.

-- Add policy for invited users to view their own shares
CREATE POLICY "Invited users can view their shares"
    ON reflection_shares FOR SELECT
    USING (
        email = (auth.jwt() ->> 'email')
    );
