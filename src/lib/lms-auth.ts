import { headers } from 'next/headers';

// LMS User from auth header or cookie
export interface LMSAuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Verify LMS user authentication from request
// Checks for X-LMS-User-Id header (set by middleware) or falls back to query-based validation
export async function verifyLMSAuth(request: Request): Promise<LMSAuthUser | null> {
  try {
    // Try to get user ID from custom header (client sends this from localStorage)
    const userId = request.headers.get('x-lms-user-id');
    const userRole = request.headers.get('x-lms-user-role');

    if (!userId) {
      // Fallback: check query params for GET requests
      const url = new URL(request.url);
      const queryUserId = url.searchParams.get('userId');
      if (queryUserId) {
        // Validate the user exists in DB
        const { db } = await import('./db');
        const user = await db.lMSUser.findUnique({ where: { id: queryUserId } });
        if (user) {
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }
      }
      return null;
    }

    // Validate user exists in database
    const { db } = await import('./db');
    const user = await db.lMSUser.findUnique({ where: { id: userId } });
    if (!user) return null;

    // If a role was specified in the header, verify it matches the DB role
    // (prevents role escalation via header manipulation)
    if (userRole && userRole !== user.role) {
      return null; // Role mismatch — possible tampering
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
}

// Check if user has required role
export function hasRole(user: LMSAuthUser, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role);
}

// Verify user owns a resource or has admin access
export function canAccessResource(user: LMSAuthUser, resourceOwnerId: string): boolean {
  return user.role === 'admin' || user.id === resourceOwnerId;
}
