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
  comp.dates.registrationClosesAt = new Date(now.getTime() - 86400000 * 1); // 1 day ago
  await comp.save();
  
  await Registration.deleteMany({ userId: user._id });
  await Submission.deleteMany({ userId: user._id });
  
  console.log('State set: CLOSED');
  process.exit(0);
}

if (require.main === module) {
  run().catch(console.error);
}
