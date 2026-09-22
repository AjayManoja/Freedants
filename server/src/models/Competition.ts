import { Schema, model, Document } from 'mongoose';

export interface ICompetition extends Document {
  slug: string;
  title: string;
  tags: string[];
  perks: string[];
  currency: string;
  prizePool: number;
  entryFee: number;
  capacity: number;
  bookedCount: number;
  judge: {
    name: string;
    title: string;
    experience: string;
    avatarUrl: string;
    introVideoUrl: string | null;
  };
  dates: {
    registrationClosesAt: Date;
    submissionStartsAt: Date;
    submissionEndsAt: Date;
    resultAt: Date;
  };
  about: string[];
  judgingParameters: string[];
  rules: string[];
  rewards: Array<{
    position: number;
    label: string;
    amount: number;
    icon: string;
  }>;
  disclaimer: string;
  previousWinners: Array<{
    name: string;
    position: string;
    thumbUrl: string;
    videoUrl: string | null;
  }>;
  referral: {
    rewardPerSignup: number;
    baseUrl: string;
  };
  prizeInfoVideoUrl: string | null;
  submissionRules: {
    maxSizeMb: number;
    acceptedFormats: string[];
  };
  /** Per-language overrides, e.g. { hi: { about: [...], judge: { name } } } */
  translations?: Record<string, any>;
}

const competitionSchema = new Schema<ICompetition>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tags: [String],
  perks: [String],
  currency: { type: String, required: true },
  prizePool: { type: Number, required: true },
  entryFee: { type: Number, required: true },
  capacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 },
  judge: {
    name: String,
    title: String,
    experience: String,
    avatarUrl: String,
    introVideoUrl: String,
  },
  dates: {
    registrationClosesAt: Date,
    submissionStartsAt: Date,
    submissionEndsAt: Date,
    resultAt: Date,
  },
  about: [String],
  judgingParameters: [String],
  rules: [String],
  rewards: [
    {
      position: Number,
      label: String,
      amount: Number,
      icon: String,
    },
  ],
  disclaimer: String,
  previousWinners: [
    {
      name: String,
      position: String,
      thumbUrl: String,
      videoUrl: String,
    },
  ],
  referral: {
    rewardPerSignup: Number,
    baseUrl: String,
  },
  prizeInfoVideoUrl: String,
  submissionRules: {
    maxSizeMb: { type: Number, default: 50 },
    acceptedFormats: { type: [String], default: ['mp4', 'mov'] },
  },
  translations: { type: Schema.Types.Mixed, default: {} },
});

export const Competition = model<ICompetition>('Competition', competitionSchema);
