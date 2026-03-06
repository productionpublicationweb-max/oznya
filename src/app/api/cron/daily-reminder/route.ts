import { NextRequest, NextResponse } from 'next/server';
import { 
  sendDailyPrediction, 
  sendReminderEmail, 
  sendWelcomeEmail,
  sendTestEmail 
} from '@/lib/email';
import { getDailyEnergy } from '@/lib/dailyPrediction';

// =============================================================================
// SYSTÈME DE RAPPELS AUTOMATIQUES NYXIA
// =============================================================================
// 
// Pour activer les rappels automatiques, configurez un cron job:
// 
// OPTION 1 - Vercel Cron (recommandé):
// Ajoutez un fichier vercel.json à la racine:
// {
//   "crons": [{
//     "path": "/api/cron/daily-reminder",
//     "schedule": "0 8 * * *"
//   }]
// }
// 
// OPTION 2 - Service externe (cron-job.org, EasyCron):
// URL: https://votre-domaine.com/api/cron/daily-reminder
// Header: Authorization: Bearer YOUR_CRON_SECRET
// Fréquence: Quotidienne à 8h00 (heure serveur)
// 
// OPTION 3 - GitHub Actions:
// Créez .github/workflows/daily-reminder.yml
// =============================================================================

// Stockage temporaire des abonnés (en production, utilisez une vraie DB)
// Structure: Map<email, subscriber_data>
const subscribers = new Map<string, {
  email: string;
  name?: string;
  subscribedAt: string;
  lastEmailSent?: string;
  lastVisit?: string;
  emailCount: number;
  preferences: {
    dailyPrediction: boolean;
    reminders: boolean;
    promotions: boolean;
  };
  stats: {
    emailsOpened: number;
    emailsClicked: number;
  };
}>();

// Initialiser avec des données de test (à supprimer en production)
subscribers.set('test@oznya.com', {
  email: 'test@oznya.com',
  name: 'Test User',
  subscribedAt: new Date().toISOString(),
  emailCount: 0,
  preferences: {
    dailyPrediction: true,
    reminders: true,
    promotions: true
  },
  stats: {
    emailsOpened: 0,
    emailsClicked: 0
  }
});

