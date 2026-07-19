import { Schema, model, Document, Types } from 'mongoose';

export interface IProperty extends Document {
  ownerId: Types.ObjectId;
  ownerName: string;
  ownerPhone: string;
  title: string;
  description?: string;
  price: number;
  collegeName: string;
  distanceText: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  type: 'PG' | 'Hostel' | 'Flat' | 'Room';
  sharing: 'Single' | 'Double' | 'Triple' | 'All';
  gender: 'Boys only' | 'Girls only' | 'Co-ed';
  amenities: string[];
  images: string[];
  videoUrl?: string;
  tour360Url?: string;
  deposit: number;
  walkingTimeText: string;
  rules: string[];
  callsCount: number;
  isVerified: boolean;
  averageRating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, index: true },
  collegeName: { type: String, required: true, index: true },
  distanceText: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  type: { type: String, required: true, enum: ['PG', 'Hostel', 'Flat', 'Room'] },
  sharing: { type: String, required: true, enum: ['Single', 'Double', 'Triple', 'All'] },
  gender: { type: String, required: true, enum: ['Boys only', 'Girls only', 'Co-ed'] },
  amenities: [{ type: String }],
  images: [{ type: String }],
  videoUrl: { type: String, default: '' },
  tour360Url: { type: String, default: '' },
  deposit: { type: Number, default: 0 },
  walkingTimeText: { type: String, default: '' },
  rules: [{ type: String }],
  callsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false, index: true },
  averageRating: { type: Number, default: 0.0 },
  reviewsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Geospatial index for radial distance calculations
PropertySchema.index({ location: '2dsphere' });

// Compound index for search feeds sorted by price
PropertySchema.index({ collegeName: 1, price: 1 });

export const Property = model<IProperty>('Property', PropertySchema);
