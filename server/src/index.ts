import mongoose from 'mongoose';
import app from './app';
import { config } from './config';
import { seed } from './seed';

const PORT = config.port;

/**
 * Demo mode with no MONGODB_URI starts a throwaway in-memory MongoDB, so a
 * demo run leaves nothing behind. Otherwise connect to the configured server.
 */
async function connect(): Promise<string> {
  if (config.demoMode && !config.hasExternalMongo) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri('feedants'));
    return 'in-memory MongoDB (demo mode — data is not persisted)';
  }
  await mongoose.connect(config.mongoUri);
  return config.mongoUri;
}

async function start() {
  try {
    const where = await connect();
    console.log(`Connected to ${where}`);

    if (config.demoMode) {
      await seed();
      console.log('Seeded demo data');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
