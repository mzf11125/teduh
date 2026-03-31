-- Teduh.app - Re-run Safe Migration
-- This script drops and recreates policies safely
-- Run this if you need to re-apply the schema

-- ============================================
-- DROP EXISTING POLICIES (if they exist)
-- ============================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Facilities policies
DROP POLICY IF EXISTS "Anyone can view active facilities" ON public.facilities;
DROP POLICY IF EXISTS "Admins can view all facilities" ON public.facilities;
DROP POLICY IF EXISTS "Admins can insert facilities" ON public.facilities;
DROP POLICY IF EXISTS "Admins can update facilities" ON public.facilities;
DROP POLICY IF EXISTS "Admins can delete facilities" ON public.facilities;

-- Operating hours policies
DROP POLICY IF EXISTS "Anyone can view operating hours" ON public.operating_hours;
DROP POLICY IF EXISTS "Admins can manage operating hours" ON public.operating_hours;

-- Time slots policies
DROP POLICY IF EXISTS "Anyone can view active time slots" ON public.time_slots;
DROP POLICY IF EXISTS "Admins can view all time slots" ON public.time_slots;
DROP POLICY IF EXISTS "Admins can manage time slots" ON public.time_slots;

-- Bookings policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update any booking" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete any booking" ON public.bookings;

-- ============================================
-- RECREATE POLICIES
-- ============================================

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for facilities (everyone can view, only admins can modify)
CREATE POLICY "Anyone can view active facilities"
  ON public.facilities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all facilities"
  ON public.facilities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert facilities"
  ON public.facilities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update facilities"
  ON public.facilities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete facilities"
  ON public.facilities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Operating hours policies
CREATE POLICY "Anyone can view operating hours"
  ON public.operating_hours FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage operating hours"
  ON public.operating_hours FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Time slots policies
CREATE POLICY "Anyone can view active time slots"
  ON public.time_slots FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all time slots"
  ON public.time_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage time slots"
  ON public.time_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any booking"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any booking"
  ON public.bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
