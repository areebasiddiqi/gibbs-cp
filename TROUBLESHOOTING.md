# 🔧 Fixing the 500 Error on Signup

If you're getting a 500 error when trying to register, follow these steps:

## The Problem

The error occurs because the database trigger to automatically create user profiles wasn't set up yet.

## The Solution

### Step 1: Update Your Database

You need to run the updated migration SQL. Go to your Supabase project:

1. Open **SQL Editor**
2. Create a **New Query**
3. Copy and paste the ENTIRE contents of `supabase-migration.sql`
4. Click **Run** (or Ctrl+Enter)

**Important**: If you already ran the migration before, you might get some errors about objects already existing. That's OK! The important part is the new trigger at the end.

### Step 2: Alternative - Just Add the Trigger

If you don't want to run the entire migration again, you can just add this trigger:

```sql
-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Test Registration

1. Try registering again with a new email
2. You should now be able to create an account successfully
3. You'll be redirected to the dashboard

## What This Does

The trigger automatically creates a profile in the `profiles` table whenever a new user signs up through Supabase Auth. This eliminates the 500 error you were seeing.

## Still Having Issues?

### Check if the trigger exists:

```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

### Check if profiles table exists:

```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'profiles';
```

### Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

---

**After fixing, you should be able to**:
- ✅ Register new users
- ✅ Login successfully  
- ✅ Create reflections
- ✅ View your dashboard
