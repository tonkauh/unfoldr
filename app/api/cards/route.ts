import { NextResponse } from 'next/server';
import { cardStorage } from '../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { frontText, surpriseText, cards, skinId } = body;

    if (!frontText || !surpriseText || !cards || !skinId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { id, ownerToken } = cardStorage.save({
      frontText,
      surpriseText,
      cards,
      skinId,
    });

    return NextResponse.json({ id, ownerToken });
  } catch (err) {
    console.error('API Save Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
