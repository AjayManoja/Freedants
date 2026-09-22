import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { Competition } from '../src/models/Competition';
import { User } from '../src/models/User';
import { Registration } from '../src/models/Registration';

let mongoServer: MongoMemoryServer;
let compId: string;
let userIds: string[] = [];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const comp = new Competition({
    slug: 'concurrency-test',
    title: 'Concurrency Test',
    tags: ['Test'],
    perks: [],
    currency: 'INR',
    prizePool: 1000,
    entryFee: 99,
    capacity: 1,
    bookedCount: 0,
    judge: { name: 'Judge', title: 'Judge', experience: '10 yrs', avatarUrl: '', introVideoUrl: null },
    dates: {
      registrationClosesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      submissionStartsAt: new Date(Date.now() - 1000),
      submissionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      resultAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    about: ['Test'],
    judgingParameters: [],
    rules: [],
    rewards: [],
    disclaimer: 'Test',
    previousWinners: [],
    referral: { rewardPerSignup: 10, baseUrl: 'https://feedants.com/r/' },
  });
  await comp.save();
  compId = comp._id.toString();

  // Create 10 distinct users for concurrent registration
  for (let i = 0; i < 10; i++) {
    const u = new User({ name: `Racer ${i}`, referralCode: `racer${i}`, language: 'en' });
    await u.save();
    userIds.push(u._id.toString());
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Concurrency: Last Spot Race', () => {
  beforeEach(async () => {
    await Registration.deleteMany({});
    await Competition.findByIdAndUpdate(compId, { bookedCount: 0, capacity: 1 });
  });

  it('should produce exactly 1 success when 10 users race for the last spot', async () => {
    const promises = userIds.map((uid, index) =>
      request(app)
        .post(`/api/competitions/${compId}/registrations`)
        .set('X-Demo-User-Id', uid)
        .set('Idempotency-Key', `race-key-${index}`)
    );

    const results = await Promise.all(promises);

    const successes = results.filter(r => r.status === 201);
    const fulls = results.filter(r => r.status === 409 && r.body.error === 'FULL');

    expect(successes.length).toBe(1);
    expect(fulls.length).toBe(9);

    // Verify bookedCount was not over-incremented
    const comp = await Competition.findById(compId);
    expect(comp!.bookedCount).toBe(1);

    // Verify exactly 1 registration exists
    const regs = await Registration.find({ competitionId: compId });
    expect(regs.length).toBe(1);
  });

  it('double-tap from same user produces only 1 registration', async () => {
    const uid = userIds[0];
    const key = 'double-tap-key';

    const [res1, res2] = await Promise.all([
      request(app)
        .post(`/api/competitions/${compId}/registrations`)
        .set('X-Demo-User-Id', uid)
        .set('Idempotency-Key', key),
      request(app)
        .post(`/api/competitions/${compId}/registrations`)
        .set('X-Demo-User-Id', uid)
        .set('Idempotency-Key', key),
    ]);

    // Both should succeed (idempotency)
    const allSuccesses = [res1, res2].filter(r => r.status === 201);
    expect(allSuccesses.length).toBeGreaterThanOrEqual(1);

    // Only 1 registration and 1 spot booked
    const regs = await Registration.find({ competitionId: compId, userId: uid });
    expect(regs.length).toBe(1);

    const comp = await Competition.findById(compId);
    expect(comp!.bookedCount).toBe(1);
  });
});
