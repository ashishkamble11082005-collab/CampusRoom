import { Router, Response } from 'express';
import { StudentProfile } from '../models/StudentProfile';
import { Booking } from '../models/Booking';
import { Property } from '../models/Property';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// ================= GET STUDENT PROFILE =================
router.get('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user?.id }).populate('userId', 'name email role');
    
    if (!profile) {
      // Lazy initialization: create profile on first request
      profile = new StudentProfile({
        userId: req.user?.id,
        bio: 'Welcome to my student profile. Looking for flatmates near campus.',
        collegeName: 'Symbiosis Pune'
      });
      await profile.save();
      profile = await StudentProfile.findOne({ userId: req.user?.id }).populate('userId', 'name email role');
    }

    return res.status(200).json({ success: true, profile });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= UPDATE STUDENT PROFILE =================
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { collegeName, course, yearOfStudy, bio, avatar, lifestylePreferences } = req.body;

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { userId: req.user?.id },
      { 
        collegeName,
        course,
        yearOfStudy,
        bio,
        avatar,
        lifestylePreferences
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, message: 'Profile updated successfully!', profile: updatedProfile });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET FAVORITES =================
router.get('/favorites', protect, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user?.id }).populate({
      path: 'savedProperties',
      model: 'Property'
    });

    if (!profile) {
      return res.status(200).json({ success: true, count: 0, favorites: [] });
    }

    return res.status(200).json({ success: true, count: profile.savedProperties.length, favorites: profile.savedProperties });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= SAVE TO FAVORITES =================
router.post('/favorites/:propertyId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user?.id },
      { $addToSet: { savedProperties: property._id } }, // $addToSet avoids duplicate listings
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, message: 'Added to favorites', favoritesCount: profile.savedProperties.length });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= REMOVE FROM FAVORITES =================
router.delete('/favorites/:propertyId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user?.id },
      { $pull: { savedProperties: propertyId } },
      { new: true }
    );

    const count = profile ? profile.savedProperties.length : 0;
    return res.status(200).json({ success: true, message: 'Removed from favorites', favoritesCount: count });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET STUDENT VISIT BOOKINGS =================
router.get('/bookings', protect, async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ studentId: req.user?.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
