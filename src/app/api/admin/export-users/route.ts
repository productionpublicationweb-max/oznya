import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple auth check
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SECRET_KEY;
  return authHeader === `Bearer ${adminKey}` || !adminKey;
}

// GET - Export all users as CSV
export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        referralCode: true,
        credits: true,
        loyaltyPoints: true,
        totalReferrals: true,
        level: true,
        xp: true,
        totalMessages: true,
        createdAt: true,
        lastActiveAt: true,
        theme: true,
        notifications: true,
        referredBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Créer le CSV
    const headers = [
      'Email',
      'Nom',
      'Code Parrainage',
      'Crédits',
      'Points Fidélité',
      'Nb Parrainages',
      'Niveau',
      'XP',
      'Messages',
      'Date Inscription',
      'Dernière Activité',
      'Thème',
      'Notifications',
      'Parrainé Par (ID)',
    ];

    const csvRows = [
      headers.join(','),
      ...users.map(user => [
        `"${user.email}"`,
        `"${user.name || ''}"`,
        `"${user.referralCode || ''}"`,
        user.credits,
        user.loyaltyPoints,
        user.totalReferrals,
        user.level,
        user.xp,
        user.totalMessages,
        `"${user.createdAt.toISOString()}"`,
        `"${user.lastActiveAt?.toISOString() || ''}"`,
        `"${user.theme}"`,
        user.notifications ? 'Oui' : 'Non',
        `"${user.referredBy || ''}"`,
      ].join(',')),
    ];

    const csv = csvRows.join('\n');

    // Retourner avec les headers pour téléchargement
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="nyxia-users-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Export CSV error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    );
  }
}
