import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hash } from 'bcryptjs';

// Fonction utilitaire pour réessayer les requêtes
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (error instanceof Error && error.message.includes('MaxClientsInSessionMode')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// POST - Inscription d'un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, referralCode } = body;

    console.log('Tentative inscription:', { email, name, referralCode });

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await withRetry(() => prisma.user.findUnique({
      where: { email }
    }));

    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Générer un code de parrainage unique
    const generateReferralCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'NYXIA-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10);

    // Créer l'utilisateur
    const user = await withRetry(() => prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        referralCode: generateReferralCode(),
        referredBy: referralCode || null,
        credits: 5,
        role: 'USER'
      }
    }));

    console.log('Utilisateur créé:', user.id);

    // Créer une récompense de bienvenue
    await withRetry(() => prisma.reward.create({
      data: {
        userId: user.id,
        type: 'CREDITS',
        amount: 5,
        description: 'Crédits de bienvenue',
        source: 'inscription'
      }
    }));

    // Gérer le parrainage si un code a été utilisé
    if (referralCode) {
      const referrer = await withRetry(() => prisma.user.findFirst({
        where: { referralCode }
      }));
      
      if (referrer) {
        // Créer la relation de parrainage
        await withRetry(() => prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
            code: referralCode,
            status: 'PENDING'
          }
        }));
      }
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: 'Erreur lors de l\'inscription', details: errorMessage }, { status: 500 });
  }
}
