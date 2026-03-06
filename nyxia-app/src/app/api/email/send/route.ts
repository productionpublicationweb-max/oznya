import { NextRequest, NextResponse } from 'next/server';
import {
  sendEmail,
  sendConversationSummary,
  sendPromoCode,
  sendDailyPrediction,
  sendReminderEmail,
  sendWelcomeEmail
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;

    switch (type) {
      case 'conversation-summary':
        result = await sendConversationSummary(data);
        break;
      
      case 'promo-code':
        result = await sendPromoCode(data);
        break;
      
      case 'daily-prediction':
        result = await sendDailyPrediction(data);
        break;
      
      case 'reminder':
        result = await sendReminderEmail(data);
        break;
      
      case 'welcome':
        result = await sendWelcomeEmail(data.to, data.userName);
        break;
      
      case 'custom':
        result = await sendEmail(data);
        break;
      
      default:
        return NextResponse.json(
          { success: false, error: 'Type d\'email non reconnu' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
