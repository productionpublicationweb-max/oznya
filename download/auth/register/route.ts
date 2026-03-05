import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// Password hashing function
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

// Generate unique referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'NYXIA-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate promo code
function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'BIENVENUE-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, birthDate, referralCode } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Generate referral code for new user
    const userReferralCode = generateReferralCode();

    // Check referral code if provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode }
      });
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Create user with welcome bonuses
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        birthDate: birthDate || null,
        referralCode: userReferralCode,
        referredBy: referredBy,
        // 🎁 BONUS DE BIENVENUE
        credits: 5, // 5 crédits gratuits
        loyaltyPoints: 100, // 100 points de fidélité de départ
        level: 1,
        xp: 0,
        totalMessages: 0,
        totalSessions: 1,
        lastActiveAt: new Date(),
        theme: 'dark',
        notifications: true
      }
    });

    // Create welcome promo code (20% off, expires in 30 days)
    const welcomePromoCode = generatePromoCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.promoCode.create({
      data: {
        code: welcomePromoCode,
        userId: user.id,
        discount: 20,
        source: 'welcome',
        expiresAt
      }
    });

    // If user was referred, give referrer bonus
    if (referredBy) {
      await prisma.user.update({
        where: { id: referredBy },
        data: {
          credits: { increment: 3 },
          loyaltyPoints: { increment: 50 },
          totalReferrals: { increment: 1 }
        }
      });

      // Create referral record
      await prisma.referral.create({
        data: {
          referrerId: referredBy,
          referredId: user.id,
          code: referralCode,
          status: 'COMPLETED'
        }
      });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        promoCodes: [{
          code: welcomePromoCode,
          discount: 20,
          source: 'welcome',
          expiresAt: expiresAt.toISOString()
        }]
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
