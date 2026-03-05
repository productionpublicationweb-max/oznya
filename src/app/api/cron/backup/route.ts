import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

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
// URL: https://votre-domaine.com/api/cron/backup
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
    
    // Sauvegarder dans le dossier download
    const backupDir = path.join(process.cwd(), 'download');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Fichier avec date du jour
    const dateStr = new Date().toISOString().split('T')[0];
    const backupFile = path.join(backupDir, `nyxia-backup-${dateStr}.json`);
    
    // Sauvegarder
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    // Aussi créer/mettre à jour le fichier "latest"
    const latestFile = path.join(backupDir, 'nyxia-backup-latest.json');
    fs.writeFileSync(latestFile, JSON.stringify(backupData, null, 2));
    
    // Créer aussi un fichier CSV des emails
    const csvFile = path.join(backupDir, `nyxia-emails-${dateStr}.csv`);
    const csvContent = [
      'Email,Nom,Date Inscription,Code Parrainage,Niveau,Crédits',
      ...users.map(u => 
        `"${u.email}","${u.name || ''}","${u.createdAt.toISOString()}","${u.referralCode || ''}",${u.level},${u.credits}`
      )
    ].join('\n');
    fs.writeFileSync(csvFile, csvContent);
    
    console.log(`[Daily Backup] Completed: ${users.length} users saved`);
    
    return NextResponse.json({
      success: true,
      backupDate: backupData.backupDate,
      totalUsers: backupData.totalUsers,
      files: {
        json: backupFile,
        csv: csvFile,
        latest: latestFile,
      }
    });
    
  } catch (error) {
    console.error('[Daily Backup] Error:', error);
    return NextResponse.json(
      { error: 'Erreur de sauvegarde', details: String(error) },
      { status: 500 }
    );
  }
}
