// Helper for making authenticated LMS API requests
// Automatically adds auth headers from localStorage

import type { LMSUser } from '@/components/artemis-project/lms/LMSApp';

export function getLMSHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const stored = localStorage.getItem('artemis-lms-user');
    if (stored) {
      const user: LMSUser = JSON.parse(stored);
      if (user.id) headers['x-lms-user-id'] = user.id;
      if (user.role) headers['x-lms-user-role'] = user.role;
    }
  } catch {
    // ignore
  }

  return headers;
}

export async function lmsFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...getLMSHeaders(),
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
