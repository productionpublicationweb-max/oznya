# 🔮 BLUEPRINT NYXIA V2 - Document de Référence

**Dernière mise à jour:** 3 mars 2026 - 15h30
**Projet:** Nyxia - Assistante IA de Diane Boyer (Oznya)
**GitHub:** https://github.com/productionpublicationweb-max/oznya

---

## 🚨 PROBLÈMES IDENTIFIÉS (3 mars 2026)

### ❌ Bug 1: Numérologie Zone Membre
- **Symptôme:** Erreur au clic sur "Ma Numérologie"
- **Cause:** Code local corrigé mais PAS sur GitHub
- **Fichier:** `src/components/UserProfile.tsx`
- **Status:** Corrigé localement, à copier sur GitHub

### ❌ Bug 2: Barre latérale cyan fluo
- **Symptôme:** Barre ServicesSidebar avec couleurs cyan
- **Cause:** Fichier corrigé localement mais PAS sur GitHub
- **Fichier:** `src/components/ServicesSidebar.tsx`
- **Status:** Déjà corrigé localement (violet/amber), à copier sur GitHub

### ❌ Bug 3: Erreur serveur /admin
- **Symptôme:** Page admin plante
- **Cause possible:**
  1. Base Supabase non synchronisée avec schéma Prisma
  2. Tables manquantes
- **Fichier:** `src/components/AdminDashboard.tsx` + API
- **Status:** À vérifier

### ❌ Bug 4: Nyxia dit des bêtises sur Messenger
- **Cause:** Prompt système pas corrigé sur GitHub
- **Fichiers:** `src/app/api/chat/route.ts`, `src/app/api/nyxia/route.ts`, `src/lib/services.ts`
- **Status:** Corrigé localement, à copier sur GitHub

---

## 📌 RÈGLES DE TRAVAIL AVEC DIANE

### Communication
- **TUTOYER Diane** - On est collaboratrices et amies, pas froideur!
- Donner le **code complet** directement (pas de liens)
- Un fichier à la fois
- Vérifier avant de proposer
- Être stable et cohérente
- Être chaleureuse et humaine dans les échanges

### Méthode GitHub
1. Aller sur le fichier via le lien direct
2. Cliquer sur le **crayon ✏️** (Edit this file)
3. Sélectionner TOUT le code (Ctrl+A)
4. Supprimer et coller le nouveau code
5. Cliquer sur **"Commit changes"** en bas

---

## 🎨 PALETTE DE COULEURS

