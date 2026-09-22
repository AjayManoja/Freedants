import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { Competition } from '../src/models/Competition';
import { User } from '../src/models/User';
import { Registration } from '../src/models/Registration';

let mongoServer: MongoMemoryServer;
let compId: string;
let userId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Seed manually for tests (don't use seed.ts which reads from file)
  const comp = new Competition({
    slug: 'feedants-classical-dance',
    title: 'Feedants Classical Dance',
    tags: ['Dance', 'Multi-Win'],
    perks: ['Winners get certificate'],
    currency: 'INR',
    prizePool: 1500,
    entryFee: 99,
    capacity: 20,
    bookedCount: 0,
    judge: { name: 'Manju Dubey', title: 'Professional Kathak Dancer', experience: '12+ Years of Experience', avatarUrl: 'assets/judge.jpg', introVideoUrl: null },
    dates: {
      registrationClosesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      submissionStartsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),   // started yesterday
      submissionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),     // 30 days from now
      resultAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    about: ['Test competition'],
    judgingParameters: ['[Judging parameter 1]'],
    rules: ['[Rule 1]'],
    rewards: [{ position: 1, label: '1st Winner', amount: 550, icon: 'trophy' }],
    disclaimer: 'Only paid participants',
    previousWinners: [],
    referral: { rewardPerSignup: 10, baseUrl: 'https://feedants.com/r/' },
  });
  await comp.save();
  compId = comp._id.toString();

  const user = new User({ name: 'Demo User', referralCode: 'referral123', avatarUrl: 'assets/profile.jpg', language: 'en' });
  await user.save();
  userId = user._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Registration API', () => {
  beforeEach(async () => {
    await Registration.deleteMany({});
    await Competition.findByIdAndUpdate(compId, { bookedCount: 0, capacity: 20 });
  });

  it('should register a user successfully', async () => {
    const res = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-1');

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending_payment');
    expect(res.body.competitionId).toBe(compId);
    expect(res.body.userId).toBe(userId);
  });

  it('should return same registration for same idempotency key (double-tap safe)', async () => {
    const res1 = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-idem');

    const res2 = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-idem');

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);
    expect(res1.body._id).toBe(res2.body._id);

    // Verify only 1 spot was booked
    const comp = await Competition.findById(compId);
    expect(comp!.bookedCount).toBe(1);
  });

  it('should return 409 ALREADY_REGISTERED if already registered with different key', async () => {
    await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-first');

    const res = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-second');

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('ALREADY_REGISTERED');
  });

  it('should return 409 FULL when capacity reached', async () => {
    await Competition.findByIdAndUpdate(compId, { capacity: 1, bookedCount: 1 });

    const res = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-full');

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('FULL');
  });

  it('should return 409 CLOSED when registration deadline has passed', async () => {
    await Competition.findByIdAndUpdate(compId, {
      'dates.registrationClosesAt': new Date(Date.now() - 1000),
    });

    const res = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-closed');

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('CLOSED');

    // Restore
    await Competition.findByIdAndUpdate(compId, {
      'dates.registrationClosesAt': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  });

  it('should increment bookedCount atomically on success', async () => {
    const res = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'test-key-count');

    expect(res.status).toBe(201);

    const comp = await Competition.findById(compId);
    expect(comp!.bookedCount).toBe(1);
  });
});

describe('GET /api/competitions/:slug', () => {
  beforeEach(async () => {
    await Registration.deleteMany({});
    await Competition.findByIdAndUpdate(compId, { bookedCount: 1, capacity: 20 });
  });

  it('should return competition with open status for new user', async () => {
    const res = await request(app)
      .get('/api/competitions/feedants-classical-dance')
      .set('X-Demo-User-Id', userId);

    expect(res.status).toBe(200);
    expect(res.body.competition.title).toBe('Feedants Classical Dance');
    expect(res.body.me.registrationStatus).toBe('open');
    expect(res.body.spotsLeft).toBe(19);
    expect(res.body.serverTime).toBeDefined();
  });

  it('should return 404 for unknown slug', async () => {
    const res = await request(app)
      .get('/api/competitions/unknown-slug')
      .set('X-Demo-User-Id', userId);

    expect(res.status).toBe(404);
  });

  it('should release the spot on failed payment and allow a retry', async () => {
    await Registration.deleteMany({});
    const before = (await Competition.findById(compId))!.bookedCount;
    const first = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'retry-key-1');
    expect(first.status).toBe(201);

    const failed = await request(app)
      .post(`/api/registrations/${first.body._id}/confirm-payment`)
      .set('X-Demo-User-Id', userId)
      .send({ success: false });
    expect(failed.body.status).toBe('cancelled');
    expect((await Competition.findById(compId))!.bookedCount).toBe(before);

    const retry = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'retry-key-2');
    expect(retry.status).toBe(201);
    expect(retry.body.status).toBe('pending_payment');

    const paid = await request(app)
      .post(`/api/registrations/${retry.body._id}/confirm-payment`)
      .set('X-Demo-User-Id', userId)
      .send({ success: true, paymentId: 'pay_TEST' });
    expect(paid.body.status).toBe('confirmed');
    expect(paid.body.paymentId).toBe('pay_TEST');
    expect((await Competition.findById(compId))!.bookedCount).toBe(before + 1);
  });

  it("should not let another user confirm someone else's registration", async () => {
    await Registration.deleteMany({});
    const reg = await request(app)
      .post(`/api/competitions/${compId}/registrations`)
      .set('X-Demo-User-Id', userId)
      .set('Idempotency-Key', 'owner-key-1');

    const res = await request(app)
      .post(`/api/registrations/${reg.body._id}/confirm-payment`)
      .set('X-Demo-User-Id', new mongoose.Types.ObjectId().toString())
      .send({ success: true });
    expect(res.status).toBe(404);
    expect((await Registration.findById(reg.body._id))!.status).toBe('pending_payment');
  });

  it('should return 400 for a malformed registration id', async () => {
    const res = await request(app)
      .post('/api/registrations/not-an-id/confirm-payment')
      .set('X-Demo-User-Id', userId)
      .send({ success: true });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_ID');
  });

  it('should reject a malformed user id header', async () => {
    const res = await request(app)
      .get('/api/competitions/feedants-classical-dance')
      .set('X-Demo-User-Id', 'bogus');
    expect(res.status).toBe(401);
  });
});
