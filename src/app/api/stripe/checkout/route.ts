import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialization of Stripe (only when needed)
let stripeInstance: Stripe | null = null;
const getStripe = () => {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  return stripeInstance;
};

// Service prices in CAD cents
const SERVICE_PRICES: Record<string, { name: string; amount: number; description: string }> = {
  'consultation-30': {
    name: 'Consultation 30 minutes',
    amount: 8900, // $89.00 CAD
    description: 'Une séance de guidance personnalisée de 30 minutes avec Diane Boyer',
  },
  'consultation-60': {
    name: 'Consultation 60 minutes',
    amount: 12500, // $125.00 CAD
    description: 'Séance approfondie de 60 minutes avec analyse complète par Diane Boyer',
  },
  'messenger-50': {
    name: 'Consultation Email (50% rabais)',
    amount: 3000, // Example price with discount
    description: 'Consultation par email avec réduction spéciale',
  },
  'express-1q1r': {
    name: '1 Question | 1 Réponse',
    amount: 2500,
    description: 'Une question précise, une réponse éclairante',
  },
};

// Promo codes and their discounts
const PROMO_CODES: Record<string, { discountPercent: number; description: string }> = {
  'NYXIA15': { discountPercent: 15, description: '15% de réduction' },
  'COSMOS15': { discountPercent: 15, description: '15% de réduction' },
  'ETOILE15': { discountPercent: 15, description: '15% de réduction' },
  'LUNE15': { discountPercent: 15, description: '15% de réduction' },
  'MAGIC15': { discountPercent: 15, description: '15% de réduction' },
};

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  
  if (!stripe) {
    return NextResponse.json(
      { success: false, error: 'Paiement non configuré' },
      { status: 503 }
    );
  }
  
  try {
    const body = await request.json();
    const { serviceId, promoCode, customerEmail } = body;

    // Validate service
    const service = SERVICE_PRICES[serviceId];
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service non trouvé' },
        { status: 400 }
      );
    }

    // Calculate price with promo code
    let finalAmount = service.amount;
    let discountAmount = 0;
    
    if (promoCode) {
      const promo = PROMO_CODES[promoCode.toUpperCase()];
      if (promo) {
        discountAmount = Math.round(service.amount * (promo.discountPercent / 100));
        finalAmount = service.amount - discountAmount;
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: service.name,
              description: service.description,
              images: ['https://www.oznya.com/og-image.png'], // Add your product image
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      discounts: promoCode && PROMO_CODES[promoCode.toUpperCase()] ? [
        {
          coupon: await createOrGetCoupon(stripe, promoCode.toUpperCase(), PROMO_CODES[promoCode.toUpperCase()].discountPercent),
        },
      ] : undefined,
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}?payment=cancelled`,
      metadata: {
        serviceId,
        promoCode: promoCode || '',
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création de la session de paiement',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to create or get a coupon
async function createOrGetCoupon(stripe: Stripe, code: string, discountPercent: number): Promise<string> {
  try {
    // Try to create a new coupon
    const coupon = await stripe.coupons.create({
      percent_off: discountPercent,
      duration: 'once',
      name: `Code Promo ${code}`,
    });
    return coupon.id;
  } catch (error: any) {
    // If coupon already exists, we need to handle it differently
    // For simplicity, we'll create a new one each time
    // In production, you'd want to store coupon IDs and reuse them
    const coupon = await stripe.coupons.create({
      percent_off: discountPercent,
      duration: 'once',
      name: `Promo ${Date.now()}`,
    });
    return coupon.id;
  }
}

// GET endpoint to retrieve session status
export async function GET(request: NextRequest) {
  const stripe = getStripe();
  
  if (!stripe) {
    return NextResponse.json({ error: 'Paiement non configuré' }, { status: 503 });
  }
  
  const sessionId = request.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return NextResponse.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
}
