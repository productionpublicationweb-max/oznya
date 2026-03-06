import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });

    const allowedFields = ['name', 'birthDate', 'theme', 'notifications', 'loyaltyPoints', 'level', 'xp', 'badges', 'totalMessages', 'totalSessions', 'lastActiveAt'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'badges' && Array.isArray(updates[field])) {
          updateData[field] = JSON.stringify(updates[field]);
        } else {
          updateData[field] = updates[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 });

    const user = await prisma.user.update({ where: { id: userId }, data: updateData });

    const promoCodes = await prisma.promoCode.findMany({
      where: { userId: user.id, used: false, expiresAt: { gt: new Date() } },
      select: { code: true, discount: true, source: true, expiresAt: true }
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        promoCodes: promoCodes.map(p => ({ code: p.code, discount: p.discount, source: p.source, expiresAt: p.expiresAt.toISOString() }))
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil' }, { status: 500 });
  }
}
