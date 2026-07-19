import { Response } from 'express';
import { User, IUser } from '../models/User';
import { OTP } from '../models/OTP';
import { AuthRequest } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

// Secret Tokens
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your_super_secret_jwt_access_token_key_here_12345';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_super_secret_jwt_refresh_token_key_here_54321';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Helper to generate access tokens (15 minutes expiry)
const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

// Helper to generate refresh tokens (7 days expiry)
const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper to set refresh token in httpOnly Cookie
const sendRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS)
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};

// Helper to mock send email (prints to console for out-of-the-box local testing)
const sendMockEmail = (email: string, subject: string, content: string) => {
  console.log('\n=================== MOCK EMAIL SERVICE ===================');
  console.log(`To:      ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${content}`);
  console.log('==========================================================\n');
};

// ================= 1. STANDARD EMAIL SIGN-UP =================
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address already registered' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      name,
      email,
      passwordHash: password,
      role: role || 'Student',
      phoneNumber,
      isEmailVerified: false,
      emailVerificationToken: verificationToken
    });

    await newUser.save();

    // Send verification email mock
    const verificationLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    sendMockEmail(
      email,
      'Verify your CampusRoom Account',
      `Welcome to CampusRoom, ${name}!\n\nPlease verify your email by clicking: ${verificationLink}`
    );

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      message: 'Account created. Please check your console to verify your email.',
      accessToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 2. EMAIL / PASSWORD LOGIN =================
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 3. SILENT REFRESH ROTATION =================
export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const refreshCookie = req.cookies.refreshToken;
    if (!refreshCookie) {
      return res.status(401).json({ success: false, message: 'Refresh token not found' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshCookie, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    sendRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 4. GOOGLE SOCIAL LOGIN =================
export const googleLogin = async (req: AuthRequest, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'idToken is required' });
    }

    let email = '';
    let name = '';
    let googleId = '';

    // Verify Google ID Token
    if (googleClient) {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        return res.status(400).json({ success: false, message: 'Invalid Google token payload' });
      }
      email = payload.email;
      name = payload.name || 'Google User';
      googleId = payload.sub;
    } else {
      // Mock Google Login (fallback for local dev environment tests)
      console.log('⚠️ GOOGLE_CLIENT_ID not set. Running in Mock Google Auth mode.');
      const mockPayload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      email = mockPayload.email;
      name = mockPayload.name || 'Google User';
      googleId = mockPayload.sub || `mock_google_${email}`;
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Register new user automatically via Google
      user = new User({
        name,
        email,
        googleId,
        role: 'Student', // Defaults to Student on social signup
        isEmailVerified: true // Google accounts are pre-verified
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google Account to existing Email/Password user
      user.googleId = googleId;
      user.isEmailVerified = true;
      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 5. OTP LOGIN - REQUEST =================
export const requestOTP = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    // Generate 6 digit numeric code
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing OTPs for this email first
    await OTP.deleteMany({ email });

    // Store new OTP (automatically expires in 5 minutes via TTL index)
    const otpDoc = new OTP({ email, otp: generatedOTP });
    await otpDoc.save();

    // Print to console to bypass SMS setup fees during verification
    sendMockEmail(
      email,
      'CampusRoom Verification OTP Code',
      `Your verification code is: ${generatedOTP}\n\nIt expires in 5 minutes.`
    );

    return res.status(200).json({
      success: true,
      message: 'Verification code sent to your email.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 6. OTP LOGIN - VERIFY =================
export const verifyOTP = async (req: AuthRequest, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const otpRecord = await OTP.findOne({ email, otp: code });
    if (!otpRecord) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    // Clear verification document once code checks out
    await OTP.deleteOne({ _id: otpRecord._id });

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Create account automatically on first-time OTP verification
      user = new User({
        name: email.split('@')[0], // Set default name from email handle
        email,
        role: 'Student',
        isEmailVerified: true
      });
      await user.save();
      isNewUser = true;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: isNewUser ? 'Account registered successfully.' : 'Log in successful.',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 7. FORGOT PASSWORD =================
export const forgotPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user doesn't exist for user enumeration safety
      return res.status(200).json({ success: true, message: 'If the email exists, a password reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    await user.save();

    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    sendMockEmail(
      email,
      'CampusRoom Password Reset Link',
      `Please reset your password by clicking: ${resetLink}`
    );

    return res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 8. RESET PASSWORD =================
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password (bcrypt hashing triggers in pre-save hook)
    user.passwordHash = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ success: true, message: 'Password has been reset successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 9. VERIFY EMAIL =================
export const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email address verified successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================= 10. LOGOUT =================
export const logout = async (req: AuthRequest, res: Response) => {
  res.clearCookie('refreshToken');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};
