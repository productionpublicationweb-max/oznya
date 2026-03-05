import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Check current session (simplified - no JWT for now)
export async function GET() {
  try {
    // For now, we'll use a simple approach with localStorage on client
    // In production, you'd verify a JWT token here
    return NextResponse.json({ user: null });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
}

// DELETE - Logout
export async function DELETE() {
  return NextResponse.json({ success: true });
}
