import dotenv from 'dotenv';

dotenv.config();

// Single source of runtime configuration for the server, seed and state scripts.
export const config = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/feedants',
  port: Number(process.env.PORT) || 3001,
  isProduction: process.env.NODE_ENV === 'production',
  /** Demo mode: in-memory database and a reset endpoint the app calls on launch. */
  demoMode: process.env.DEMO_MODE === 'true',
  /** Set when demo mode should still use an external MongoDB. */
  hasExternalMongo: !!process.env.MONGODB_URI,
  /** Stub auth: user assumed when no X-Demo-User-Id header is sent (never in production). */
  demoUserId: process.env.DEMO_USER_ID || '000000000000000000000001',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 200,
};
