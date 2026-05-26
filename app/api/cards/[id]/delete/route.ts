import { NextResponse } from 'next/server';
import { cardStorage } from '../../../../lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = cardStorage.delete(id, token);

    if (!success) {
      return NextResponse.json({ error: 'Invalid token or card not found' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Delete Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