export async function GET(request: NextRequest) {
  try {
    // Vérifier le secret d'autorisation (sécurité obligatoire en production)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('[Daily Reminder Cron] Starting at', new Date().toISOString());
    
    // Récupérer l'énergie du jour
    const dailyEnergy = getDailyEnergy();
    
    // Statistiques
    const stats = {
      totalSubscribers: subscribers.size,
      emailsSent: 0,
      errors: 0,
      skipped: 0
    };
    
    // Traiter chaque abonné
    for (const [email, subscriber] of subscribers) {
      try {
        // Vérifier les préférences
        if (!subscriber.preferences.dailyPrediction && !subscriber.preferences.reminders) {
          stats.skipped++;
          continue;
        }
        
        // Vérifier si un email a déjà été envoyé aujourd'hui
        const today = new Date().toDateString();
        if (subscriber.lastEmailSent && new Date(subscriber.lastEmailSent).toDateString() === today) {
          stats.skipped++;
          continue;
        }
        
        // Calculer les jours depuis la dernière visite
        const daysSinceLastVisit = subscriber.lastVisit 
          ? Math.floor((Date.now() - new Date(subscriber.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
          : 99;
        
        // Décider quel type d'email envoyer
        if (daysSinceLastVisit >= 3 && subscriber.preferences.reminders) {
          // Envoyer un rappel après 3+ jours d'inactivité
          await sendReminderEmail({
            to: subscriber.email,
            userName: subscriber.name,
            daysSinceLastVisit
          });
          console.log(`[Cron] Reminder sent to ${subscriber.email} (${daysSinceLastVisit} days inactive)`);
        } else if (subscriber.preferences.dailyPrediction) {
          // Envoyer la prédiction du jour
          await sendDailyPrediction({
            to: subscriber.email,
            userName: subscriber.name,
            energyNumber: dailyEnergy.number,
            title: dailyEnergy.title,
            description: dailyEnergy.description,
            advice: dailyEnergy.advice,
            luckyColor: dailyEnergy.luckyColor,
            luckyNumber: dailyEnergy.luckyNumber,
            crystal: dailyEnergy.crystal
          });
          console.log(`[Cron] Daily prediction sent to ${subscriber.email}`);
        }
        
        // Mettre à jour les infos abonné
        subscriber.lastEmailSent = new Date().toISOString();
        subscriber.emailCount++;
        stats.emailsSent++;
        
      } catch (error) {
        console.error(`[Cron] Error sending to ${email}:`, error);
        stats.errors++;
      }
    }
    
    console.log('[Daily Reminder Cron] Completed:', stats);
    
    return NextResponse.json({
      success: true,
      message: 'Daily reminders processed',
      dailyEnergy: {
        number: dailyEnergy.number,
        title: dailyEnergy.title
      },
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[Daily Reminder Cron] Fatal error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: String(error) },
      { status: 500 }
    );
  }
}

// POST - Gérer les abonnés (inscription, désinscription, mise à jour)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, name, preferences } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }
    
    switch (action) {
      case 'subscribe':
        // Nouvel abonné
        const dailyEnergy = getDailyEnergy();
        
        subscribers.set(email, {
          email,
          name: name || undefined,
          subscribedAt: new Date().toISOString(),
          emailCount: 0,
          preferences: preferences || {
            dailyPrediction: true,
            reminders: true,
            promotions: true
          },
          stats: {
            emailsOpened: 0,
            emailsClicked: 0
          }
        });
        
        // Envoyer email de bienvenue
        await sendWelcomeEmail(email, name);
        
        return NextResponse.json({
          success: true,
          message: 'Inscription réussie ! Un email de bienvenue vous a été envoyé.',
          subscriber: { email, name }
        });
        
      case 'unsubscribe':
        // Désabonnement
        if (subscribers.has(email)) {
          subscribers.delete(email);
          return NextResponse.json({
            success: true,
            message: 'Vous avez été désabonné avec succès.'
          });
        }
        return NextResponse.json({
          success: false,
          message: 'Email non trouvé dans la liste.'
        });
        
      case 'update':
        // Mise à jour des préférences
        const existing = subscribers.get(email);
        if (existing) {
          subscribers.set(email, {
            ...existing,
            name: name || existing.name,
            preferences: preferences || existing.preferences
          });
          return NextResponse.json({
            success: true,
            message: 'Préférences mises à jour.'
          });
        }
        return NextResponse.json({
          success: false,
          message: 'Email non trouvé.'
        });
        
      case 'test':
        // Envoyer un email de test
        await sendTestEmail(email);
        return NextResponse.json({
          success: true,
          message: `Email de test envoyé à ${email}`
        });
        
      case 'send-daily':
        // Envoyer la prédiction du jour manuellement
        const energy = getDailyEnergy();
        await sendDailyPrediction({
          to: email,
          userName: name,
          energyNumber: energy.number,
          title: energy.title,
          description: energy.description,
          advice: energy.advice,
          luckyColor: energy.luckyColor,
          luckyNumber: energy.luckyNumber,
          crystal: energy.crystal
        });
        return NextResponse.json({
          success: true,
          message: `Prédiction du jour envoyée à ${email}`
        });
        
      case 'record-visit':
        // Enregistrer une visite (pour le tracking d'inactivité)
        const sub = subscribers.get(email);
        if (sub) {
          sub.lastVisit = new Date().toISOString();
          subscribers.set(email, sub);
        }
        return NextResponse.json({
          success: true,
          message: 'Visite enregistrée'
        });
        
      default:
        return NextResponse.json({
          error: 'Action non reconnue. Actions: subscribe, unsubscribe, update, test, send-daily, record-visit'
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('[Subscriber API] Error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors du traitement',
      details: String(error) 
    }, { status: 500 });
  }
}

// GET avec paramètres - Obtenir les infos d'un abonné ou la liste
export async function getSubscribers(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (email) {
    const subscriber = subscribers.get(email);
    return NextResponse.json({
      found: !!subscriber,
      subscriber: subscriber || null
    });
  }
  
  // Liste de tous les abonnés (sans les emails pour la confidentialité)
  const list = Array.from(subscribers.values()).map(s => ({
    name: s.name,
    subscribedAt: s.subscribedAt,
    emailCount: s.emailCount,
    preferences: s.preferences
  }));
  
  return NextResponse.json({
    total: subscribers.size,
    subscribers: list
  });
}
