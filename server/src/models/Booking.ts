import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  studentId: Types.ObjectId;
  studentName: string;
  propertyId: Types.ObjectId;
  propertyTitle: string;
  visitDate: Date;
  visitTimeSlot: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  studentName: { type: String, required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  propertyTitle: { type: String, required: true },
  visitDate: { type: Date, required: true },
  visitTimeSlot: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'declined'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Booking = model<IBooking>('Booking', BookingSchema);
