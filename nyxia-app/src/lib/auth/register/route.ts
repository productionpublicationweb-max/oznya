import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { randomBytes } from 'crypto';

// Fonction simple pour hasher le mot de passe
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'nyxia-salt-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, birthDate, referralCode } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Trouver le parrain si un code est fourni
    let referrer: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
    if (referralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: referralCode.toUpperCase() }
      });
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        birthDate: birthDate || null,
        referralCode: generateReferralCode(name),
        referredBy: referrer?.referralCode || null,
        credits: referrer ? 5 : 0, // Bonus de bienvenue si parrainé
      }
    });

    // Si parrain trouvé, créer le referral
    if (referrer) {
      await prisma.$transaction([
        prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
            code: referralCode.toUpperCase(),
            status: 'PENDING'
          }
        }),
        prisma.user.update({
          where: { id: referrer.id },
          data: { totalReferrals: { increment: 1 } }
        }),
        prisma.reward.create({
          data: {
            userId: user.id,
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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        birthDate: user.birthDate,
        credits: user.credits,
        referralCode: user.referralCode,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
