// Email Templates personnalisés avec logo Oznya

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'info@oznya.com';

// URLs des images (remplacez par vos vraies URLs)
const LOGO_URL = 'https://www.oznya.com/logo.png';
const AVATAR_NYXIA = 'https://www.oznya.com/nyxia-avatar.png';
const BANNER_URL = 'https://www.oznya.com/banner-mystique.png';

// Template de base avec design Oznya
function getBaseTemplate(content: string, title: string) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Container principal -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; border: 1px solid rgba(0, 212, 255, 0.2); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Header avec logo -->
          <tr>
            <td align="center" style="padding: 30px 30px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 15px;">
                    <img src="${AVATAR_NYXIA}" alt="Nyxia" width="60" height="60" style="border-radius: 50%; border: 2px solid rgba(0, 212, 255, 0.3);" />
                  </td>
                  <td>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; background: linear-gradient(90deg, #00d4ff, #9d4edd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                      Nyxia
                    </h1>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #94a3b8;">
                      Assistante Mystique de Diane Boyer
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Ligne décorative -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent);"></div>
            </td>
          </tr>
          
          <!-- Contenu -->
          <tr>
            <td style="padding: 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px 30px; background: rgba(0, 0, 0, 0.2);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 15px; font-size: 14px; color: #94a3b8;">
                      Propulsé par <strong style="color: #00d4ff;">Nyxia</strong> • 
                      <a href="https://www.oznya.com" style="color: #00d4ff; text-decoration: none;">Oznya.com</a>
                    </p>
                    
                    <!-- Réseaux sociaux -->
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://facebook.com/oznya" style="text-decoration: none;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="opacity: 0.6;" />
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://instagram.com/oznya" style="text-decoration: none;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="24" height="24" style="opacity: 0.6;" />
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://m.me/Oznya" style="text-decoration: none;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="Messenger" width="24" height="24" style="opacity: 0.6;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 15px 0 0; font-size: 11px; color: #64748b;">
                      © 2024 Oznya. Tous droits réservés.<br>
                      <a href="#" style="color: #64748b; text-decoration: underline;">Se désabonner</a> • 
                      <a href="https://www.oznya.com/privacy" style="color: #64748b; text-decoration: underline;">Politique de confidentialité</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        <!-- Fin container -->
        
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// Interface pour les données d'email
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
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
  expiryDate?: string;
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

// Envoi d'email de base
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || undefined,
      tags: [
        { name: 'category', value: 'nyxia' },
        { name: 'source', value: 'chat-widget' }
      ]
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Email de bienvenue
export async function sendWelcomeEmail(to: string, userName?: string) {
  const name = userName || 'Belle âme';
  
  const content = `
    <div style="text-align: center;">
      <h2 style="margin: 0 0 10px; font-size: 26px; color: #e2e8f0;">
        Bienvenue ${name} ! ✨
      </h2>
      <p style="margin: 0 0 25px; color: #94a3b8; font-size: 15px;">
        Vous faites maintenant partie de l'univers mystique d'Oznya
      </p>
    </div>
    
    <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(157, 78, 221, 0.1)); border-radius: 16px; padding: 25px; text-align: center; border: 1px solid rgba(0, 212, 255, 0.2);">
      <p style="margin: 0 0 15px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
        Je suis <strong style="color: #00d4ff;">Nyxia</strong>, votre assistante mystique. 
        Je suis ravie de vous accompagner dans votre voyage spirituel vers la découverte de vous-même.
      </p>
      
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 20px auto;">
        <tr>
          <td style="padding: 8px;">
            <div style="background: rgba(0, 212, 255, 0.1); border-radius: 12px; padding: 15px 20px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🌟</div>
              <div style="font-size: 13px; color: #00d4ff; font-weight: 600;">Numérologie</div>
            </div>
          </td>
          <td style="padding: 8px;">
            <div style="background: rgba(157, 78, 221, 0.1); border-radius: 12px; padding: 15px 20px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🌙</div>
              <div style="font-size: 13px; color: #9d4edd; font-weight: 600;">Design Human</div>
            </div>
          </td>
          <td style="padding: 8px;">
            <div style="background: rgba(0, 212, 255, 0.1); border-radius: 12px; padding: 15px 20px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🔮</div>
              <div style="font-size: 13px; color: #00d4ff; font-weight: 600;">Prédictions</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.oznya.com" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #9d4edd); color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);">
        🌟 Commencer ma première consultation
      </a>
    </div>
    
    <p style="text-align: center; color: #94a3b8; font-size: 13px;">
      Revenez chaque jour pour découvrir votre <strong style="color: #00d4ff;">énergie du jour</strong> !
    </p>
  `;
  
  return sendEmail({
    to,
    subject: '🔮 Bienvenue dans l\'univers de Nyxia !',
    html: getBaseTemplate(content, 'Bienvenue')
  });
}

