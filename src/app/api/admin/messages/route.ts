import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Simple auth check
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SECRET_KEY;
  return authHeader === `Bearer ${adminKey}` || !adminKey;
}

// GET - Récupérer les messages
export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, inbox, sent, unread
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};

    switch (type) {
      case 'inbox':
        // Messages reçus des utilisateurs (pas de admin)
        where.isFromAdmin = false;
        break;
      case 'sent':
        // Messages envoyés par l'admin
        where.isFromAdmin = true;
        break;
      case 'unread':
        // Messages non lus reçus
        where.isRead = false;
        where.isFromAdmin = false;
        break;
      case 'user':
        // Messages d'un utilisateur spécifique
        if (userId) {
          where.OR = [
            { senderId: userId },
            { receiverId: userId }
          ];
        }
        break;
    }

    const [messages, total, unreadCount] = await Promise.all([
      prisma.message.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.message.count({ where }),
      prisma.message.count({
        where: { isRead: false, isFromAdmin: false }
      })
    ]);

    return NextResponse.json({
      success: true,
      messages,
      total,
      unreadCount,
      hasMore: offset + limit < total
    });

  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Envoyer un nouveau message
export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, subject, content, priority, parentId } = body;

    if (!subject || !content) {
      return NextResponse.json({ error: 'Sujet et contenu requis' }, { status: 400 });
    }

    // Créer le message
    const message = await prisma.message.create({
      data: {
        receiverId: receiverId || null, // null = message broadcast
        subject,
        content,
        isFromAdmin: true,
        priority: priority || 'NORMAL',
        parentId: parentId || null
      }
    });

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Erreur envoi message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Marquer comme lu ou mettre à jour
export async function PUT(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, isRead, priority } = body;

    if (!messageId) {
      return NextResponse.json({ error: 'ID message requis' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (typeof isRead === 'boolean') {
      updateData.isRead = isRead;
      if (isRead) {
        updateData.readAt = new Date();
      }
    }
    if (priority) {
      updateData.priority = priority;
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message
    });

  } catch (error) {
    console.error('Erreur mise à jour message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un message
export async function DELETE(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json({ error: 'ID message requis' }, { status: 400 });
    }

    await prisma.message.delete({
      where: { id: messageId }
    });

    return NextResponse.json({
      success: true,
      message: 'Message supprimé'
    });

  } catch (error) {
    console.error('Erreur suppression message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
