import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Competition } from './models/Competition';
import { User } from './models/User';
import { Registration } from './models/Registration';
import { Submission } from './models/Submission';
import { Testimonial } from './models/Testimonial';
import { config } from './config';

/**
 * Seed the database with initial data.
 * Assumes mongoose is already connected.
 */
export async function seed(): Promise<{ competitionId: string; userId: string }> {
  await Competition.deleteMany({});
  await User.deleteMany({});
  await Registration.deleteMany({});
  await Submission.deleteMany({});
  await Testimonial.deleteMany({});

  const seedPath = path.join(__dirname, '../../design/seed-competition.json');
  const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

  // The design's dates are fixed; if they're already in the past, shift them
  // forward together so registration closes in 1d 06h 28m (as in the design).
  const dates = { ...seedData.competition.dates };
  delete dates._note;
  const closesAt = new Date(dates.registrationClosesAt).getTime();
  const desiredClose = Date.now() + ((1 * 24 + 6) * 60 + 28) * 60 * 1000;
  if (closesAt < Date.now()) {
    const shift = desiredClose - closesAt;
    for (const k of Object.keys(dates)) {
      dates[k] = new Date(new Date(dates[k]).getTime() + shift).toISOString();
    }
  }

  const comp = new Competition({
    ...seedData.competition,
    dates,
    capacity: seedData.competition.capacity || 20,
    bookedCount: 1, // Seed says "1 / 20 Booked"
  });
  await comp.save();
  console.log(`Seeded competition: ${comp.title} (${comp._id})`);

  const user = new User({
    _id: new mongoose.Types.ObjectId(config.demoUserId),
    name: seedData.demoUser.name || 'Demo User',
    referralCode: seedData.demoUser.referralCode,
    avatarUrl: seedData.demoUser.avatarUrl,
    language: 'en',
  });
  await user.save();
  console.log(`Seeded demo user: ${user._id}`);

  if (Array.isArray(seedData.testimonials)) {
    // Stagger createdAt so newest-first ordering matches the seed order
    const now = Date.now();
    await Testimonial.insertMany(
      seedData.testimonials.map((t: any, i: number) => ({ ...t, createdAt: new Date(now - i * 60_000) }))
    );
  }

  return { competitionId: comp._id.toString(), userId: user._id.toString() };
}

// CLI entrypoint
if (require.main === module) {
  const MONGODB_URI = config.mongoUri;
  mongoose.connect(MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');
    const result = await seed();
    console.log('Seed complete:', result);
    await mongoose.disconnect();
  }).catch(console.error);
}
