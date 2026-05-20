import { cookies } from 'next/headers';

// Edge-compatible hash function using Web Crypto API
async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 22);
}

// Verify admin session from HttpOnly cookie AND/OR Authorization header
// The dual approach ensures auth works even if cookies are stripped by a reverse proxy
export async function verifyAdminAuth(request?: Request): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // If no password is configured, no admin access
  if (!adminPassword) return false;

  try {
    let token: string | undefined;

    // 1. Try reading from Authorization: Bearer header first (most reliable through proxies)
    if (request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    // 2. Fallback to HttpOnly cookie
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('artemis_admin_token')?.value;
    }

    if (!token) return false;

    // Token format: adm_{timestamp}_{random}_{hash}
    if (!token.startsWith('adm_')) return false;

    const afterPrefix = token.slice(4); // Remove 'adm_'
    const firstUnderscore = afterPrefix.indexOf('_');
    if (firstUnderscore === -1) return false;

    const timestamp = afterPrefix.slice(0, firstUnderscore);
    const afterTimestamp = afterPrefix.slice(firstUnderscore + 1);
    const secondUnderscore = afterTimestamp.indexOf('_');
    if (secondUnderscore === -1) return false;

    const hash = afterTimestamp.slice(secondUnderscore + 1);

    if (!timestamp || !hash) return false;

    // Verify the hash matches what we'd generate from the current password + timestamp
    const expectedHash = await sha256Hash(adminPassword + timestamp);
    return hash === expectedHash;
  } catch {
    return false;
  }
}
