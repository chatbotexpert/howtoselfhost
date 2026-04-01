import { NextResponse } from 'next/server';
import { cookieOptions } from '@/lib/auth';

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const response = NextResponse.redirect(`${siteUrl}/admin`);

  response.cookies.set({
    ...cookieOptions(0),
    value: '',
  });

  return response;
}
