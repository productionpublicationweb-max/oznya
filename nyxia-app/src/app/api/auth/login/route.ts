import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { compare } from 'bcryptjs';

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

// POST - Connexion d'un utilisateur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Tentative connexion:', { email });

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    // Trouver l'utilisateur
    const user = await withRetry(() => prisma.user.findUnique({
      where: { email }
    }));

    if (!user) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    // Vérifier le mot de passe
    if (!user.password) {
      return NextResponse.json({ error: 'Compte non configuré. Veuillez réinitialiser votre mot de passe.' }, { status: 401 });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    console.log('Connexion réussie:', user.id);

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: 'Erreur lors de la connexion', details: errorMessage }, { status: 500 });
  }
}
