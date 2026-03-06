// Système de notifications pour les nouvelles inscriptions
// Support: Email, Webhook Zapier, et logs

interface NewUserNotification {
  email: string;
  name: string | null;
  referralCode: string | null;
  referredBy: string | null;
  createdAt: Date;
}

/**
 * Envoie une notification par email (via Resend, SendGrid, etc.)
 * Configurer EMAIL_SERVICE et EMAIL_API_KEY dans .env
 */
export async function sendEmailNotification(user: NewUserNotification): Promise<boolean> {
  const emailService = process.env.EMAIL_SERVICE; // 'resend' | 'sendgrid' | 'none'
  const emailApiKey = process.env.EMAIL_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL; // Ton email Diane
  const fromEmail = process.env.FROM_EMAIL || 'noreply@oznya.com';

  if (!emailApiKey || !adminEmail || emailService === 'none') {
    console.log('📧 Email notification skipped (not configured)');
    return false;
  }

  const subject = `🔮 Nouvelle inscription Nyxia: ${user.email}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius: 12px;">
      <h1 style="color: #a78bfa; text-align: center;">✨ Nouvelle Inscription!</h1>
      
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: white; margin: 10px 0;">
          <strong style="color: #fbbf24;">Email:</strong> ${user.email}
        </p>
        <p style="color: white; margin: 10px 0;">
          <strong style="color: #fbbf24;">Nom:</strong> ${user.name || 'Non renseigné'}
        </p>
        <p style="color: white; margin: 10px 0;">
          <strong style="color: #fbbf24;">Code parrainage:</strong> ${user.referralCode || 'N/A'}
        </p>
        <p style="color: white; margin: 10px 0;">
          <strong style="color: #fbbf24;">Parrainé par:</strong> ${user.referredBy || 'Aucun'}
        </p>
        <p style="color: white; margin: 10px 0;">
          <strong style="color: #fbbf24;">Date:</strong> ${user.createdAt.toLocaleString('fr-FR')}
        </p>
      </div>
      
      <p style="color: #94a3b8; text-align: center; font-size: 12px;">
        Nyxia - Assistante Mystique de Diane Boyer
      </p>
    </div>
  `;

  try {
    if (emailService === 'resend') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${emailApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: adminEmail,
          subject,
          html,
        }),
      });
      return response.ok;
    } 
    
    if (emailService === 'sendgrid') {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${emailApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: adminEmail }] }],
          from: { email: fromEmail },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      return response.ok;
    }

    return false;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

/**
 * Envoie les données vers Zapier Webhook
 * Configurer ZAPIER_WEBHOOK_URL dans .env
 */
export async function sendZapierWebhook(user: NewUserNotification): Promise<boolean> {
  const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;

  if (!zapierWebhookUrl) {
    console.log('🔗 Zapier webhook skipped (not configured)');
    return false;
  }

  try {
    const response = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.name || '',
        referralCode: user.referralCode || '',
        referredBy: user.referredBy || '',
        createdAt: user.createdAt.toISOString(),
        date: user.createdAt.toLocaleDateString('fr-FR'),
        time: user.createdAt.toLocaleTimeString('fr-FR'),
        source: 'nyxia-registration',
      }),
    });
    
    console.log('🔗 Zapier webhook sent:', response.ok);
    return response.ok;
  } catch (error) {
    console.error('Zapier webhook error:', error);
    return false;
  }
}

/**
 * Sauvegarde les données utilisateur dans un fichier JSON local
 * Fichier: /download/users-backup.json
 */
export async function saveUserBackup(user: NewUserNotification): Promise<boolean> {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const backupDir = path.join(process.cwd(), 'download');
    const backupFile = path.join(backupDir, 'users-backup.json');
    
    // Créer le dossier si nécessaire
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Lire le fichier existant ou créer une liste vide
    let users: any[] = [];
    if (fs.existsSync(backupFile)) {
      const content = fs.readFileSync(backupFile, 'utf-8');
      users = JSON.parse(content);
    }
    
    // Ajouter le nouvel utilisateur
    users.push({
      ...user,
      createdAt: user.createdAt.toISOString(),
      savedAt: new Date().toISOString(),
    });
    
    // Sauvegarder
    fs.writeFileSync(backupFile, JSON.stringify(users, null, 2));
    console.log('💾 User backup saved to users-backup.json');
    
    return true;
  } catch (error) {
    console.error('User backup error:', error);
    return false;
  }
}

/**
 * Envoie TOUTES les notifications d'un coup
 */
export async function notifyNewUser(user: NewUserNotification): Promise<void> {
  console.log('🔔 Notifying new user:', user.email);
  
  // Exécuter en parallèle pour ne pas bloquer
  await Promise.all([
    sendEmailNotification(user),
    sendZapierWebhook(user),
    saveUserBackup(user),
  ]);
}
