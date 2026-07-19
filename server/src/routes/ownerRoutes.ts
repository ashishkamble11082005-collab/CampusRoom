import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Booking } from '../models/Booking';
import { ChatRoom } from '../models/Chat';
import { StudentProfile } from '../models/StudentProfile';

const router = Router();

// ================= KYC VERIFICATION =================
router.post('/verify-kyc', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { aadhaarNumber, panNumber } = req.body;

    const aadhaarRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;

    if (!aadhaarNumber || !aadhaarRegex.test(aadhaarNumber)) {
      return res.status(400).json({ success: false, message: 'Invalid Aadhaar format. Must be 12 numeric digits.' });
    }

    if (!panNumber || !panRegex.test(panNumber)) {
      return res.status(400).json({ success: false, message: 'Invalid PAN format. Must be 10 characters alphanumeric (e.g. ABCDE1234F).' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        kycStatus: 'approved',
        aadhaarNumber,
        panNumber,
        isBlueVerified: true
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'KYC Verification approved! You are now Blue Verified.',
      user: {
        id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        role: updatedUser?.role,
        kycStatus: updatedUser?.kycStatus,
        isBlueVerified: updatedUser?.isBlueVerified
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET OWNER LISTINGS =================
router.get('/properties', protect, async (req: AuthRequest, res: Response) => {
  try {
    const properties = await Property.find({ ownerId: req.user?.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= ADD NEW LISTING =================
router.post('/properties', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, description, price, collegeName, distanceText, 
      type, sharing, gender, amenities, images, videoUrl 
    } = req.body;

    if (req.user?.role !== 'Landlord' && req.user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Landlord credentials required.' });
    }

    const userDoc = await User.findById(req.user.id);
    const newProperty = new Property({
      ownerId: req.user.id,
      ownerName: req.user.name || 'Owner',
      ownerPhone: userDoc?.phoneNumber || '+91 99999 88888',
      title,
      description,
      price,
      collegeName,
      distanceText: distanceText || '0.5 km',
      location: {
        type: 'Point',
        coordinates: [73.8567, 18.5204]
      },
      type,
      sharing,
      gender,
      amenities: amenities || [],
      images: images || [],
      videoUrl: videoUrl || '',
      isVerified: false
    });

    await newProperty.save();

    return res.status(201).json({ success: true, message: 'Property created successfully! Pending admin approval.', property: newProperty });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= UPDATE LISTING =================
router.put('/properties/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, description, price, collegeName, distanceText, 
      type, sharing, gender, amenities, images, videoUrl 
    } = req.body;

    const property = await Property.findOne({ _id: id, ownerId: req.user?.id });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found or unauthorized' });
    }

    const updated = await Property.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        collegeName,
        distanceText,
        type,
        sharing,
        gender,
        amenities,
        images,
        videoUrl
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Listing updated successfully!', property: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= DELETE LISTING =================
router.delete('/properties/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const property = await Property.findOne({ _id: id, ownerId: req.user?.id });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found or unauthorized' });
    }

    await Property.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Property listing deleted successfully!' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= OWNER DASHBOARD ANALYTICS =================
router.get('/analytics', protect, async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.id;

    const properties = await Property.find({ ownerId });
    const propertyIds = properties.map(p => p._id);

    const totalListings = properties.length;
    const verifiedListings = properties.filter(p => p.isVerified).length;
    const totalCalls = properties.reduce((sum, p) => sum + (p.callsCount || 0), 0);

    const bookmarksCount = await StudentProfile.countDocuments({
      savedProperties: { $in: propertyIds }
    });

    const visitRequests = await Booking.find({
      propertyId: { $in: propertyIds }
    }).sort({ createdAt: -1 });

    const chatsCount = await ChatRoom.countDocuments({
      participants: ownerId
    });

    return res.status(200).json({
      success: true,
      analytics: {
        totalListings,
        verifiedListings,
        bookmarksCount,
        callsCount: totalCalls,
        chatsCount,
        visitRequests
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
