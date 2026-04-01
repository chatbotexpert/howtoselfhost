import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, cookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminHash) {
      console.error('ADMIN_EMAIL or ADMIN_PASSWORD_HASH not set in env');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
    const passwordMatch = bcrypt.compareSync(password, adminHash);

    if (!emailMatch || !passwordMatch) {
      // Same error message for both — don't reveal which is wrong
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signToken(email.toLowerCase());
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      ...cookieOptions(60 * 60 * 24 * 7), // 7 days
      value: token,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
