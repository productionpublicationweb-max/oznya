import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configuration optimisée pour Supabase avec pool de connexions
function createPrismaClient() {
  const url = process.env.DATABASE_URL
  
  // Ajouter les paramètres de connexion si pas déjà présents
  let connectionString = url
  if (url && !url.includes('pgbouncer=true') && !url.includes('pooler.supabase.com')) {
    // Si c'est une connexion directe Supabase, essayer d'utiliser le pooler
    // L'utilisateur devra configurer l'URL du pooler dans Vercel
    console.log('Note: Pour les environnements serverless, utilisez l\'URL du connection pooler Supabase')
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: connectionString,
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Gestion propre des connexions pour serverless
export async function connect() {
  try {
    await prisma.$connect()
  } catch (error) {
    console.error('Erreur connexion DB:', error)
    throw error
  }
}

export async function disconnect() {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Erreur déconnexion DB:', error)
  }
}

export default prisma
