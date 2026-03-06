import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Simple auth check
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SECRET_KEY;
  return authHeader === `Bearer ${adminKey}` || !adminKey;
}

// Fonction utilitaire pour réessayer les requêtes
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (error instanceof Error && error.message.includes('MaxClientsInSessionMode')) {
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

// GET - Statistiques globales pour le dashboard admin
export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Exécuter les requêtes séquentiellement avec retry
    const totalUsers = await withRetry(() => prisma.user.count());
    const newUsersToday = await withRetry(() => prisma.user.count({
      where: { createdAt: { gte: today } }
    }));
    const newUsersThisWeek = await withRetry(() => prisma.user.count({
      where: { createdAt: { gte: lastWeek } }
    }));
    const newUsersThisMonth = await withRetry(() => prisma.user.count({
      where: { createdAt: { gte: lastMonth } }
    }));
    const totalReferrals = await withRetry(() => prisma.referral.count());
    const pendingReferrals = await withRetry(() => prisma.referral.count({
      where: { status: 'PENDING' }
    }));
    const completedReferrals = await withRetry(() => prisma.referral.count({
      where: { status: 'REWARDED' }
    }));
    const totalRewards = await withRetry(() => prisma.reward.count());
    const unusedRewards = await withRetry(() => prisma.reward.count({
      where: { used: false }
    }));
    const recentUsers = await withRetry(() => prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        referralCode: true,
        totalReferrals: true,
        credits: true,
        createdAt: true
      }
    }));
    const recentReferrals = await withRetry(() => prisma.referral.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        referrer: { select: { email: true, name: true } }
      }
    }));
    const topReferrers = await withRetry(() => prisma.user.findMany({
      take: 5,
      orderBy: { totalReferrals: 'desc' },
      where: { totalReferrals: { gt: 0 } },
      select: {
        email: true,
        name: true,
        referralCode: true,
        totalReferrals: true,
        credits: true
      }
    }));

    const conversionRate = totalReferrals > 0
      ? Math.round((completedReferrals / totalReferrals) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          newThisMonth: newUsersThisMonth
        },
        referrals: {
          total: totalReferrals,
          pending: pendingReferrals,
          completed: completedReferrals,
          conversionRate
        },
        rewards: {
          total: totalRewards,
          unused: unusedRewards
        }
      },
      recentUsers,
      recentReferrals: recentReferrals.map(r => ({
        id: r.id,
        code: r.code,
        status: r.status,
        createdAt: r.createdAt,
        referrer: r.referrer
      })),
      topReferrers,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Erreur admin stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
