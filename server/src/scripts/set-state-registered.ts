import mongoose from 'mongoose';
import { Competition } from '../models/Competition';
import { Registration } from '../models/Registration';
import { Submission } from '../models/Submission';
import { User } from '../models/User';
import { config } from '../config';

async function run() {
  await mongoose.connect(config.mongoUri);
  
  const comp = await Competition.findOne();
  const user = await User.findOne();
  if (!comp || !user) throw new Error('Run seed first');
  
  const now = new Date();
  comp.dates.submissionStartsAt = new Date(now.getTime() - 86400000 * 1); // 1 day ago
  comp.dates.submissionEndsAt = new Date(now.getTime() + 86400000 * 5); // 5 days from now
  await comp.save();
  
  await Submission.deleteMany({ userId: user._id });
  await Registration.findOneAndUpdate(
    { competitionId: comp._id, userId: user._id },
    { status: 'confirmed' },
    { upsert: true }
  );
  
  console.log('State set: REGISTERED (and in submission window)');
  process.exit(0);
}

if (require.main === module) {
  run().catch(console.error);
}
