import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  try {
    // Vérification simple via header
    const authKey = request.headers.get('x-admin-key');
    if (authKey !== 'nyxia-admin-2024') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Supprimer tous les utilisateurs (et leurs relations en cascade)
    await prisma.reward.deleteMany({});
    await prisma.referral.deleteMany({});
    await prisma.user.deleteMany({});

    return NextResponse.json({ 
      success: true, 
      message: 'Tous les utilisateurs ont été supprimés' 
    });
  } catch (error) {
    console.error('Erreur suppression:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression' 
    }, { status: 500 });
  }
}
