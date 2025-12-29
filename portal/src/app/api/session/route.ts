import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { customerNo } = (await request.json()) as { customerNo?: string };

  if (!customerNo) {
    return NextResponse.json({ message: 'customerNo is required' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('customerNo', customerNo, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('customerNo', '', { path: '/', maxAge: 0 });
  return res;
}
