import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ user: null });
}

export async function DELETE() {
  return NextResponse.json({ success: true });
}
