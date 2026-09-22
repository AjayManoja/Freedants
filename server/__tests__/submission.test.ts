import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { Competition } from '../src/models/Competition';
import { User } from '../src/models/User';
import { Registration } from '../src/models/Registration';
import { Submission } from '../src/models/Submission';

let mongoServer: MongoMemoryServer;
let compId: string;
let userId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const comp = new Competition({
    slug: 'submission-test',
    title: 'Submission Test',
    tags: [],
    perks: [],
    currency: 'INR',
    prizePool: 1000,
    entryFee: 99,
    capacity: 20,
    bookedCount: 1,
    judge: { name: 'Judge', title: 'Judge', experience: '10 yrs', avatarUrl: '', introVideoUrl: null },
    dates: {
      registrationClosesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      submissionStartsAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),  // started yesterday
      submissionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),    // 30 days from now
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

  const user = new User({ name: 'Submitter', referralCode: 'submitter1', language: 'en' });
  await user.save();
  userId = user._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Submission API', () => {
  beforeEach(async () => {
    await Submission.deleteMany({});
    await Registration.deleteMany({});
    // Reset dates to within window
    await Competition.findByIdAndUpdate(compId, {
      'dates.submissionStartsAt': new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      'dates.submissionEndsAt': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  });

  it('should return 403 if user is not registered', async () => {
    const res = await request(app)
      .post(`/api/competitions/${compId}/submissions`)
      .set('X-Demo-User-Id', userId)
      .attach('file', Buffer.from('fake video'), 'dance.mp4');

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('NOT_REGISTERED');
  });

  it('should return 409 if outside submission window', async () => {
    // Create a confirmed registration
    const reg = new Registration({
      competitionId: compId,
      userId,
      status: 'confirmed',
      paymentId: 'mock',
    });
    await reg.save();

    // Set window to the past
    await Competition.findByIdAndUpdate(compId, {
      'dates.submissionStartsAt': new Date(Date.now() - 48 * 60 * 60 * 1000),
      'dates.submissionEndsAt': new Date(Date.now() - 24 * 60 * 60 * 1000),
    });

    const res = await request(app)
      .post(`/api/competitions/${compId}/submissions`)
      .set('X-Demo-User-Id', userId)
      .attach('file', Buffer.from('fake video'), 'dance.mp4');

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('OUTSIDE_SUBMISSION_WINDOW');
  });

  it('should submit successfully when registered and in window', async () => {
    const reg = new Registration({
      competitionId: compId,
      userId,
      status: 'confirmed',
      paymentId: 'mock',
    });
    await reg.save();

    const res = await request(app)
      .post(`/api/competitions/${compId}/submissions`)
      .set('X-Demo-User-Id', userId)
      .attach('file', Buffer.from('fake video'), 'dance.mp4');

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('submitted');
    expect(res.body.competitionId).toBe(compId);
  });

  it('should return submission via GET /submissions/me', async () => {
    const reg = new Registration({
      competitionId: compId,
      userId,
      status: 'confirmed',
      paymentId: 'mock',
    });
    await reg.save();

    await request(app)
      .post(`/api/competitions/${compId}/submissions`)
      .set('X-Demo-User-Id', userId)
      .attach('file', Buffer.from('fake video'), 'dance.mp4');

    const res = await request(app)
      .get(`/api/competitions/${compId}/submissions/me`)
      .set('X-Demo-User-Id', userId);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('submitted');
    expect(res.body.fileName).toBe('dance.mp4');
  });

  it('should reject a request without a file', async () => {
    const res = await request(app)
      .post(`/api/competitions/${compId}/submissions`)
      .set('X-Demo-User-Id', userId);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('FILE_REQUIRED');
  });

  it('should reject unsupported video formats', async () => {
    await new Registration({ competitionId: compId, userId, status: 'confirmed', paymentId: 'mock' }).save();

    const res = await request(app)
      .post(`/api/competitions/${compId}/submissions`)
      .set('X-Demo-User-Id', userId)
      .attach('file', Buffer.from('fake video'), { filename: 'dance.avi', contentType: 'video/x-msvideo' });

    expect(res.status).toBe(415);
    expect(res.body.error).toBe('UNSUPPORTED_FORMAT');
  });
});

describe('Submission playback', () => {
  it('streams the video to its owner only, with Range support', async () => {
    await Submission.deleteMany({});
    await Registration.deleteMany({});
    await new Registration({ competitionId: compId, userId, status: 'confirmed', paymentId: 'mock' }).save();
    await request(app)
      .post(`/api/competitions/${compId}/submissions`)
      .set('X-Demo-User-Id', userId)
      .attach('file', Buffer.from('0123456789'), { filename: 'dance.mp4', contentType: 'video/mp4' });

    const meta = await request(app).get(`/api/competitions/${compId}/submissions/me`).set('X-Demo-User-Id', userId);
    expect(meta.body.playbackPath).toBe(`/competitions/${compId}/submissions/me/file`);

    const full = await request(app).get(`/api/competitions/${compId}/submissions/me/file`).set('X-Demo-User-Id', userId);
    expect(full.status).toBe(200);
    expect(full.headers['content-type']).toContain('video/mp4');

    const partial = await request(app)
      .get(`/api/competitions/${compId}/submissions/me/file`)
      .set('X-Demo-User-Id', userId)
      .set('Range', 'bytes=0-3');
    expect(partial.status).toBe(206);

    const other = await request(app)
      .get(`/api/competitions/${compId}/submissions/me/file`)
      .set('X-Demo-User-Id', new mongoose.Types.ObjectId().toString());
    expect(other.status).toBe(404);
  });
});

describe('Localized content', () => {
  it('returns Hindi fields for ?lang=hi and falls back to English for the rest', async () => {
    await Competition.findByIdAndUpdate(compId, {
      translations: { hi: { about: ['हिंदी विवरण'], judge: { name: 'मंजू दुबे' } } },
    });
    const comp = await Competition.findById(compId);

    const hi = await request(app).get(`/api/competitions/${comp!.slug}?lang=hi`).set('X-Demo-User-Id', userId);
    expect(hi.body.lang).toBe('hi');
    expect(hi.body.competition.about).toEqual(['हिंदी विवरण']);
    expect(hi.body.competition.judge.name).toBe('मंजू दुबे');
    expect(hi.body.competition.judge.title).toBe(comp!.judge.title); // not translated → English
    expect(hi.body.competition.translations).toBeUndefined();

    const en = await request(app).get(`/api/competitions/${comp!.slug}`).set('X-Demo-User-Id', userId);
    expect(en.body.competition.about).toEqual(comp!.about);
  });
});

describe('GET /api/testimonials', () => {
  it('returns published testimonials newest first', async () => {
    const { Testimonial } = await import('../src/models/Testimonial');
    await Testimonial.deleteMany({});
    await Testimonial.insertMany([
      { name: 'Old', rating: 4, text: 'older', createdAt: new Date(Date.now() - 60_000) },
      { name: 'New', rating: 5, text: 'newer' },
      { name: 'Hidden', rating: 5, text: 'draft', published: false },
    ]);

    const res = await request(app).get('/api/testimonials?limit=5');

    expect(res.status).toBe(200);
    expect(res.body.items.map((t: any) => t.name)).toEqual(['New', 'Old']);

    await Testimonial.updateOne({ name: 'New' }, { translations: { hi: { text: 'नया' } } });
    const hi = await request(app).get('/api/testimonials?limit=5&lang=hi');
    expect(hi.body.items[0].text).toBe('नया');
  });
});