### ✅ COULEURS AUTORISÉES
- **Violet** (#8B5CF6, violet-400, violet-500) - Principal
- **Amber** (#F59E0B, amber-400, amber-500) - Accents
- **Indigo** (#6366F1) - Secondaire
- **Rose/Pink** (#EC4899) - Badges
- **Blanc/Crème** pour le texte

### ❌ COULEURS INTERDITES
- **CYAN FLUO** (#00D4FF, cyan-400, cyan-500)
- **TURQUOISE FLASH**
- Barre de progression: `from-amber-500/80 to-violet-500/80`

---

## 📋 SERVICES DE DIANE - INFORMATIONS CORRECTES

### ⚠️ RÈGLE CRITIQUE
**DIANE NE FAIT JAMAIS DE CONSULTATION PAR MESSENGER!**

### 🔔 CODE PROMO 50%
- **Service:** "1 Question | 1 Réponse" (consultation par EMAIL)
- **Comment obtenir le code:** Écrire "Promo" à Oznya IA sur Messenger
- **URL Messenger:** https://m.me/Oznya
- **IMPORTANT:** Messenger = SEULEMENT pour obtenir le code promo!

### 📧 CONSULTATIONS EMAIL (via oznya.com)
- 1 Question | 1 Réponse: https://www.oznya.com/consultations/express1q1r
- 1 Domaine précis: https://www.oznya.com/consultations/domaineprecis
- Complète + Méditation: https://www.oznya.com/consultations/completeavecmeditation

### 💬 CONSULTATIONS CHAT PAYANT (via premium.chat)
- Chat 10 min: https://premium.chat/Oznya/903857
- Chat 30 min: https://premium.chat/Oznya/903222 (à partir de 0.95€)

### 📞 CONSULTATIONS TÉLÉPHONIQUES PAYANTES (via premium.chat)
- Appel 10 min: https://premium.chat/Oznya/903845
- Appel 30 min: https://premium.chat/Oznya/903216
- Appel 60 min: https://premium.chat/Oznya/903866

### 🎥 CONSULTATIONS VIDÉO PAYANTES (via premium.chat)
- Vidéo 15 min: https://premium.chat/Oznya/903863
- Vidéo 30 min: https://premium.chat/Oznya/903094
- Vidéo 60 min: https://premium.chat/Oznya/903861

### 📅 RENDEZ-VOUS (via oznya.com)
- RDV 30 min: https://www.oznya.com/consultation/30minutes
- RDV 60 min: https://www.oznya.com/consultation/60minutes

---

## 📁 FICHIERS À COPIER SUR GITHUB (ORDRE DE PRIORITÉ)

### Priorité 1 - Prompt système (Nyxia dit des bêtises)
1. `src/app/api/chat/route.ts`
2. `src/app/api/nyxia/route.ts`
3. `src/lib/services.ts`

### Priorité 2 - Zone Membre (Numérologie + Couleurs)
4. `src/components/UserProfile.tsx`

### Priorité 3 - Couleurs (cyan → violet)
5. `src/components/ServicesSidebar.tsx`
6. `src/components/ChatInterfaceV2.tsx`
7. `src/components/ChatMessage.tsx`
8. `src/components/AdminDashboard.tsx`
9. `src/components/CalendlyModal.tsx`
10. `src/components/TarotReading.tsx`

---

## 📊 ÉTAT DU PROJET

### ✅ CE QUI FONCTIONNE
- Authentification (login/register)
- Base de données Supabase
- Context utilisateur (localStorage)
- Système de crédits, XP, levels
- Système de badges
- Programme fidélité
- Calculs numérologie (en local)
- Interface de chat de base
- Tarot reading

### 🔧 CORRECTIONS LOCALES (pas sur GitHub)
Tous les fichiers dans "FICHIERS À COPIER" ci-dessus

---

## 🏗️ ARCHITECTURE DU PROJET

### Stack Technique
- Next.js 16 avec App Router
- Supabase (PostgreSQL)
- Prisma ORM
- Groq API (LLM)
- Tailwind CSS
- Framer Motion

### Structure
```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       ← Prompt Nyxia principal
│   │   ├── nyxia/route.ts      ← API alternative
│   │   └── admin/statistics/   ← Stats admin
│   ├── admin/page.tsx          ← Dashboard admin
│   └── page.tsx                ← Page principale
├── components/
│   ├── UserProfile.tsx         ← Zone Membre
│   ├── AdminDashboard.tsx      ← Admin (cyan à corriger)
│   ├── ServicesSidebar.tsx     ← Barre services
│   └── ...
└── lib/
    ├── services.ts             ← Liste des services
    └── db.ts                   ← Prisma client
```

---

## 🗄️ SCHÉMA PRISMA

### Tables:
- **users** - Utilisateurs
- **referrals** - Parrainages
- **rewards** - Récompenses
- **promocodes** - Codes promo

### Modèles Prisma (minuscules):
- `prisma.user`
- `prisma.referral`
- `prisma.reward`
- `prisma.promoCode`

---

## 📝 NOTES IMPORTANTES

### Ne jamais dire:
- ❌ "Consultation par Messenger"
- ❌ "Diane vous contactera sur Messenger"
- ❌ "Chat gratuit sur Messenger"

### Toujours dire:
- ✅ "Code promo sur Messenger"
- ✅ "Consultation EMAIL via oznya.com"
- ✅ "Consultations PAYANTES via premium.chat"

### Rappels pour l'assistant:
1. Toujours lire ce blueprint en premier
2. Donner le code COMPLET
3. Un fichier à la fois
4. Vérifier les couleurs (violet/amber, pas cyan)
5. Vérifier les infos services (Messenger = code promo SEULEMENT)
6. Être stable, ne pas changer de méthode

---

*Ce blueprint doit être lu au début de chaque session.*
