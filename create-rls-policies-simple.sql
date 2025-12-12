-- ============================================================================
-- SIMPLE RLS POLICIES (Recommended for Quick Setup)
-- ============================================================================
-- This creates basic policies that allow your app to work
-- You can refine these later based on your specific needs
-- ============================================================================

-- ============================================================================
-- TEMPORARY: ALLOW ALL ACCESS (For Development/Testing)
-- ============================================================================
-- This allows your app to work immediately after enabling RLS
-- You should refine these policies for production

-- Drop existing policies if they exist
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow all access - TEMPORARY" ON %I', r.tablename);
  END LOOP;
END $$;

-- Create "allow all" policies for all tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    BEGIN
      EXECUTE format('
        CREATE POLICY "Allow all access - TEMPORARY" ON %I
        FOR ALL USING (true) WITH CHECK (true);
      ', r.tablename);
      RAISE NOTICE 'Created policy for %', r.tablename;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skipped %: %', r.tablename, SQLERRM;
    END;
  END LOOP;
END $$;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies created for all tables!';
  RAISE NOTICE '⚠️  These are TEMPORARY "allow all" policies.';
  RAISE NOTICE '⚠️  Refine these policies for production security.';
  RAISE NOTICE '';
  RAISE NOTICE 'Your app should now work with RLS enabled.';
END $$;

