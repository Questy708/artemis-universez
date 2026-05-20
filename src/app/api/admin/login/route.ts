import { NextResponse } from 'next/server';

const MAX_LOGIN_ATTEMPTS = 10;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Simple in-memory rate limiter for login attempts
// In production, use Redis or a proper rate-limiting service
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) return false;

  // Reset if outside the lockout window
  if (now - entry.firstAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return false;
  }

  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now - entry.firstAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count++;
  }
}

// Clean up old entries periodically (every 5 minutes)
if (typeof globalThis !== 'undefined' && !(globalThis as any).__loginCleanupInterval) {
  (globalThis as any).__loginCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of loginAttempts.entries()) {
      if (now - entry.firstAttempt > LOCKOUT_WINDOW_MS) {
        loginAttempts.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

// Edge-compatible hash function using Web Crypto API
async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 22); // ~16 bytes base64url equivalent
}

function randomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// POST /api/admin/login — authenticate with admin password
export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no ADMIN_PASSWORD is set, deny access with a helpful message
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin access not configured. Set ADMIN_PASSWORD in your .env file.' },
        { status: 403 }
      );
    }

    if (password !== adminPassword) {
      recordAttempt(ip);
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate a session token with cryptographic hash
    const timestamp = Date.now().toString();
    const random = randomHex(8); // Use crypto.getRandomValues instead of Math.random
    const hash = await sha256Hash(adminPassword + timestamp);
    const token = `adm_${timestamp}_${random}_${hash}`;

    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated',
      token, // Return token so client can store in localStorage and send via Authorization header
    });

    // Set HttpOnly cookie — not accessible via JavaScript, only by the server
    response.cookies.set('artemis_admin_token', token, {
      httpOnly: true,
      secure: isProduction, // Only require HTTPS in production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

// DELETE /api/admin/login — logout
export async function DELETE() {
  const isProduction = process.env.NODE_ENV === 'production';
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.set('artemis_admin_token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
