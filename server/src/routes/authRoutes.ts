import { Router, Response } from 'express';
import { 
  register, login, refreshToken, googleLogin, 
  requestOTP, verifyOTP, forgotPassword, 
  resetPassword, verifyEmail, logout 
} from '../controllers/authController';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';

const router = Router();

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/google', googleLogin);
router.post('/otp/request', requestOTP);
router.post('/otp/verify', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/logout', logout);

// Protected Routes Example (User Profile Context Check)
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userDoc = await User.findById(req.user?.id);
    return res.status(200).json({
      success: true,
      user: {
        id: userDoc?._id,
        name: userDoc?.name,
        email: userDoc?.email,
        role: userDoc?.role,
        isEmailVerified: userDoc?.isEmailVerified,
        kycStatus: userDoc?.kycStatus,
        isBlueVerified: userDoc?.isBlueVerified || false
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
