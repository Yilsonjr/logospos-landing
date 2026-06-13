-- ============================================
-- Logos POS Landing — Supabase Tables
-- Run this in Supabase SQL Editor
-- ============================================

-- Table: landing_registros
-- Stores registration attempts from the landing page
CREATE TABLE IF NOT EXISTS landing_registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  nombre_negocio TEXT NOT NULL,
  telefono TEXT,
  plan_seleccionado TEXT DEFAULT 'profesional',
  estado TEXT DEFAULT 'pendiente_pago',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: allow unauthenticated inserts from the landing page
ALTER TABLE landing_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert from landing" ON landing_registros
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update own record" ON landing_registros
  FOR UPDATE USING (true);
