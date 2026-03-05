import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Simple auth check
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_SECRET_KEY;
  return authHeader === `Bearer ${adminKey}` || !adminKey;
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

    const [
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      totalReferrals,
      pendingReferrals,
      completedReferrals,
      totalRewards,
      unusedRewards,
      recentUsers,
      recentReferrals,
      topReferrers
    ] = await Promise.all([
      // Total utilisateurs
      prisma.user.count(),
      
      // Nouveaux utilisateurs aujourd'hui
      prisma.user.count({
        where: { createdAt: { gte: today } }
      }),
      
      // Nouveaux utilisateurs cette semaine
      prisma.user.count({
        where: { createdAt: { gte: lastWeek } }
      }),
      
      // Nouveaux utilisateurs ce mois
      prisma.user.count({
        where: { createdAt: { gte: lastMonth } }
      }),
      
      // Total parrainages
      prisma.referral.count(),
      
      // Parrainages en attente
      prisma.referral.count({
        where: { status: 'PENDING' }
      }),
      
      // Parrainages récompensés
      prisma.referral.count({
        where: { status: 'REWARDED' }
      }),
      
      // Total récompenses
      prisma.reward.count(),
      
      // Récompenses non utilisées
      prisma.reward.count({
        where: { used: false }
      }),
      
      // Utilisateurs récents
      prisma.user.findMany({
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
      }),
      
      // Parrainages récents
      prisma.referral.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          referrer: { select: { email: true, name: true } }
        }
      }),
      
      // Top parrains
      prisma.user.findMany({
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
      })
    ]);

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
