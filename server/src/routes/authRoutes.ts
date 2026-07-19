import { Router, Response } from 'express';
import { 
  register, login, refreshToken, googleLogin, 
  requestOTP, verifyOTP, forgotPassword, 
  resetPassword, verifyEmail, logout 
} from '../controllers/authController';
import { protect, AuthRequest } from '../middleware/authMiddleware';

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
router.get('/me', protect, (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router;
