-- ============================================================================
-- MISE À JOUR SUPABASE - ZONE MEMBRE
-- Exécute ce script dans Supabase SQL Editor
-- ============================================================================

-- 1. Ajouter les nouvelles colonnes à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "birthDate" TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS loyaltypoints INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS badges TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS totalmessages INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS totalsessions INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS lastactiveat TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';
ALTER TABLE users ADD COLUMN IF NOT EXISTS notifications BOOLEAN DEFAULT true;

-- 2. Créer la table promo codes
CREATE TABLE IF NOT EXISTS promocodes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    discount INTEGER NOT NULL,
    source TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    "usedAt" TIMESTAMP,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 3. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_promocodes_code ON promocodes(code);
CREATE INDEX IF NOT EXISTS idx_promocodes_userId ON promocodes("userId");
CREATE INDEX IF NOT EXISTS idx_promocodes_used ON promocodes(used);

-- 4. Mettre à jour les tables referrals et rewards avec les bons noms
ALTER TABLE referral RENAME TO referrals;
ALTER TABLE reward RENAME TO rewards;

-- 5. Confirmer la création
SELECT 'Zone Membre tables créées avec succès!' as message;
