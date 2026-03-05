-- ============================================================================
-- NYXIA - TABLES SQL POUR SUPABASE
-- Exécutez ce script dans l'éditeur SQL de Supabase
-- ============================================================================

-- 1. TABLE DES UTILISATEURS
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    referral_code TEXT UNIQUE,
    referred_by TEXT,
    credits INTEGER DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    role TEXT DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABLE DES PARRAINAGES
CREATE TABLE IF NOT EXISTS "Referral" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    referrer_id TEXT NOT NULL,
    referred_id TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    reward_given BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    CONSTRAINT "Referrer_referred_unique" UNIQUE (referrer_id, referred_id)
);

-- 3. TABLE DES RÉCOMPENSES
CREATE TABLE IF NOT EXISTS "Reward" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- 4. INDEX POUR LES PERFORMANCES
CREATE INDEX IF NOT EXISTS "User_referral_code_idx" ON "User"(referral_code);
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "Referral_code_idx" ON "Referral"(code);
CREATE INDEX IF NOT EXISTS "Referral_referrer_id_idx" ON "Referral"(referrer_id);
CREATE INDEX IF NOT EXISTS "Reward_user_id_idx" ON "Reward"(user_id);
CREATE INDEX IF NOT EXISTS "Reward_used_idx" ON "Reward"(used);

-- 5. CLÉS ÉTRANGÈRES (À exécuter après création des tables)
ALTER TABLE "Referral" 
ADD CONSTRAINT "Referral_referrer_fkey" 
FOREIGN KEY (referrer_id) REFERENCES "User"(id) ON DELETE CASCADE;

ALTER TABLE "Referral" 
ADD CONSTRAINT "Referral_referred_fkey" 
FOREIGN KEY (referred_id) REFERENCES "User"(id) ON DELETE CASCADE;

ALTER TABLE "Reward" 
ADD CONSTRAINT "Reward_user_fkey" 
FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE;

-- ============================================================================
-- VÉRIFICATION - Cette requête doit retourner les 3 tables
-- ============================================================================
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('User', 'Referral', 'Reward');
