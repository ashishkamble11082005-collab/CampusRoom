import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Landlord' | 'Admin';
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, phoneNumber?: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  requestOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmailToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  apiFetch: (path: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000/api/v1/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current session context
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshSession();
      } catch (err) {
        // No active refresh token cookie, guest state
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Helper: Request token refresh
  const refreshSession = async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include' // Crucial to send httpOnly refreshToken cookies
    });

    if (!response.ok) {
      throw new Error('Refresh session expired');
    }

    const data = await response.json();
    setAccessToken(data.accessToken);

    // Fetch user details with the new access token
    const userRes = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.accessToken}`
      }
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      setUser(userData.user);
    }

    return data.accessToken;
  };

  // Custom fetch client wrapping logic
  const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    // 1. Setup headers
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    
    // 2. Attach Bearer token if we have one
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const fetchConfig: RequestInit = {
      ...options,
      headers,
      credentials: 'include'
    };

    let response = await fetch(`${API_BASE_URL}${path}`, fetchConfig);

    // 3. Intercept 401 Unauthorized (expired access token)
    if (response.status === 401 && path !== '/refresh' && path !== '/login') {
      try {
        // Attempt silent refresh
        const newAccessToken = await refreshSession();
        
        // Retry the original request with the new access token
        headers.set('Authorization', `Bearer ${newAccessToken}`);
        response = await fetch(`${API_BASE_URL}${path}`, fetchConfig);
      } catch (refreshErr) {
        // Refresh token failed -> force logout
        setUser(null);
        setAccessToken(null);
        throw new Error('Session expired. Please log in again.');
      }
    }

    return response;
  };

  // Auth Operations
  const login = async (email: string, password: string) => {
    const res = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string, role: string, phoneNumber?: string) => {
    const res = await apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, phoneNumber })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const googleLogin = async (idToken: string) => {
    const res = await apiFetch('/google', {
      method: 'POST',
      body: JSON.stringify({ idToken })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google Auth failed');

    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const requestOTP = async (email: string) => {
    const res = await apiFetch('/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'OTP request failed');
  };

  const verifyOTP = async (email: string, code: string) => {
    const res = await apiFetch('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'OTP verification failed');

    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const forgotPassword = async (email: string) => {
    const res = await apiFetch('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Forgot password request failed');
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const res = await apiFetch('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password reset failed');
  };

  const verifyEmailToken = async (token: string) => {
    const res = await apiFetch(`/verify-email?token=${token}`, {
      method: 'GET'
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Email verification failed');
    
    // Refresh user state
    if (user) {
      setUser({ ...user, isEmailVerified: true });
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' });
    } finally {
      // Always clear client state even if logout network call fails
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      loading,
      login,
      register,
      googleLogin,
      requestOTP,
      verifyOTP,
      forgotPassword,
      resetPassword,
      verifyEmailToken,
      logout,
      apiFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