// Email récapitulatif de conversation
export async function sendConversationSummary({ to, userName, messages }: ConversationSummaryEmail) {
  const name = userName || 'Belle âme';
  
  const messageList = messages.slice(-10).map(m => `
    <div style="margin: 12px 0; padding: 15px; border-radius: 12px; background: ${m.role === 'user' ? 'rgba(0, 212, 255, 0.08)' : 'rgba(157, 78, 221, 0.08)'}; border-left: 3px solid ${m.role === 'user' ? '#00d4ff' : '#9d4edd'};">
      <p style="margin: 0 0 6px; font-size: 11px; color: #64748b;">
        ${m.role === 'user' ? '👤 Vous' : '🔮 Nyxia'} • ${new Date(m.timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
      </p>
      <p style="margin: 0; color: #e2e8f0; font-size: 14px; line-height: 1.5;">
        ${m.content.substring(0, 500)}${m.content.length > 500 ? '...' : ''}
      </p>
    </div>
  `).join('');

  const content = `
    <h2 style="margin: 0 0 5px; font-size: 24px; color: #e2e8f0;">
      📬 Votre conversation avec Nyxia
    </h2>
    <p style="margin: 0 0 25px; color: #94a3b8; font-size: 14px;">
      Bonjour ${name}, voici le récapitulatif de votre échange
    </p>
    
    <div style="background: rgba(0, 0, 0, 0.2); border-radius: 16px; padding: 20px; max-height: 400px; overflow-y: auto;">
      ${messageList}
    </div>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="https://www.oznya.com" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #9d4edd); color: white; padding: 12px 28px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Continuer la conversation →
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject: '✨ Votre conversation avec Nyxia - Récapitulatif',
    html: getBaseTemplate(content, 'Récapitulatif')
  });
}

// Email code promo
export async function sendPromoCode({ to, promoCode, discount, expiryDate }: PromoCodeEmail) {
  const expiry = expiryDate ? new Date(expiryDate).toLocaleDateString('fr-FR', { 
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  }) : 'dans 48 heures';
  
  const content = `
    <div style="text-align: center;">
      <h2 style="margin: 0 0 10px; font-size: 26px; color: #e2e8f0;">
        🎁 Votre code promo exclusif !
      </h2>
      <p style="margin: 0 0 25px; color: #94a3b8; font-size: 15px;">
        Vous avez reçu une offre spéciale pour une consultation
      </p>
    </div>
    
    <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1)); border-radius: 20px; padding: 30px; text-align: center; border: 2px dashed rgba(251, 191, 36, 0.4);">
      <div style="font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #fbbf24; margin-bottom: 10px;">
        ${promoCode}
      </div>
      <div style="font-size: 20px; color: #22c55e; font-weight: 600;">
        -${discount}% de réduction
      </div>
    </div>
    
    <p style="text-align: center; color: #94a3b8; font-size: 14px; margin: 20px 0;">
      ⏰ <strong>Valable jusqu'au :</strong><br>
      <span style="color: #e2e8f0;">${expiry}</span>
    </p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="https://www.oznya.com" style="display: inline-block; background: linear-gradient(90deg, #f59e0b, #fbbf24); color: #1e293b; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 15px;">
        Utiliser mon code →
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `🎁 Votre code promo -${discount}% chez Oznya !`,
    html: getBaseTemplate(content, 'Code Promo')
  });
}

