-- Verify Database State
-- Run this to check if data exists and is visible

SELECT 'Reflections Count' as check_name, COUNT(*) as count FROM reflections
UNION ALL
SELECT 'Profiles Count', COUNT(*) FROM profiles
UNION ALL
SELECT 'Reflections with Authors', COUNT(*) 
FROM reflections r
JOIN profiles p ON r.user_id = p.id;

-- Check RLS Policies
SELECT tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'reflections';
