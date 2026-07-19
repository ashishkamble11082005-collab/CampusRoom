import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  propertyId: Types.ObjectId;
  studentId: Types.ObjectId;
  studentName: string;
  rating: number;
  categories: {
    cleanliness: number;
    safety: number;
    landlord: number;
    value: number;
  };
  text: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  categories: {
    cleanliness: { type: Number, required: true, min: 1, max: 5 },
    safety: { type: Number, required: true, min: 1, max: 5 },
    landlord: { type: Number, required: true, min: 1, max: 5 },
    value: { type: Number, required: true, min: 1, max: 5 }
  },
  text: { type: String, required: true, trim: true }
}, { timestamps: true });

// Post-save middleware to update averageRating and reviewsCount on the Property document automatically
ReviewSchema.post<IReview>('save', async function () {
  const review = this;
  const PropertyModel = mongoose.model('Property');

  try {
    const stats = await mongoose.model('Review').aggregate([
      { $match: { propertyId: review.propertyId } },
      {
        $group: {
          _id: '$propertyId',
          reviewsCount: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    if (stats.length > 0) {
      await PropertyModel.findByIdAndUpdate(review.propertyId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        reviewsCount: stats[0].reviewsCount
      });
    }
  } catch (error) {
    console.error('❌ Failed to update Property rating aggregates on Review post-save:', error);
  }
});

export const Review = model<IReview>('Review', ReviewSchema);
