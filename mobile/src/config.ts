// Runtime configuration. Values come from EXPO_PUBLIC_* env vars (see .env.example)
// so nothing environment-specific is hardcoded in components.

export const config = {
  /** Overrides API discovery, e.g. https://api.feedants.com/api */
  apiUrl: process.env.EXPO_PUBLIC_API_URL || null,
  /** Competition shown on launch. In the full app this comes from navigation params. */
  competitionSlug: process.env.EXPO_PUBLIC_COMPETITION_SLUG || 'feedants-classical-dance',
  /** Stub auth: the seeded demo user. Replace with a real session token in production. */
  demoUserId: process.env.EXPO_PUBLIC_DEMO_USER_ID || '000000000000000000000001',
  apiPort: Number(process.env.EXPO_PUBLIC_API_PORT) || 3001,
  /**
   * Ask the server to reset demo data on launch, so every fresh open starts
   * from the seeded state. Set EXPO_PUBLIC_RESET_ON_LAUNCH=false to keep data
   * between launches. The server only honours it in demo mode.
   */
  resetOnLaunch: process.env.EXPO_PUBLIC_RESET_ON_LAUNCH !== 'false',
  /** How often to refresh spots-left and registration state (ms) */
  refreshIntervalMs: 30_000,
} as const;
