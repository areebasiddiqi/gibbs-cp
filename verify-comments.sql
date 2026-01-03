-- Verify Comments Table
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'comments';

-- Check Policies
SELECT 
    tablename, 
    policyname, 
    cmd, 
    qual, 
    with_check 
FROM 
    pg_policies 
WHERE 
    tablename = 'comments';
