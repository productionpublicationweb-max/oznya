import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Générer un code de parrainage unique
function generateReferralCode(name?: string): string {
  const prefix = name ? name.substring(0, 3).toUpperCase() : 'NYX';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix;
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET - Obtenir les infos de parrainage d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }
    
    // Trouver ou créer l'utilisateur
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Créer l'utilisateur avec un code de parrainage
      user = await prisma.user.create({
        data: {
          email,
          referralCode: generateReferralCode(),
        }
      });
    }
    
    // Récupérer les parrainages où cet utilisateur est le parrain
    const referralsAsReferrer = await prisma.referral.findMany({
      where: { referrerId: user.id },
      include: {
        referred: { select: { name: true, email: true, createdAt: true } }
      }
    });
    
    // Récupérer les récompenses non utilisées
    const rewards = await prisma.reward.findMany({
      where: { 
        userId: user.id,
        used: false 
      }
    });
    
    const totalReferrals = user.totalReferrals;
    const completedReferrals = referralsAsReferrer.filter(r => r.status === 'COMPLETED' || r.status === 'REWARDED').length;
    const pendingReferrals = referralsAsReferrer.filter(r => r.status === 'PENDING').length;
    const availableRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        credits: user.credits,
        totalReferrals,
        completedReferrals,
        pendingReferrals,
        availableRewards,
        referredUsers: referralsAsReferrer.map(r => ({
          name: r.referred.name,
          email: r.referred.email?.replace(/(.{2}).*(@.*)/, '$1***$2'),
          status: r.status,
          createdAt: r.createdAt
        }))
      }
    });
    
  } catch (error) {
    console.error('Erreur referral GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Enregistrer un nouveau parrainage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, referralCode } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'Utilisateur existant',
        user: existingUser
      });
    }
    
    // Trouver le parrain si un code est fourni
    let referrer = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: referralCode.toUpperCase() }
      });
    }
    
    // Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        referralCode: generateReferralCode(name),
      }
    });
    
    // Si parrain trouvé, créer le referral et donner des crédits
    if (referrer) {
      await prisma.$transaction([
        // Créer le referral
        prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: newUser.id,
            code: referralCode.toUpperCase(),
            status: 'PENDING'
          }
        }),
        // Incrémenter le compteur du parrain
        prisma.user.update({
          where: { id: referrer.id },
          data: { totalReferrals: { increment: 1 } }
        }),
        // Donner des crédits de bienvenue au nouveau
        prisma.reward.create({
          data: {
            userId: newUser.id,
            type: 'DISCOUNT_PERCENT',
            amount: 15,
            description: 'Bonus de bienvenue via parrainage - 15% de réduction',
            source: 'REFERRAL'
          }
        })
      ]);
    }
    
    return NextResponse.json({
      success: true,
      message: referrer 
        ? 'Inscription réussie avec parrainage ! Vous avez reçu 15% de réduction.' 
        : 'Inscription réussie !',
      user: {
        id: newUser.id,
        email: newUser.email,
        referralCode: newUser.referralCode
      },
      hasReferrer: !!referrer
    });
    
  } catch (error) {
    console.error('Erreur referral POST:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Compléter un parrainage (après premier achat)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    // Trouver le referral en attente
    const pendingReferral = await prisma.referral.findFirst({
      where: {
        referredId: userId,
        status: 'PENDING'
      }
    });
    
    if (!pendingReferral) {
      return NextResponse.json({ message: 'Aucun parrainage en attente' });
    }
    
    // Marquer comme complété et donner la récompense au parrain
    await prisma.$transaction([
      prisma.referral.update({
        where: { id: pendingReferral.id },
        data: { 
          status: 'REWARDED',
          completedAt: new Date()
        }
      }),
      // Donner 10 crédits au parrain
      prisma.user.update({
        where: { id: pendingReferral.referrerId },
        data: { credits: { increment: 10 } }
      }),
      // Créer une récompense pour le parrain
      prisma.reward.create({
        data: {
          userId: pendingReferral.referrerId,
          type: 'CREDITS',
          amount: 10,
          description: 'Crédits de parrainage',
          source: 'REFERRAL'
        }
      })
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Parrainage complété ! 10 crédits donnés au parrain.'
    });
    
  } catch (error) {
    console.error('Erreur referral PUT:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
