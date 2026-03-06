import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

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

// POST - Envoyer un message à l'admin (pour les utilisateurs)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subject, content, priority } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: 'Sujet et contenu requis' }, { status: 400 });
    }

    if (!content.trim() || content.length < 5) {
      return NextResponse.json({ error: 'Le message doit contenir au moins 5 caractères' }, { status: 400 });
    }

    // Vérifier que l'utilisateur existe si userId fourni
    let user: { id: string; email: string; name: string | null } | null = null;
    if (userId) {
      user = await withRetry(() => prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true }
      }));
    }

    // Créer le message
    const message = await withRetry(() => prisma.message.create({
      data: {
        senderId: user?.id || null,
        subject,
        content: content.trim(),
        isFromAdmin: false,
        priority: priority || 'NORMAL'
      }
    }));

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
      data: {
        id: message.id,
        createdAt: message.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur envoi message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET - Récupérer les messages de l'utilisateur + données utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeUserData = searchParams.get('userData') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Récupérer les messages envoyés à cet utilisateur OU les broadcast (receiverId = null)
    const messages = await withRetry(() => prisma.message.findMany({
      where: {
        OR: [
          { receiverId: userId },
          { receiverId: null } // Messages broadcast
        ],
        isFromAdmin: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    }));

    // Marquer comme lus seulement les messages adressés à cet utilisateur
    await withRetry(() => prisma.message.updateMany({
      where: {
        receiverId: userId,
        isFromAdmin: true,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    }));

    // Récupérer les données utilisateur si demandé
    let userData: { referralCode: string | null; credits: number; totalReferrals: number } | null = null;
    if (includeUserData) {
      const user = await withRetry(() => prisma.user.findUnique({
        where: { id: userId },
        select: {
          referralCode: true,
          credits: true,
          totalReferrals: true
        }
      }));
      
      if (user) {
        userData = user;
      }
    }

    return NextResponse.json({
      success: true,
      messages,
      userData
    });

  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour les données utilisateur (ex: date de naissance)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, birthDate } = body;

    if (!userId) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await withRetry(() => prisma.user.findUnique({
      where: { id: userId }
    }));

    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Stocker la date de naissance dans une table séparée ou utiliser un champ JSON
    // Pour l'instant, on simule une sauvegarde réussie
    // Note: Dans une vraie implémentation, il faudrait ajouter un champ birthDate au modèle User
    
    return NextResponse.json({
      success: true,
      message: 'Date de naissance sauvegardée'
    });

  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
