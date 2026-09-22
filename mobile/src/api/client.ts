import { CompetitionResponse, Registration, Submission, Testimonial } from './types';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import { config } from '../config';

// API base URL resolution, in order:
// 1. EXPO_PUBLIC_API_URL (e.g. a tunnel or deployed server)
// 2. The machine running Metro. Expo Go loads the bundle from it, so a backend
//    on the same machine is reachable at the same host on port 3001.
// 3. Android emulator / iOS simulator loopback addresses
function buildCandidateUrls(): string[] {
  const urls: string[] = [];
  if (config.apiUrl) urls.push(config.apiUrl.replace(/\/$/, ''));
  const hostUri = Constants.expoConfig?.hostUri; // e.g. "192.168.1.5:8081"
  const devHost = hostUri?.split(':')[0];
  if (devHost) urls.push(`http://${devHost}:${config.apiPort}/api`);
  urls.push(`http://10.0.2.2:${config.apiPort}/api`, `http://localhost:${config.apiPort}/api`);
  return Array.from(new Set(urls));
}

const CANDIDATE_URLS = buildCandidateUrls();

let activeBaseUrl: string | null = null;
let DEMO_USER_ID: string = config.demoUserId;
let serverTimeOffset = 0;

export function setDemoUserId(id: string) { DEMO_USER_ID = id; }
export function getServerTimeOffset() { return serverTimeOffset; }
export function getServerNow() { return new Date(Date.now() + serverTimeOffset); }

export function resolveAssetUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('file://') || path.startsWith('data:')) {
    return path;
  }
  const base = (activeBaseUrl || CANDIDATE_URLS[0]).replace(/\/api\/?$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Demo-User-Id': DEMO_USER_ID,
    ...(options.headers as Record<string, string> || {}),
  };

  const tryUrls = activeBaseUrl
    ? [activeBaseUrl, ...CANDIDATE_URLS.filter((u) => u !== activeBaseUrl)]
    : CANDIDATE_URLS;

  let lastErr: any = null;

  for (const base of tryUrls) {
    try {
      const res = await fetchWithTimeout(`${base}${path}`, { ...options, headers });
      const data = await res.json();
      if (!res.ok) throw { status: res.status, ...data };
      activeBaseUrl = base;
      return data as T;
    } catch (err: any) {
      lastErr = err;
      // If server responded with a specific status error (e.g. 404), do not keep searching other URLs
      if (err?.status) {
        throw err;
      }
      // Otherwise network error/timeout, try next candidate URL
    }
  }

  throw lastErr || new Error('All network endpoints failed to connect');
}

export async function fetchCompetition(slug: string, lang = 'en'): Promise<CompetitionResponse> {
  const data = await apiFetch<CompetitionResponse>(`/competitions/${encodeURIComponent(slug)}?lang=${lang}`);
  // Calculate server time offset
  const serverNow = new Date(data.serverTime).getTime();
  serverTimeOffset = serverNow - Date.now();
  return data;
}

export async function registerForCompetition(competitionId: string): Promise<Registration> {
  return apiFetch<Registration>(`/competitions/${competitionId}/registrations`, {
    method: 'POST',
    // expo-crypto uses the platform's secure RNG; the `uuid` package needs
    // crypto.getRandomValues, which React Native doesn't provide.
    headers: { 'Idempotency-Key': Crypto.randomUUID() },
  });
}

export async function confirmPayment(registrationId: string, success = true, paymentId?: string): Promise<Registration> {
  return apiFetch<Registration>(`/registrations/${registrationId}/confirm-payment`, {
    method: 'POST',
    body: JSON.stringify({ success, paymentId }),
  });
}

export async function submitEntry(competitionId: string, fileUri: string, fileName: string, mimeType = 'video/mp4'): Promise<Submission> {
  const baseUrl = activeBaseUrl || CANDIDATE_URLS[0];
  const formData = new FormData();
  formData.append('file', { uri: fileUri, name: fileName, type: mimeType } as any);
  const res = await fetch(`${baseUrl}/competitions/${competitionId}/submissions`, {
    method: 'POST',
    headers: { 'X-Demo-User-Id': DEMO_USER_ID },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export async function fetchTestimonials(limit = 10, lang = 'en'): Promise<Testimonial[]> {
  const data = await apiFetch<{ items: Testimonial[] }>(`/testimonials?limit=${limit}&lang=${lang}`);
  return data.items;
}

export async function fetchSubmission(competitionId: string): Promise<Submission> {
  return apiFetch<Submission>(`/competitions/${competitionId}/submissions/me`);
}

/**
 * Playable source for an authenticated API path (e.g. the user's own submission).
 * The video player sends the same auth header as API requests.
 */
export function authedMediaSource(apiPath: string): { uri: string; headers: Record<string, string> } {
  const base = activeBaseUrl || CANDIDATE_URLS[0];
  return { uri: `${base}${apiPath}`, headers: { 'X-Demo-User-Id': DEMO_USER_ID } };
}

/**
 * Demo mode: ask the server to restore the seeded state so every launch starts
 * fresh. Returns false when the server isn't running in demo mode (404) or is
 * unreachable — the app then just loads whatever state exists.
 */
export async function resetDemoData(): Promise<boolean> {
  try {
    await apiFetch('/demo/reset', { method: 'POST' });
    return true;
  } catch {
    return false;
  }
}
