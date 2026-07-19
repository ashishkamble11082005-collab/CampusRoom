import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'Student' | 'Landlord' | 'Admin';
  };
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your_super_secret_jwt_access_token_key_here_12345';

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Extract from Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Fallback to cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token required. Access Denied.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
      id: string;
      name: string;
      email: string;
      role: 'Student' | 'Landlord' | 'Admin';
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token. Access Denied.' });
  }
};

// Role authorization checker middleware
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role (${req.user?.role || 'Guest'}) is not authorized to access this resource` 
      });
    }
    next();
  };
};
