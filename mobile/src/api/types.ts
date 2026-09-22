export interface Judge {
  name: string;
  title: string;
  experience: string;
  avatarUrl: string;
  introVideoUrl: string | null;
}

export interface CompetitionDates {
  registrationClosesAt: string;
  submissionStartsAt: string;
  submissionEndsAt: string;
  resultAt: string;
}

export interface Reward {
  position: number;
  label: string;
  amount: number;
  icon: string;
}

export interface PreviousWinner {
  name: string;
  position: string;
  thumbUrl: string;
  videoUrl: string | null;
}

export interface SubmissionRules {
  maxSizeMb: number;
  acceptedFormats: string[];
}

export interface Testimonial {
  _id: string;
  name: string;
  meta?: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Referral {
  rewardPerSignup: number;
  baseUrl: string;
}

export interface Competition {
  _id: string;
  slug: string;
  title: string;
  tags: string[];
  perks: string[];
  currency: string;
  prizePool: number;
  entryFee: number;
  capacity: number;
  bookedCount: number;
  judge: Judge;
  dates: CompetitionDates;
  about: string[];
  judgingParameters: string[];
  rules: string[];
  rewards: Reward[];
  disclaimer: string;
  previousWinners: PreviousWinner[];
  referral: Referral;
  prizeInfoVideoUrl?: string | null;
  submissionRules?: SubmissionRules;
}

export type RegistrationStatus = 'open' | 'full' | 'closed' | 'registered' | 'submitted' | 'pending';

export interface MeBlock {
  registrationStatus: RegistrationStatus;
  submissionStatus: string | null;
  referralUrl: string | null;
  registrationId?: string | null;
  paymentId?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
}

export interface CompetitionResponse {
  competition: Competition;
  me: MeBlock;
  spotsLeft: number;
  serverTime: string;
}

export interface Registration {
  _id: string;
  competitionId: string;
  userId: string;
  status: string;
  paymentId?: string;
  createdAt: string;
}

export interface Submission {
  _id: string;
  competitionId: string;
  userId: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  /** API path that streams the video to its owner */
  playbackPath?: string;
  status: string;
  submittedAt: string;
}
