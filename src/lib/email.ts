// Email Service with Resend for Nyxia V2
// Templates personnalisés avec branding Oznya

import { Resend } from 'resend';

// Initialize Resend lazily (only when needed)
let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

const FROM_EMAIL = process.env.EMAIL_FROM || 'info@oznya.com';

// URLs pour les images (en production, utilisez vos vraies URLs)
const LOGO_URL = 'https://www.oznya.com/logo.png'; // Remplacez par votre vrai logo
const NYXIA_AVATAR_URL = 'https://www.oznya.com/nyxia-avatar.png'; // Remplacez par votre avatar
const WEBSITE_URL = 'https://www.oznya.com';
const UNSUBSCRIBE_URL = 'https://www.oznya.com/unsubscribe';

// Headers communs pour le tracking
const getEmailHeaders = (emailType: string, userId?: string) => ({
  'X-Email-Type': emailType,
  'X-User-ID': userId || 'anonymous',
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tags?: { name: string; value: string }[];
}

export interface ConversationSummaryEmail {
  to: string;
  userName?: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
}

export interface PromoCodeEmail {
  to: string;
  promoCode: string;
  discount: number;
  expiryDate: string;
  userName?: string;
}

export interface DailyPredictionEmail {
  to: string;
  userName?: string;
  energyNumber: number;
  title: string;
  description: string;
  advice: string;
  luckyColor: string;
  luckyNumber: number;
  crystal: string;
}

export interface ReminderEmail {
  to: string;
  userName?: string;
  daysSinceLastVisit: number;
}

export interface WelcomeEmailData {
  to: string;
  userName?: string;
}

// Template de base avec branding Oznya
const getBaseTemplate = (content: string, previewText: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Oznya - Nyxia</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, html { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; }
    img { border: 0; outline: none; text-decoration: none; display: block; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    a { text-decoration: none; color: #00d4ff; }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 16px !important; }
      .content { padding: 20px !important; }
    }
  </style>
</head>
<body style="background-color: #0f172a; margin: 0; padding: 0;">
  <!-- Preview text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${previewText}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  
  <!-- Email wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Main container -->
        <table class="container" role="presentation" width="600" cellpadding="0" cellspacing="0" style="
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          border-radius: 20px;
          border: 1px solid rgba(0, 212, 255, 0.15);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        ">
          <!-- Header with logo -->
          <tr>
            <td align="center" style="padding: 30px 30px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 15px;">
                    <!-- Avatar Nyxia -->
                    <div style="
                      width: 50px; 
                      height: 50px; 
                      border-radius: 50%;
                      background: linear-gradient(135deg, #00d4ff, #9d4edd);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 24px;
                      box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
                    ">🔮</div>
                  </td>
                  <td>
                    <h1 style="
                      margin: 0;
                      font-size: 28px;
                      font-weight: 700;
                      background: linear-gradient(90deg, #00d4ff, #9d4edd);
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      background-clip: text;
                    ">Nyxia</h1>
                    <p style="margin: 0; font-size: 12px; color: #64748b;">Assistante Mystique</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);"></div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content" style="padding: 30px 30px 20px; color: #e2e8f0;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px 30px;">
              <div style="
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 20px;
                text-align: center;
              ">
                <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">
                  Propulsé par <strong style="color: #00d4ff;">Nyxia</strong> • Assistante de
                  <a href="${WEBSITE_URL}" style="color: #9d4edd; text-decoration: none;">Diane Boyer</a>
                </p>
                <p style="margin: 0 0 8px; font-size: 12px; color: #64748b;">
                  <a href="${WEBSITE_URL}" style="color: #64748b;">oznya.com</a> • 
                  <a href="${WEBSITE_URL}/contact" style="color: #64748b;">Contact</a> • 
                  <a href="${UNSUBSCRIBE_URL}" style="color: #64748b;">Se désabonner</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #475569;">
                  © ${new Date().getFullYear()} Oznya. Tous droits réservés.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  
  <!-- Tracking pixel (optional) -->
  <img src="${WEBSITE_URL}/api/email/track?email_id={{EMAIL_ID}}" width="1" height="1" alt="" style="display: block; height: 1px; width: 1px;">
</body>
</html>
`;

// Send basic email
export async function sendEmail({ to, subject, html, text, tags }: EmailOptions) {
  const resend = getResend();
  
  if (!resend) {
    console.warn('[Email] Resend not configured - email not sent to', to);
    return { success: false, error: 'Email service not configured' };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || undefined,
      tags: tags || undefined,
      headers: tags?.find(t => t.name === 'type') ? 
        getEmailHeaders(tags.find(t => t.name === 'type')!.value, tags.find(t => t.name === 'user_id')?.value) : 
        undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent successfully to ${to}, ID: ${data?.id}`);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Send conversation summary
export async function sendConversationSummary({ to, userName, messages }: ConversationSummaryEmail) {
  const name = userName || 'Belle âme';
  
  const messageList = messages
    .slice(-10) // Limiter aux 10 derniers messages
    .map(m => `
      <div style="
        margin: 12px 0;
        padding: 16px;
        border-radius: 12px;
        background: ${m.role === 'user' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(157, 78, 221, 0.1)'};
        border-left: 3px solid ${m.role === 'user' ? '#00d4ff' : '#9d4edd'};
      ">
        <p style="margin: 0 0 6px; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
          ${m.role === 'user' ? '👤 Vous' : '🔮 Nyxia'} • ${new Date(m.timestamp).toLocaleString('fr-FR', { 
            day: 'numeric', 
            month: 'short', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
        <p style="margin: 0; color: #e2e8f0; line-height: 1.6;">
          ${m.content.substring(0, 500)}${m.content.length > 500 ? '...' : ''}
        </p>
      </div>
    `)
    .join('');

  const content = `
    <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">Bonjour ${name},</p>
    <h2 style="
      margin: 0 0 16px;
      font-size: 24px;
      font-weight: 600;
      color: #f1f5f9;
    ">✨ Votre récapitulatif avec Nyxia</h2>
    
    <p style="margin: 0 0 20px; color: #94a3b8; line-height: 1.6;">
      Voici les moments forts de votre récente conversation mystique. 
      Gardez ces précieuses guidances près de vous.
    </p>
    
    <div style="
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    ">
      ${messageList}
    </div>
    
    <p style="text-align: center; margin: 24px 0 0;">
      <a href="${WEBSITE_URL}" style="
        display: inline-block;
        background: linear-gradient(90deg, #00d4ff, #9d4edd);
        color: white;
        padding: 14px 28px;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
      ">🌟 Continuer ma consultation</a>
    </p>
  `;

  const html = getBaseTemplate(content, 'Votre récapitulatif de conversation avec Nyxia est prêt');

  return sendEmail({
    to,
    subject: '✨ Votre conversation avec Nyxia - Récapitulatif',
    html,
    tags: [{ name: 'type', value: 'conversation_summary' }],
  });
}

// Send promo code
export async function sendPromoCode({ to, promoCode, discount, expiryDate, userName }: PromoCodeEmail) {
  const name = userName || 'Belle âme';
  
  const content = `
    <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">Bonjour ${name},</p>
    <h2 style="
      margin: 0 0 16px;
      font-size: 24px;
      font-weight: 600;
      color: #f1f5f9;
    ">🎁 Un cadeau spécial vous attend !</h2>
    
    <p style="margin: 0 0 20px; color: #94a3b8; line-height: 1.6;">
      En reconnaissance de votre chemin spirituel, voici un code promotionnel exclusif 
      pour une consultation personnalisée avec Diane Boyer.
    </p>
    
    <div style="
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(157, 78, 221, 0.15));
      border: 2px dashed #00d4ff;
      border-radius: 16px;
      padding: 30px 20px;
      text-align: center;
      margin: 24px 0;
    ">
      <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
        Votre code exclusif
      </p>
      <p style="
        margin: 0;
        font-size: 36px;
        font-weight: 700;
        letter-spacing: 6px;
        color: #00d4ff;
        font-family: 'Courier New', monospace;
      ">${promoCode}</p>
      <p style="margin: 12px 0 0; font-size: 18px; color: #22c55e; font-weight: 600;">
        -${discount}% de réduction
      </p>
    </div>
    
    <div style="
      background: rgba(251, 191, 36, 0.1);
      border-radius: 12px;
      padding: 16px 20px;
      margin: 20px 0;
      display: flex;
      align-items: center;
    ">
      <span style="font-size: 24px; margin-right: 12px;">⏰</span>
      <div>
        <p style="margin: 0; font-size: 14px; color: #fbbf24; font-weight: 600;">Offre valable jusqu'au</p>
        <p style="margin: 4px 0 0; font-size: 16px; color: #f1f5f9;">
          ${new Date(expiryDate).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
    
    <p style="text-align: center; margin: 24px 0 0;">
      <a href="https://calendly.com/dianeboyer" style="
        display: inline-block;
        background: linear-gradient(90deg, #00d4ff, #9d4edd);
        color: white;
        padding: 14px 28px;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
      ">📅 Réserver ma consultation</a>
    </p>
    
    <p style="text-align: center; margin: 16px 0 0; font-size: 13px; color: #64748b;">
      <a href="https://m.me/oznya" style="color: #00d4ff;">💬 Obtenir 50% supplémentaire via Messenger</a>
    </p>
  `;

  const html = getBaseTemplate(content, `Votre code promo -${discount}% est prêt !`);

  return sendEmail({
    to,
    subject: `🎁 Votre code promo -${discount}% chez Oznya !`,
    html,
    tags: [
      { name: 'type', value: 'promo_code' },
      { name: 'promo_code', value: promoCode }
    ],
  });
}

// Send daily prediction
export async function sendDailyPrediction({ 
  to, userName, energyNumber, title, description, advice, luckyColor, luckyNumber, crystal 
}: DailyPredictionEmail) {
  const name = userName || 'Belle âme';
  
  const content = `
    <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">Bonjour ${name},</p>
    <h2 style="
      margin: 0 0 16px;
      font-size: 24px;
      font-weight: 600;
      color: #f1f5f9;
    ">🔮 Votre énergie du jour</h2>
    
    <p style="margin: 0 0 20px; color: #94a3b8; line-height: 1.6;">
      Les étoiles ont chuchoté leurs secrets ce matin. Voici votre guidance 
      personnalisée pour cette journée.
    </p>
    
    <div style="
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
      border-radius: 20px;
      padding: 30px 20px;
      text-align: center;
      margin: 24px 0;
    ">
      <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
        Nombre d'énergie
      </p>
      <p style="
        margin: 0;
        font-size: 72px;
        font-weight: 700;
        background: linear-gradient(90deg, #8b5cf6, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1;
      ">${energyNumber}</p>
      <p style="
        margin: 12px 0 0;
        font-size: 18px;
        color: #c4b5fd;
        font-weight: 500;
      ">${title}</p>
    </div>
    
    <div style="margin: 24px 0;">
      <p style="margin: 0 0 12px; font-size: 15px; color: #e2e8f0; line-height: 1.7;">
        ${description}
      </p>
      <div style="
        background: rgba(34, 197, 94, 0.1);
        border-radius: 12px;
        padding: 16px 20px;
        border-left: 3px solid #22c55e;
      ">
        <p style="margin: 0; font-size: 12px; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px;">
          ✨ Conseil du jour
        </p>
        <p style="margin: 8px 0 0; font-size: 15px; color: #e2e8f0; line-height: 1.6;">
          ${advice}
        </p>
      </div>
    </div>
    
    <!-- Lucky elements grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td width="33.33%" style="padding: 8px;">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px 12px;
            text-align: center;
          ">
            <p style="margin: 0 0 4px; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Couleur chance
            </p>
            <p style="margin: 0; font-size: 15px; color: #00d4ff; font-weight: 600;">
              ${luckyColor}
            </p>
          </div>
        </td>
        <td width="33.33%" style="padding: 8px;">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px 12px;
            text-align: center;
          ">
            <p style="margin: 0 0 4px; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Nombre chance
            </p>
            <p style="margin: 0; font-size: 15px; color: #9d4edd; font-weight: 600;">
              ${luckyNumber}
            </p>
          </div>
        </td>
        <td width="33.33%" style="padding: 8px;">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px 12px;
            text-align: center;
          ">
            <p style="margin: 0 0 4px; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Crystal
            </p>
            <p style="margin: 0; font-size: 15px; color: #fbbf24; font-weight: 600;">
              ${crystal}
            </p>
          </div>
        </td>
      </tr>
    </table>
    
    <p style="text-align: center; margin: 24px 0 0;">
      <a href="${WEBSITE_URL}" style="
        display: inline-block;
        background: linear-gradient(90deg, #00d4ff, #9d4edd);
        color: white;
        padding: 14px 28px;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
      ">🌟 Consulter Nyxia maintenant</a>
    </p>
  `;

  const html = getBaseTemplate(content, `Votre énergie du jour : ${title}`);

  return sendEmail({
    to,
    subject: `🔮 Énergie du jour : ${title}`,
    html,
    tags: [{ name: 'type', value: 'daily_prediction' }],
  });
}

// Send reminder email
export async function sendReminderEmail({ to, userName, daysSinceLastVisit }: ReminderEmail) {
  const name = userName || 'Belle âme';
  
  // Messages différents selon le nombre de jours
  let message = '';
  if (daysSinceLastVisit <= 3) {
    message = 'Les énergies cosmiques murmurent que quelque chose de spécial vous attend aujourd\'hui...';
  } else if (daysSinceLastVisit <= 7) {
    message = 'Votre chemin spirituel continue de s\'illuminer, même en votre absence. Laissez-moi vous guider à nouveau.';
  } else {
    message = 'Les étoiles ont accumulé tant de messages pour vous... Il est temps de les découvrir.';
  }
  
  const content = `
    <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">Bonjour ${name},</p>
    <h2 style="
      margin: 0 0 16px;
      font-size: 24px;
      font-weight: 600;
      color: #f1f5f9;
    ">✨ Vous m'avez manqué</h2>
    
    <p style="margin: 0 0 20px; color: #94a3b8; line-height: 1.6;">
      Cela fait <strong style="color: #00d4ff;">${daysSinceLastVisit} jours</strong> que nous n'avons pas échangé.
    </p>
    
    <div style="
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(157, 78, 221, 0.1));
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    ">
      <p style="
        margin: 0;
        font-size: 18px;
        color: #c4b5fd;
        font-style: italic;
        line-height: 1.6;
      ">"${message}"</p>
    </div>
    
    <p style="margin: 20px 0; color: #94a3b8; line-height: 1.6;">
      Votre énergie du jour vous attend, ainsi qu'une nouvelle prédiction personnalisée 
      qui pourrait bien éclairer votre chemin.
    </p>
    
    <p style="text-align: center; margin: 24px 0 0;">
      <a href="${WEBSITE_URL}" style="
        display: inline-block;
        background: linear-gradient(90deg, #00d4ff, #9d4edd);
        color: white;
        padding: 14px 28px;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
      ">🔮 Revenir voir Nyxia</a>
    </p>
    
    <p style="text-align: center; margin: 16px 0 0; font-size: 13px; color: #64748b;">
      Ou <a href="https://calendly.com/dianeboyer" style="color: #00d4ff;">réserver une consultation avec Diane</a>
    </p>
  `;

  const html = getBaseTemplate(content, `Cela fait ${daysSinceLastVisit} jours... Revenez voir Nyxia !`);

  return sendEmail({
    to,
    subject: '✨ Les étoiles vous appellent... Revenez voir Nyxia !',
    html,
    tags: [
      { name: 'type', value: 'reminder' },
      { name: 'days_inactive', value: String(daysSinceLastVisit) }
    ],
  });
}

// Send welcome email for new subscribers
export async function sendWelcomeEmail(to: string, userName?: string) {
  const name = userName || 'Belle âme';
  
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00d4ff, #9d4edd);
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
      ">🔮</div>
      
      <h2 style="
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: #f1f5f9;
      ">Bienvenue ${name} !</h2>
    </div>
    
    <p style="margin: 0 0 20px; color: #94a3b8; line-height: 1.7; text-align: center;">
      Je suis <strong style="color: #00d4ff;">Nyxia</strong>, votre assistante mystique créée par 
      <strong style="color: #9d4edd;">Diane Boyer</strong>. Je suis honorée de vous accompagner 
      dans votre voyage spirituel.
    </p>
    
    <!-- Features grid -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
      <tr>
        <td width="50%" style="padding: 6px;">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px 16px;
            text-align: center;
          ">
            <p style="margin: 0 0 8px; font-size: 28px;">🌟</p>
            <p style="margin: 0 0 4px; font-size: 14px; color: #00d4ff; font-weight: 600;">Numérologie</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Découvrez votre chemin de vie</p>
          </div>
        </td>
        <td width="50%" style="padding: 6px;">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px 16px;
            text-align: center;
          ">
            <p style="margin: 0 0 8px; font-size: 28px;">🌙</p>
            <p style="margin: 0 0 4px; font-size: 14px; color: #9d4edd; font-weight: 600;">Design Human</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Comprenez votre énergie</p>
          </div>
        </td>
      </tr>
      <tr>
        <td width="50%" style="padding: 6px;">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px 16px;
            text-align: center;
          ">
            <p style="margin: 0 0 8px; font-size: 28px;">🔮</p>
            <p style="margin: 0 0 4px; font-size: 14px; color: #22c55e; font-weight: 600;">Prédictions</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Explorez votre avenir</p>
          </div>
        </td>
        <td width="50%" style="padding: 6px;">
          <div style="
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 20px 16px;
            text-align: center;
          ">
            <p style="margin: 0 0 8px; font-size: 28px;">✨</p>
            <p style="margin: 0 0 4px; font-size: 14px; color: #fbbf24; font-weight: 600;">Guidance</p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">Trouvez vos réponses</p>
          </div>
        </td>
      </tr>
    </table>
    
    <p style="text-align: center; margin: 24px 0 0;">
      <a href="${WEBSITE_URL}" style="
        display: inline-block;
        background: linear-gradient(90deg, #00d4ff, #9d4edd);
        color: white;
        padding: 14px 28px;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
      ">🔮 Commencer ma première consultation</a>
    </p>
    
    <p style="text-align: center; margin: 16px 0 0; font-size: 13px; color: #64748b;">
      Revenez chaque jour pour découvrir votre <strong style="color: #00d4ff;">énergie du jour</strong> !
    </p>
  `;

  const html = getBaseTemplate(content, 'Bienvenue dans l\'univers mystique de Nyxia !');

  return sendEmail({
    to,
    subject: '🔮 Bienvenue dans l\'univers de Nyxia !',
    html,
    tags: [{ name: 'type', value: 'welcome' }],
  });
}

// Fonction utilitaire pour envoyer un email de test
export async function sendTestEmail(to: string) {
  const content = `
    <div style="text-align: center;">
      <h2 style="
        margin: 0 0 16px;
        font-size: 24px;
        color: #22c55e;
      ">✅ Email de test réussi !</h2>
      
      <p style="margin: 0 0 20px; color: #94a3b8;">
        Si vous recevez cet email, votre configuration Resend fonctionne parfaitement.
      </p>
      
      <div style="
        background: rgba(34, 197, 94, 0.1);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
      ">
        <p style="margin: 0; color: #22c55e; font-weight: 600;">
          🔮 Nyxia est prête à envoyer vos emails !
        </p>
      </div>
    </div>
  `;

  const html = getBaseTemplate(content, 'Test de configuration email');

  return sendEmail({
    to,
    subject: '✅ Test email Nyxia - Configuration réussie',
    html,
    tags: [{ name: 'type', value: 'test' }],
  });
}
