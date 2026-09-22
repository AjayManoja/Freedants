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
  
  await Registration.findOneAndUpdate(
    { competitionId: comp._id, userId: user._id },
    { status: 'confirmed' },
    { upsert: true }
  );
  
  await Submission.findOneAndUpdate(
    { competitionId: comp._id, userId: user._id },
    { fileUrl: '/uploads/demo.mp4', status: 'submitted' },
    { upsert: true }
  );
  
  console.log('State set: SUBMITTED');
  process.exit(0);
}

if (require.main === module) {
  run().catch(console.error);
}
