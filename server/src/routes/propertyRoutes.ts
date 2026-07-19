import { Router, Request, Response } from 'express';
import { Property } from '../models/Property';
import { Booking } from '../models/Booking';
import { Review } from '../models/Review';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// ================= SEED LISTINGS DATA =================
router.post('/seed', async (req: Request, res: Response) => {
  try {
    // Clear properties to ensure fresh seeding with all new fields
    await Property.deleteMany({});

    const mockSeed = [
      {
        ownerId: '60d5ec4b868e8215881e1a5b',
        ownerName: 'Ramesh Shah',
        ownerPhone: '+919876543210',
        title: 'Premium Boys PG near Symbiosis',
        description: 'Single and double sharing rooms with high-speed Wi-Fi, laundry service, and 3 hot meals daily. Walking distance from Symbiosis Viman Nagar campus.',
        price: 18500,
        deposit: 37000,
        walkingTimeText: '5 mins walk',
        rules: ['No smoking', 'No loud music after 10 PM', 'Gate closes at 10:30 PM'],
        tour360Url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80',
        collegeName: 'Symbiosis Pune',
        distanceText: '0.4 km',
        location: { type: 'Point', coordinates: [73.9168, 18.5631] },
        type: 'PG',
        sharing: 'Single',
        gender: 'Boys only',
        amenities: ['Wi-Fi', 'Food Included', 'AC', 'Laundry', 'Gym'],
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'],
        isVerified: true,
        averageRating: 4.8,
        reviewsCount: 12
      },
      {
        ownerId: '60d5ec4b868e8215881e1a5b',
        ownerName: 'Shalini Deshmukh',
        ownerPhone: '+919876543211',
        title: 'Co-ed Shared Student Apartment',
        description: 'Fully furnished 3 BHK flat. One master bedroom available with private balcony. Friendly roommates from FLAME and Symbiosis.',
        price: 12000,
        deposit: 24000,
        walkingTimeText: '15 mins walk',
        rules: ['Pre-payment before 5th of each month', 'Keep room clean', 'No loud music after 11 PM'],
        tour360Url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
        collegeName: 'Symbiosis Pune',
        distanceText: '1.2 km',
        location: { type: 'Point', coordinates: [73.9112, 18.5678] },
        type: 'Flat',
        sharing: 'Double',
        gender: 'Co-ed',
        amenities: ['Wi-Fi', 'Kitchen', 'Washing Machine', 'Parking'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'],
        isVerified: true,
        averageRating: 4.5,
        reviewsCount: 8
      },
      {
        ownerId: '60d5ec4b868e8215881e1a5c',
        ownerName: 'Amit Verma',
        ownerPhone: '+919876543212',
        title: 'Girls Luxury Hostel (Viman Nagar)',
        description: 'High-security hostel for female students. Includes biometrics entry, CCTV, standard power backups, and daily housekeeping.',
        price: 22000,
        deposit: 44000,
        walkingTimeText: '3 mins walk',
        rules: ['No opposite gender guests overnight', 'No smoking', 'Pets not allowed', 'Gate closes at 10 PM'],
        tour360Url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80',
        collegeName: 'Symbiosis Pune',
        distanceText: '0.2 km',
        location: { type: 'Point', coordinates: [73.9185, 18.5615] },
        type: 'Hostel',
        sharing: 'Single',
        gender: 'Girls only',
        amenities: ['Wi-Fi', 'Food Included', 'AC', 'Power Backup', 'Security'],
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'],
        isVerified: true,
        averageRating: 4.9,
        reviewsCount: 24
      },
      {
        ownerId: '60d5ec4b868e8215881e1a5c',
        ownerName: 'Rohan Mehra',
        ownerPhone: '+919876543213',
        title: 'Affordable Double Sharing Room',
        description: 'Clean room inside a quiet residential society. Best for budget-conscious students. 10 minutes auto ride from main colleges.',
        price: 8500,
        deposit: 17000,
        walkingTimeText: '25 mins walk',
        rules: ['No loud music', 'Keep common areas clean', 'Inquire before inviting guests'],
        tour360Url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
        collegeName: 'Symbiosis Pune',
        distanceText: '2.5 km',
        location: { type: 'Point', coordinates: [73.8999, 18.5555] },
        type: 'Room',
        sharing: 'Double',
        gender: 'Boys only',
        amenities: ['Wi-Fi', 'Laundry', 'Parking'],
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'],
        isVerified: false,
        averageRating: 4.0,
        reviewsCount: 3
      }
    ];

    const result = await Property.insertMany(mockSeed);
    return res.status(201).json({ success: true, message: 'Properties seeded successfully', result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET PROPERTIES WITH FILTERS =================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { college, maxPrice, type, sharing, gender, amenities, query } = req.query;

    const filterQuery: any = {};

    // 1. Filter by College Name (using text index search or regex)
    if (college) {
      filterQuery.collegeName = new RegExp(college as string, 'i');
    }

    // 2. Filter by Price ceiling
    if (maxPrice) {
      filterQuery.price = { $lte: Number(maxPrice) };
    }

    // 3. Filter by Property type
    if (type && type !== 'All') {
      filterQuery.type = type;
    }

    // 4. Filter by Sharing type
    if (sharing && sharing !== 'All') {
      filterQuery.sharing = sharing;
    }

    // 5. Filter by Gender restrictions
    if (gender && gender !== 'All') {
      filterQuery.gender = gender;
    }

    // 6. Filter by multiple amenities ($all)
    if (amenities) {
      const amenitiesList = (amenities as string).split(',');
      filterQuery.amenities = { $all: amenitiesList };
    }

    // 7. General search term text search
    if (query) {
      filterQuery.$or = [
        { title: new RegExp(query as string, 'i') },
        { description: new RegExp(query as string, 'i') }
      ];
    }

    const properties = await Property.find(filterQuery).sort({ averageRating: -1 });
    return res.status(200).json({ success: true, count: properties.length, properties });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET SINGLE PROPERTY DETAILS =================
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }
    return res.status(200).json({ success: true, property });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= BOOK VISIT SLOT =================
router.post('/:id/book', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { visitDate, visitTimeSlot } = req.body;
    if (!visitDate || !visitTimeSlot) {
      return res.status(400).json({ success: false, message: 'Visit date and time slot are required' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    const newBooking = new Booking({
      studentId: req.user?.id,
      studentName: req.user?.name || 'Student Account',
      propertyId: property._id,
      propertyTitle: property.title,
      visitDate: new Date(visitDate),
      visitTimeSlot,
      status: 'pending'
    });

    await newBooking.save();
    return res.status(201).json({ success: true, message: 'Visit booked successfully!', booking: newBooking });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= SUBMIT REVIEW & RATING =================
router.post('/:id/reviews', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, cleanliness, safety, landlord, value, text } = req.body;

    if (!rating || !text) {
      return res.status(400).json({ success: false, message: 'Rating and review comment are required' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    const newReview = new Review({
      propertyId: property._id,
      studentId: req.user?.id,
      studentName: req.user?.name || 'Anonymous Student',
      rating: Number(rating),
      categories: {
        cleanliness: Number(cleanliness || rating),
        safety: Number(safety || rating),
        landlord: Number(landlord || rating),
        value: Number(value || rating)
      },
      text
    });

    await newReview.save();
    return res.status(201).json({ success: true, message: 'Review posted successfully!', review: newReview });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET PROPERTY REVIEWS =================
router.get('/:id/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ================= GET SECURED MAPS KEY =================
router.get('/maps-key', protect, async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      key: process.env.GOOGLE_MAPS_API_KEY || ''
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