// Email prédiction du jour
export async function sendDailyPrediction({ 
  to, userName, energyNumber, title, description, advice, luckyColor, luckyNumber, crystal 
}: DailyPredictionEmail) {
  const name = userName || 'Belle âme';
  
  const content = `
    <h2 style="margin: 0 0 5px; font-size: 24px; color: #e2e8f0;">
      🔮 Votre énergie du jour
    </h2>
    <p style="margin: 0 0 25px; color: #94a3b8; font-size: 14px;">
      Bonjour ${name}, les étoiles vous chuchotent...
    </p>
    
    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2)); border-radius: 20px; padding: 30px; text-align: center; border: 1px solid rgba(139, 92, 246, 0.3);">
      <div style="font-size: 56px; font-weight: 700; background: linear-gradient(90deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        ${energyNumber}
      </div>
      <div style="font-size: 18px; color: #c4b5fd; margin-top: 8px;">
        ${title}
      </div>
    </div>
    
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 20px 0;">
      ${description}
    </p>
    
    <div style="background: rgba(0, 212, 255, 0.08); border-radius: 12px; padding: 15px 20px; margin: 20px 0; border-left: 3px solid #00d4ff;">
      <p style="margin: 0; color: #00d4ff; font-size: 14px;">
        <strong>✨ Conseil du jour :</strong> ${advice}
      </p>
    </div>
    
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
      <tr>
        <td style="width: 33.33%; padding: 8px;">
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 15px; text-align: center;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Couleur</div>
            <div style="font-size: 14px; color: #00d4ff; margin-top: 6px; font-weight: 600;">${luckyColor}</div>
          </div>
        </td>
        <td style="width: 33.33%; padding: 8px;">
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 15px; text-align: center;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Nombre</div>
            <div style="font-size: 14px; color: #00d4ff; margin-top: 6px; font-weight: 600;">${luckyNumber}</div>
          </div>
        </td>
        <td style="width: 33.33%; padding: 8px;">
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 15px; text-align: center;">
            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Crystal</div>
            <div style="font-size: 14px; color: #00d4ff; margin-top: 6px; font-weight: 600;">${crystal}</div>
          </div>
        </td>
      </tr>
    </table>
    
    <div style="text-align: center;">
      <a href="https://www.oznya.com" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #9d4edd); color: white; padding: 12px 28px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Consulter Nyxia →
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `🔮 Énergie du jour : ${title}`,
    html: getBaseTemplate(content, 'Prédiction')
  });
}

// Email de rappel
export async function sendReminderEmail({ to, userName, daysSinceLastVisit }: ReminderEmail) {
  const name = userName || 'Belle âme';
  
  const content = `
    <div style="text-align: center;">
      <h2 style="margin: 0 0 10px; font-size: 26px; color: #e2e8f0;">
        ✨ ${name}, vous m'avez manqué !
      </h2>
      <p style="margin: 0 0 25px; color: #94a3b8; font-size: 15px;">
        Cela fait ${daysSinceLastVisit} jours que nous n'avons pas échangé
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <img src="${AVATAR_NYXIA}" alt="Nyxia" width="80" height="80" style="border-radius: 50%; border: 3px solid rgba(0, 212, 255, 0.3);" />
    </div>
    
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.7; text-align: center;">
      Les étoiles m'ont chuchoté que vous aviez besoin d'une guidance aujourd'hui...<br><br>
      Votre <strong style="color: #00d4ff;">énergie du jour</strong> vous attend, ainsi qu'une nouvelle prédiction personnalisée !
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.oznya.com" style="display: inline-block; background: linear-gradient(90deg, #00d4ff, #9d4edd); color: white; padding: 14px 32px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);">
        🌟 Revenir voir Nyxia
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject: '✨ Les étoiles vous appellent... Revenez voir Nyxia !',
    html: getBaseTemplate(content, 'Rappel')
  });
}
