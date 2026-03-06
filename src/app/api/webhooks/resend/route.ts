import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook pour recevoir les événements Resend (ouvertures, clics, etc.)
// Configuration: https://resend.com/webhooks

// Stockage des statistiques email (en production, utilisez une vraie DB)
const emailStats: Map<string, {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  lastEvent?: string;
  lastEventTime?: string;
}> = new Map();

// Vérification de la signature Resend (sécurité importante!)
function verifyResendSignature(payload: string, signature: string, timestamp: string): boolean {
  const resendSigningSecret = process.env.RESEND_WEBHOOK_SECRET;
  
  if (!resendSigningSecret) {
    console.warn('[Resend Webhook] Warning: RESEND_WEBHOOK_SECRET not configured');
    return true; // En développement, on peut passer
  }
  
  try {
    // Resend utilise un format: timestamp.signature
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', resendSigningSecret)
      .update(signedPayload)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error('[Resend Webhook] Signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le corps brut pour la vérification de signature
    const payload = await request.text();
    const body = JSON.parse(payload);
    
    // Vérifier la signature Resend (recommandé en production)
    const signature = request.headers.get('svix-signature') || '';
    const timestamp = request.headers.get('svix-timestamp') || '';
    
    // En production, activez cette vérification:
    // if (!verifyResendSignature(payload, signature, timestamp)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    
    // Types d'événements Resend:
    // - email.sent
    // - email.delivered
    // - email.opened
    // - email.clicked
    // - email.bounced
    // - email.complained
    
    const { type, data, created_at } = body;
    
    console.log(`[Resend Webhook] Event: ${type}`);
    console.log('[Resend Webhook] Data:', JSON.stringify(data, null, 2));
    
    // Mettre à jour les statistiques
    const emailId = data.email_id || 'unknown';
    const currentStats = emailStats.get(emailId) || {
      sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0
    };
    
    switch (type) {
      case 'email.sent':
        currentStats.sent++;
        await handleEmailSent(data);
        break;
        
      case 'email.opened':
        currentStats.opened++;
        await handleEmailOpened(data);
        break;
        
      case 'email.clicked':
        currentStats.clicked++;
        await handleEmailClicked(data);
        break;
        
      case 'email.delivered':
        currentStats.delivered++;
        await handleEmailDelivered(data);
        break;
        
      case 'email.bounced':
        currentStats.bounced++;
        await handleEmailBounced(data);
        break;
        
      case 'email.complained':
        currentStats.complained++;
        await handleEmailComplained(data);
        break;
        
      default:
        console.log(`[Resend Webhook] Unhandled event type: ${type}`);
    }
    
    currentStats.lastEvent = type;
    currentStats.lastEventTime = new Date().toISOString();
    emailStats.set(emailId, currentStats);
    
    return NextResponse.json({ 
      received: true,
      type,
      processedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Resend Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handlers pour chaque type d'événement
async function handleEmailSent(data: any) {
  const { email_id, from, to, subject, tags } = data;
  console.log(`[Email Sent] ID: ${email_id}, To: ${to}, Subject: ${subject}`);
  
  // Sauvegarder en base de données l'envoi
  // En production: await db.emailLog.create({ email_id, to, subject, status: 'sent' })
}

async function handleEmailOpened(data: any) {
  const { email_id, from, to, subject, tags, first_open } = data;
  
  console.log(`[Email Opened] ${to} opened email: ${subject}`);
  console.log(`[Email Opened] First open: ${first_open ? 'Yes' : 'No'}`);
  
  // Actions possibles:
  // 1. Enregistrer l'ouverture en base de données
  // 2. Mettre à jour le score d'engagement utilisateur
  // 3. Déclencher un email de follow-up si première ouverture
  
  if (tags?.type === 'promo_code' && first_open) {
    console.log(`[Email Opened] Promo code email opened for the first time by ${to}`);
    // Exemple: envoyer un rappel 24h plus tard si le code n'a pas été utilisé
  }
}

async function handleEmailClicked(data: any) {
  const { email_id, from, to, subject, url, tags, click } = data;
  
  console.log(`[Email Clicked] ${to} clicked: ${url}`);
  console.log(`[Email Clicked] Link: ${url}`);
  
  // Tracker les intérêts de l'utilisateur basés sur les clics
  if (url.includes('calendly.com')) {
    console.log(`[Email Clicked] User interested in booking: ${to}`);
    // En production: Mettre à jour le profil utilisateur avec cet intérêt
  }
  
  if (url.includes('oznya.com')) {
    console.log(`[Email Clicked] User visited website: ${to}`);
  }
  
  // Tracker la conversion
  // Exemple: Si clic sur "Réserver consultation" -> marquer comme lead qualifié
}

async function handleEmailDelivered(data: any) {
  const { email_id, from, to, subject } = data;
  
  console.log(`[Email Delivered] ${to}: ${subject}`);
  
  // Confirmer que l'email a atteint la boîte de réception
  // En production: await db.emailLog.update({ email_id }, { status: 'delivered' })
}

async function handleEmailBounced(data: any) {
  const { email_id, from, to, subject, bounce } = data;
  const bounceType = bounce?.type || 'unknown';
  const bounceMessage = bounce?.message || '';
  
  console.log(`[Email Bounced] ${to}: ${subject}`);
  console.log(`[Email Bounced] Type: ${bounceType}, Message: ${bounceMessage}`);
  
  // Types de bounce:
  // - 'hard': Adresse invalide définitivement
  // - 'soft': Problème temporaire (boîte pleine, etc.)
  
  if (bounceType === 'hard') {
    console.log(`[Email Bounced] HARD BOUNCE - Marking email as invalid: ${to}`);
    // En production: Marquer l'email comme invalide dans la DB
    // await db.user.update({ email: to }, { emailValid: false, emailBouncedAt: new Date() })
  }
}

async function handleEmailComplained(data: any) {
  const { email_id, from, to, subject } = data;
  
  console.log(`[Email Complaint] ⚠️ ${to} marked as spam: ${subject}`);
  
  // IMPORTANT: Ne plus jamais envoyer d'emails à cette adresse
  // C'est une exigence légale (CAN-SPAM, RGPD)
  
  // En production:
  // await db.user.update({ email: to }, { 
  //   emailComplained: true, 
  //   emailComplainedAt: new Date(),
  //   emailNotifications: false 
  // })
  
  // Optionnel: Supprimer de toutes les listes de diffusion
}

// GET pour obtenir les statistiques email
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get('email_id');
  
  // Statistiques globales
  let totalSent = 0, totalDelivered = 0, totalOpened = 0, totalClicked = 0, totalBounced = 0, totalComplained = 0;
  
  emailStats.forEach((stats) => {
    totalSent += stats.sent;
    totalDelivered += stats.delivered;
    totalOpened += stats.opened;
    totalClicked += stats.clicked;
    totalBounced += stats.bounced;
    totalComplained += stats.complained;
  });
  
  // Si un email_id spécifique est demandé
  if (emailId) {
    const stats = emailStats.get(emailId);
    return NextResponse.json({
      status: 'active',
      message: 'Resend webhook endpoint is running',
      emailId,
      stats: stats || null,
      timestamp: new Date().toISOString()
    });
  }
  
  return NextResponse.json({
    status: 'active',
    message: 'Resend webhook endpoint is running',
    timestamp: new Date().toISOString(),
    stats: {
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalBounced,
      totalComplained,
      openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(2) + '%' : '0%',
      clickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(2) + '%' : '0%',
      bounceRate: totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(2) + '%' : '0%'
    },
    configuration: {
      endpoint: '/api/webhooks/resend',
      method: 'POST',
      requiredHeaders: ['Content-Type: application/json'],
      note: 'Configurez ce webhook dans votre dashboard Resend: https://resend.com/webhooks'
    }
  });
}
