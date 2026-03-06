import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// =============================================================================
// SAUVEGARDE QUOTIDIENNE DES UTILISATEURS
// =============================================================================
// 
// Configure un cron job pour appeler cette API chaque jour:
// 
// VERCEL:
// Ajoutez dans vercel.json:
// {
//   "crons": [{
//     "path": "/api/cron/backup",
//     "schedule": "0 0 * * *"  // Chaque jour à minuit
//   }]
// }
// 
// SERVICE EXTERNE (cron-job.org):
// URL: https://nyxia.oznya.com/api/cron/backup
// Header: Authorization: Bearer YOUR_CRON_SECRET
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Vérifier le secret d'autorisation
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    console.log('[Daily Backup] Starting at', new Date().toISOString());
    
    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        referralCode: true,
        credits: true,
        loyaltyPoints: true,
        level: true,
        xp: true,
        totalMessages: true,
        totalReferrals: true,
        createdAt: true,
        lastActiveAt: true,
        birthDate: true,
        theme: true,
        notifications: true,
        referredBy: true,
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Préparer les données de sauvegarde
    const backupData = {
      backupDate: new Date().toISOString(),
      totalUsers: users.length,
      users: users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        lastActiveAt: user.lastActiveAt?.toISOString() || null,
      })),
    };
    
    // Créer aussi un fichier CSV des emails
    const dateStr = new Date().toISOString().split('T')[0];
    const csvContent = [
      'Email,Nom,Date Inscription,Code Parrainage,Niveau,Crédits',
      ...users.map(u => 
        `"${u.email}","${u.name || ''}","${u.createdAt.toISOString()}","${u.referralCode || ''}",${u.level},${u.credits}`
      )
    ].join('\n');
    
    console.log(`[Daily Backup] Completed: ${users.length} users`);
    
    return NextResponse.json({
      success: true,
      backupDate: backupData.backupDate,
      totalUsers: backupData.totalUsers,
      csvDownload: `data:text/csv;base64,${Buffer.from(csvContent).toString('base64')}`,
      emails: users.map(u => u.email),
    });
    
  } catch (error) {
    console.error('[Daily Backup] Error:', error);
    return NextResponse.json(
      { error: 'Erreur de sauvegarde', details: String(error) },
      { status: 500 }
    );
  }
}
