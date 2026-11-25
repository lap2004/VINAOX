/**
 * Shared authenticated fetch wrapper for VINAXO Custom Admin API calls.
 * Stores the session-bound HMAC CSRF token exclusively in memory (never localStorage)
 * and sends anti-CSRF headers alongside same-origin credentials.
 */

let inMemoryCsrfToken = '';

export function setAdminCsrfToken(token: string | undefined | null): void {
  inMemoryCsrfToken = typeof token === 'string' ? token : '';
}

export function clearAdminCsrfToken(): void {
  inMemoryCsrfToken = '';
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  headers.set('X-Requested-With', 'XMLHttpRequest');

  if (method !== 'GET' && method !== 'HEAD') {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (inMemoryCsrfToken) {
      headers.set('X-CSRF-Token', inMemoryCsrfToken);
    }
  }

  return fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'same-origin'
  });
}
