import { Schema, model, Document, Types } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: Types.ObjectId;
  collegeName: string;
  course: string;
  yearOfStudy: string;
  bio: string;
  avatar?: string;
  lifestylePreferences: {
    sleep: 'Early Bird' | 'Night Owl' | 'Flexible';
    cleanliness: 'Neat Freak' | 'Moderate' | 'Relaxed';
    food: 'Veg Only' | 'Non-Veg Allowed' | 'Vegan';
    noise: 'Quiet Study' | 'Music Friendly' | 'No preference';
    guests: 'No Guests' | 'Weekends Only' | 'Anytime';
  };
  savedProperties: Types.ObjectId[];
}

const StudentProfileSchema = new Schema<IStudentProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  avatar: { type: String, default: '' },
  collegeName: { type: String, required: true, default: 'Symbiosis Pune' },
  course: { type: String, default: '' },
  yearOfStudy: { type: String, default: '1st Year' },
  bio: { type: String, default: '' },
  lifestylePreferences: {
    sleep: { type: String, enum: ['Early Bird', 'Night Owl', 'Flexible'], default: 'Flexible' },
    cleanliness: { type: String, enum: ['Neat Freak', 'Moderate', 'Relaxed'], default: 'Moderate' },
    food: { type: String, enum: ['Veg Only', 'Non-Veg Allowed', 'Vegan'], default: 'Non-Veg Allowed' },
    noise: { type: String, enum: ['Quiet Study', 'Music Friendly', 'No preference'], default: 'No preference' },
    guests: { type: String, enum: ['No Guests', 'Weekends Only', 'Anytime'], default: 'Weekends Only' }
  },
  savedProperties: [{ type: Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

export const StudentProfile = model<IStudentProfile>('StudentProfile', StudentProfileSchema);
