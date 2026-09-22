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
  
  // Set dates to future/past properly
  const now = new Date();
  comp.dates.registrationClosesAt = new Date(now.getTime() + 86400000 * 5); // 5 days from now
  comp.dates.submissionStartsAt = new Date(now.getTime() + 86400000 * 1);
  comp.dates.submissionEndsAt = new Date(now.getTime() + 86400000 * 10);
  comp.bookedCount = 1;
  comp.capacity = 20;
  await comp.save();
  
  await Registration.deleteMany({ userId: user._id });
  await Submission.deleteMany({ userId: user._id });
  
  console.log('State set: OPEN');
  process.exit(0);
}

if (require.main === module) {
  run().catch(console.error);
}
