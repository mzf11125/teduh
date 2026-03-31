-- Teduh.app Database Schema for Supabase
-- This file contains all the tables, indexes, and Row Level Security (RLS) policies

-- ============================================
-- PROFILES TABLE (linked to Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  phone TEXT,
  emergency_contact TEXT,
  role TEXT NOT NULL DEFAULT 'resident' CHECK (role IN ('resident', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, unit, phone, emergency_contact, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'unit', 'Unknown'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'emergency_contact',
    'resident'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- FACILITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pool', 'basketball', 'tennis', 'futsal')),
  description TEXT,
  capacity INTEGER,
  image_url TEXT,
  rules TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- OPERATING HOURS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.operating_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(facility_id, day_of_week)
);

ALTER TABLE public.operating_hours ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- TIME SLOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  facility_id UUID NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  time_slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  qr_code TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

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

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to generate QR code on booking creation
CREATE OR REPLACE FUNCTION public.generate_booking_qr_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate unique QR code
  NEW.qr_code := 'BK' || encode(gen_random_bytes(8), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_qr_on_booking
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_qr_code();

-- Function to prevent double bookings
CREATE OR REPLACE FUNCTION public.prevent_double_booking()
RETURNS TRIGGER AS $$
DECLARE
  existing_booking INTEGER;
BEGIN
  -- Check if there's already a confirmed booking for the same slot, date, and facility
  SELECT COUNT(*) INTO existing_booking
  FROM public.bookings
  WHERE facility_id = NEW.facility_id
    AND booking_date = NEW.booking_date
    AND time_slot_id = NEW.time_slot_id
    AND status = 'confirmed'
    AND id IS DISTINCT FROM NEW.id;  -- Exclude current row for updates

  -- If booking exists and this is a new confirmed booking, raise an error
  IF existing_booking > 0 AND NEW.status = 'confirmed' THEN
    RAISE EXCEPTION 'Slot ini sudah dipesan untuk tanggal dan jam tersebut.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_double_booking
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.prevent_double_booking();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_facility_date ON public.bookings(facility_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_date ON public.bookings(time_slot_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);

CREATE INDEX IF NOT EXISTS idx_time_slots_facility ON public.time_slots(facility_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_active ON public.time_slots(is_active);

CREATE INDEX IF NOT EXISTS idx_operating_hours_facility ON public.operating_hours(facility_id);

CREATE INDEX IF NOT EXISTS idx_facilities_active ON public.facilities(is_active);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON public.facilities(type);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for bookings with facility and time slot details
CREATE OR REPLACE VIEW public.bookings_with_details AS
SELECT
  b.*,
  f.name as facility_name,
  f.type as facility_type,
  ts.start_time,
  ts.end_time,
  p.full_name as user_name,
  p.unit as user_unit,
  p.phone as user_phone
FROM public.bookings b
JOIN public.facilities f ON b.facility_id = f.id
JOIN public.time_slots ts ON b.time_slot_id = ts.id
JOIN public.profiles p ON b.user_id = p.id;

-- View for available slots on a given date
CREATE OR REPLACE VIEW public.available_slots AS
SELECT
  f.id as facility_id,
  f.name as facility_name,
  ts.id as slot_id,
  ts.start_time,
  ts.end_time,
  ts.max_capacity,
  COALESCE(COUNT(b.id), 0) as booked_count,
  (ts.max_capacity - COALESCE(COUNT(b.id), 0)) as available_count
FROM public.facilities f
CROSS JOIN public.time_slots ts
LEFT JOIN public.bookings b ON (
  b.time_slot_id = ts.id
  AND b.facility_id = f.id
  AND b.booking_date = CURRENT_DATE
  AND b.status != 'cancelled'
)
WHERE
  f.is_active = true
  AND ts.is_active = true
  AND ts.facility_id = f.id
GROUP BY f.id, f.name, ts.id, ts.start_time, ts.end_time, ts.max_capacity
ORDER BY f.name, ts.start_time;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if a slot is available
CREATE OR REPLACE FUNCTION public.is_slot_available(
  p_facility_id UUID,
  p_time_slot_id UUID,
  p_booking_date DATE
)
RETURNS BOOLEAN AS $$
DECLARE
  v_bookings_count INTEGER;
  v_max_capacity INTEGER;
BEGIN
  -- Get max capacity for the slot
  SELECT max_capacity INTO v_max_capacity
  FROM public.time_slots
  WHERE id = p_time_slot_id AND facility_id = p_facility_id;

  -- Count existing bookings for this slot and date
  SELECT COUNT(*) INTO v_bookings_count
  FROM public.bookings
  WHERE
    facility_id = p_facility_id
    AND time_slot_id = p_time_slot_id
    AND booking_date = p_booking_date
    AND status != 'cancelled';

  -- Return true if available
  RETURN v_bookings_count < v_max_capacity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get booking statistics
CREATE OR REPLACE FUNCTION public.get_booking_stats(
  p_facility_id UUID DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  date DATE,
  facility_name TEXT,
  total_bookings BIGINT,
  confirmed_bookings BIGINT,
  cancelled_bookings BIGINT,
  completed_bookings BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.booking_date::date,
    f.name,
    COUNT(*)::BIGINT,
    COUNT(*) FILTER (WHERE b.status = 'confirmed')::BIGINT,
    COUNT(*) FILTER (WHERE b.status = 'cancelled')::BIGINT,
    COUNT(*) FILTER (WHERE b.status = 'completed')::BIGINT
  FROM public.bookings b
  JOIN public.facilities f ON b.facility_id = f.id
  WHERE
    (p_facility_id IS NULL OR b.facility_id = p_facility_id)
    AND (p_start_date IS NULL OR b.booking_date >= p_start_date)
    AND (p_end_date IS NULL OR b.booking_date <= p_end_date)
  GROUP BY b.booking_date, f.name
  ORDER BY b.booking_date DESC, f.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (optional - for development)
-- ============================================

-- Insert sample facilities
INSERT INTO public.facilities (name, type, description, capacity, rules) VALUES
  ('Kolam Renang Utama', 'pool', 'Kolam renang dengan ukuran 25 meter, dilengkapi dengan kolam anak dan area bersantai.', 50,
   ARRAY['Wajib menggunakan pakaian renang yang sopan', 'Anak-anak harus didampingi orang dewasa', 'Dilarang membawa makanan dari luar', 'Wajib mandi sebelum masuk kolam']),
  ('Lapangan Basket', 'basketball', 'Lapangan basket standar dengan lantai vinyl dan penerangan yang baik.', 10,
   ARRAY['Wajib menggunakan sepatu olahraga non-marking', 'Maksimal 10 orang per lapangan', 'Dilarang membawa makanan ke lapangan']),
  ('Lapangan Tenis', 'tennis', 'Lapangan tenis hard court dengan permukaan berkualitas tinggi.', 4,
   ARRAY['Wajib menggunakan sepatu tenis non-marking', 'Maksimal 4 orang per lapangan', 'Dilarang menggunakan pakaian yang tidak sopan']),
  ('Lapangan Futsal', 'futsal', 'Lapangan futsal dengan rumput sintetis berkualitas.', 12,
   ARRAY['Wajib menggunakan sepatu futsal dengan sol datar', 'Maksimal 12 orang (6 vs 6)', 'Dilarang membawa makanan ke lapangan'])
ON CONFLICT DO NOTHING;

-- Insert operating hours for all facilities (06:00 - 22:00 daily)
INSERT INTO public.operating_hours (facility_id, day_of_week, open_time, close_time)
SELECT f.id, d.day_of_week, '06:00'::time, '22:00'::time
FROM public.facilities f
CROSS JOIN (SELECT generate_series(0, 6) AS day_of_week) d
ON CONFLICT (facility_id, day_of_week) DO NOTHING;

-- Insert time slots for all facilities (hourly slots from 06:00 to 21:00)
INSERT INTO public.time_slots (facility_id, start_time, end_time, max_capacity)
SELECT f.id,
       (hour || ':00')::time AS start_time,
       ((hour + 1) || ':00')::time AS end_time,
       CASE WHEN f.type = 'pool' THEN 50 ELSE f.capacity END AS max_capacity
FROM public.facilities f
CROSS JOIN (SELECT generate_series(6, 20) AS hour) h
ON CONFLICT DO NOTHING;

-- ============================================
-- GRANTS
-- ============================================

-- Grant access to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Allow authenticated users to use specific functions
GRANT EXECUTE ON FUNCTION public.is_slot_available TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_booking_stats TO authenticated;
