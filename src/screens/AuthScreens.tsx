import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Avatar, Badge } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, ChevronRight, Moon, Sun, Shield, Mail, Lock, 
  User as UserIcon, BookOpen, GraduationCap, CreditCard, Key, AlertCircle, CheckCircle
} from 'lucide-react';

// ================= 1. SPLASH SCREEN =================
export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px',
        padding: '24px',
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-primary) 100%)',
        textAlign: 'center'
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, var(--brand-coral), #ff7b00)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(255, 56, 92, 0.25)',
          marginBottom: '20px'
        }}
        className="animate-scale-up"
      >
        <span style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit' }}>C</span>
      </div>
      <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Outfit', marginBottom: '8px' }}>
        Campus<span style={{ color: 'var(--brand-coral)' }}>Room</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', maxWidth: '280px' }}>
        Premium student housing & compatible roommates, simplified.
      </p>

      {/* Modern iOS spinner */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-coral)',
              animation: 'fadeIn 1s infinite alternate',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ================= 2. LOGIN SCREEN =================
export const LoginScreen: React.FC<{
  onLogin: (role: 'Student' | 'Landlord' | 'Admin') => void;
  onNavigateToRegister: () => void;
}> = ({ onLogin, onNavigateToRegister }) => {
  const { login, googleLogin, requestOTP, verifyOTP, forgotPassword } = useAuth();
  
  // Login Sub-modes: 'email' | 'otp_request' | 'otp_verify' | 'forgot_password'
  const [mode, setMode] = useState<'email' | 'otp_request' | 'otp_verify' | 'forgot_password'>('email');
  
  const [email, setEmail] = useState('student@university.edu');
  const [password, setPassword] = useState('password123');
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Submit password login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await login(email, password);
      // Success will update the global AuthContext, App.tsx will trigger redirect
    } catch (err: any) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP Request
  const handleOTPRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await requestOTP(email);
      setSuccess('OTP verification code has been printed to the console!');
      setMode('otp_verify');
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP verification code
  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await verifyOTP(email, otpCode);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Password reset request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await forgotPassword(email);
      setSuccess('If this email exists, a reset link was printed to the console.');
    } catch (err: any) {
      setError(err.message || 'Forgot password failed.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Mock Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate OAuth JWT idToken encoding payload
      const mockPayload = {
        email: email || 'google.student@university.edu',
        name: 'Google Student',
        sub: `google_oauth_${Date.now()}`
      };
      const dummyIdToken = `header.${btoa(JSON.stringify(mockPayload))}.signature`;
      await googleLogin(dummyIdToken);
    } catch (err: any) {
      setError(err.message || 'Google Auth login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '400px', margin: '0 auto' }} className="animate-slide-up">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Outfit', marginBottom: '8px' }}>
          {mode === 'email' && 'Welcome Back'}
          {mode === 'otp_request' && 'OTP Sign In'}
          {mode === 'otp_verify' && 'Enter Verification Code'}
          {mode === 'forgot_password' && 'Reset Password'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          {mode === 'email' && 'Sign in using credentials or phone OTP'}
          {mode === 'otp_request' && 'Enter your email to receive a 6-digit code'}
          {mode === 'otp_verify' && `Verification code sent to ${email}`}
          {mode === 'forgot_password' && 'We will send a reset link to your email'}
        </p>
      </div>

      {/* Error alert banner */}
      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 69, 58, 0.08)', color: '#ff453a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '16px', textAlign: 'left' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Success alert banner */}
      {success && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(52, 199, 89, 0.08)', color: '#34c759', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '16px', textAlign: 'left' }}>
          <CheckCircle size={16} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {/* A. EMAIL/PASSWORD LOGIN FORM */}
      {mode === 'email' && (
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <span 
              onClick={() => setMode('otp_request')}
              style={{ color: 'var(--brand-coral)', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign In with OTP
            </span>
            <span 
              onClick={() => setMode('forgot_password')} 
              style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}
            >
              Forgot password?
            </span>
          </div>

          <Button type="submit" loading={loading} fullWidth size="lg">
            Sign In
          </Button>
        </form>
      )}

      {/* B. OTP LOGIN REQUEST */}
      {mode === 'otp_request' && (
        <form onSubmit={handleOTPRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span onClick={() => setMode('email')} style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}>
              Back to Password Login
            </span>
          </div>
          <Button type="submit" loading={loading} fullWidth size="lg">
            Send OTP Code
          </Button>
        </form>
      )}

      {/* C. OTP LOGIN VERIFY CODE */}
      {mode === 'otp_verify' && (
        <form onSubmit={handleOTPVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="6-Digit Verification Code"
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="e.g. 123456"
            icon={<Key size={16} />}
            maxLength={6}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span onClick={() => setMode('otp_request')} style={{ color: 'var(--brand-coral)', fontWeight: 600, cursor: 'pointer' }}>
              Resend OTP Code
            </span>
            <span onClick={() => setMode('email')} style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}>
              Password Login
            </span>
          </div>
          <Button type="submit" loading={loading} fullWidth size="lg">
            Verify & Sign In
          </Button>
        </form>
      )}

      {/* D. FORGOT PASSWORD DISPATCH */}
      {mode === 'forgot_password' && (
        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Registered Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span onClick={() => setMode('email')} style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}>
              Back to Login
            </span>
          </div>
          <Button type="submit" loading={loading} fullWidth size="lg">
            Send Reset Link
          </Button>
        </form>
      )}

      {/* Social Logins - only visible when standard login is shown */}
      {mode === 'email' && (
        <>
          <div style={{ margin: '24px 0', position: 'relative', textAlign: 'center' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color-light)' }} />
            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-surface)', padding: '0 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              or continue with
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" fullWidth size="md" onClick={handleGoogleLogin} loading={loading}>
              <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.01-1.3 4l3 2.3c1.74-1.61 2.74-3.97 2.74-6.52z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3-2.3c-.9.59-2.02.95-3.32.95-2.54 0-4.69-1.72-5.46-4.04H1.1v2.3C3.1 21.97 7.24 24 12 24z"/>
                <path fill="#FBBC05" d="M6.54 15.7c-.2-.59-.31-1.22-.31-1.87s.1-1.28.31-1.87V9.66H1.1C.4 11.06 0 12.63 0 14.3c0 1.64.4 3.22 1.1 4.62l5.44-4.22z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.22 0 12 0 7.24 0 3.1 2.03 1.1 5.66l5.44 4.22c.77-2.32 2.92-4.04 5.46-4.04z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" fullWidth size="md" onClick={() => onLogin('Admin')}>
              Bypass Admin
            </Button>
          </div>
        </>
      )}

      <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '32px', color: 'var(--text-secondary)' }}>
        New to CampusRoom?{' '}
        <span onClick={onNavigateToRegister} style={{ color: 'var(--brand-coral)', fontWeight: 600, cursor: 'pointer' }}>
          Create Account
        </span>
      </p>
    </div>
  );
};

// ================= 3. REGISTER SCREEN =================
export const RegisterScreen: React.FC<{
  onRegister: (role: 'Student' | 'Landlord') => void;
  onNavigateToLogin: () => void;
}> = ({ onRegister, onNavigateToLogin }) => {
  const { register } = useAuth();
  
  const [role, setRole] = useState<'Student' | 'Landlord'>('Student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAgreed) return;
    setLoading(true);
    setError('');
    
    try {
      await register(name, email, password, role, college);
      onRegister(role);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '400px', margin: '0 auto' }} className="animate-slide-up">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Outfit', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Join the premium student rental community</p>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 69, 58, 0.08)', color: '#ff453a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '16px', textAlign: 'left' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Visual Role Picker cards */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            onClick={() => setRole('Student')}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              border: role === 'Student' ? '2px solid var(--brand-coral)' : '1px solid var(--border-color)',
              backgroundColor: role === 'Student' ? 'rgba(255, 56, 92, 0.04)' : 'var(--bg-surface)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <GraduationCap size={24} color={role === 'Student' ? 'var(--brand-coral)' : 'var(--text-secondary)'} style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>I am a Student</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Find rooms & roommates</span>
          </div>

          <div
            onClick={() => setRole('Landlord')}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              border: role === 'Landlord' ? '2px solid var(--brand-coral)' : '1px solid var(--border-color)',
              backgroundColor: role === 'Landlord' ? 'rgba(255, 56, 92, 0.04)' : 'var(--bg-surface)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <UserIcon size={24} color={role === 'Landlord' ? 'var(--brand-coral)' : 'var(--text-secondary)'} style={{ marginBottom: '8px' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600 }}>I am an Owner</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>List hostels / PGs / flats</span>
          </div>
        </div>

        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          icon={<UserIcon size={16} />}
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yourname@domain.com"
          icon={<Mail size={16} />}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={16} />}
          required
        />

        {role === 'Student' && (
          <Input
            label="College/University Name"
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="e.g. Symbiosis Pune"
            icon={<BookOpen size={16} />}
            required
          />
        )}

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }}>
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            style={{ marginTop: '2px', accentColor: 'var(--brand-coral)' }}
          />
          <span>I agree to the Terms of Service and Privacy Policy, acknowledging CampusRoom's zero brokerage terms.</span>
        </label>

        <Button type="submit" fullWidth disabled={!isAgreed} loading={loading} size="lg" style={{ marginTop: '8px' }}>
          Create Profile
        </Button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '32px', color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <span onClick={onNavigateToLogin} style={{ color: 'var(--brand-coral)', fontWeight: 600, cursor: 'pointer' }}>
          Login
        </span>
      </p>
    </div>
  );
};

// ================= 4. STUDENT PROFILE SCREEN =================
export const StudentProfileScreen: React.FC = () => {
  const { user, apiFetch } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    name: user?.name || 'Kabir Malhotra',
    college: 'Symbiosis Pune',
    course: 'B.Des (UX/UI Design)',
    year: '3rd Year',
    email: user?.email || 'kabir.des@symbiosis.edu',
    status: user?.isEmailVerified ? 'Verified Student' : 'Unverified Email',
    bio: 'Product design student. Morning worker who appreciates tidy shared spaces. Seeking a quiet flatmate in Kothrud or Viman Nagar.',
    avatar: '',
    sleep: 'Flexible',
    cleanliness: 'Moderate',
    food: 'Non-Veg Allowed',
    noise: 'No preference',
    guests: 'Weekends Only'
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/student/profile');
      if (res.ok) {
        const data = await res.json();
        const p = data.profile;
        if (p) {
          setStudentInfo({
            name: p.userId?.name || user?.name || 'Student User',
            college: p.collegeName || 'Symbiosis Pune',
            course: p.course || '',
            year: p.yearOfStudy || '1st Year',
            email: p.userId?.email || user?.email || '',
            status: user?.isEmailVerified ? 'Verified Student' : 'Unverified Email',
            bio: p.bio || '',
            avatar: p.avatar || '',
            sleep: p.lifestylePreferences?.sleep || 'Flexible',
            cleanliness: p.lifestylePreferences?.cleanliness || 'Moderate',
            food: p.lifestylePreferences?.food || 'Non-Veg Allowed',
            noise: p.lifestylePreferences?.noise || 'No preference',
            guests: p.lifestylePreferences?.guests || 'Weekends Only'
          });
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentInfo(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/student/profile', {
        method: 'PUT',
        body: JSON.stringify({
          collegeName: studentInfo.college,
          course: studentInfo.course,
          yearOfStudy: studentInfo.year,
          bio: studentInfo.bio,
          avatar: studentInfo.avatar,
          lifestylePreferences: {
            sleep: studentInfo.sleep,
            cleanliness: studentInfo.cleanliness,
            food: studentInfo.food,
            noise: studentInfo.noise,
            guests: studentInfo.guests
          }
        })
      });
      if (res.ok) {
        setIsEditing(false);
        loadProfile();
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const formSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color-light)',
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'left'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }} className="animate-fade-in">
      {/* Profile Header Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-secondary) 100%)',
          border: '1px solid var(--border-color-light)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Clickable avatar area */}
        <div 
          onClick={() => isEditing && fileInputRef.current?.click()} 
          style={{ 
            position: 'relative', 
            cursor: isEditing ? 'pointer' : 'default',
            borderRadius: '50%'
          }}
        >
          <Avatar src={studentInfo.avatar} name={studentInfo.name} size="xl" />
          {isEditing && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 600
              }}
            >
              Upload
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handlePhotoChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

        <h3 style={{ fontSize: '20px', fontWeight: 700, marginTop: '12px' }}>{studentInfo.name}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 8px' }}>
          {studentInfo.college} • {studentInfo.course}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Badge variant={user?.isEmailVerified ? 'success' : 'warning'}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={12} fill={user?.isEmailVerified ? '#34c759' : '#ff9500'} color="#ffffff" />
              {studentInfo.status}
            </span>
          </Badge>
          <Badge variant="info">{studentInfo.year}</Badge>
        </div>
      </div>

      {/* Profile/Bio form */}
      <div style={formSectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>About & Biography</h3>
          {isEditing ? (
            <Button size="sm" onClick={handleSave} loading={loading}>Save</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <Input
              label="Biography"
              type="text"
              value={studentInfo.bio}
              onChange={(e) => setStudentInfo({ ...studentInfo, bio: e.target.value })}
            />
            <Input
              label="Course Major"
              type="text"
              value={studentInfo.course}
              onChange={(e) => setStudentInfo({ ...studentInfo, course: e.target.value })}
            />
            <Input
              label="College Name"
              type="text"
              value={studentInfo.college}
              onChange={(e) => setStudentInfo({ ...studentInfo, college: e.target.value })}
            />
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
              {studentInfo.bio || "No biography added yet. Click Edit to share something about yourself!"}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px', borderTop: '1px solid var(--border-color-light)', paddingTop: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Academic Email</span>
                <span style={{ fontWeight: 500 }}>{studentInfo.email}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lifestyle Preferences Quiz Display */}
      <div style={formSectionStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Roommate Lifestyle Preferences</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          These preferences are weighted to compute compatibility matching with other students.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Sleep Habits', key: 'sleep', val: studentInfo.sleep, opts: ['Early Bird', 'Night Owl', 'Flexible'] },
            { label: 'Cleanliness', key: 'cleanliness', val: studentInfo.cleanliness, opts: ['Neat Freak', 'Moderate', 'Relaxed'] },
            { label: 'Food Preference', key: 'food', val: studentInfo.food, opts: ['Veg Only', 'Non-Veg Allowed', 'Vegan'] },
            { label: 'Noise Levels', key: 'noise', val: studentInfo.noise, opts: ['Quiet Study', 'Music Friendly', 'No preference'] },
            { label: 'Guest Policy', key: 'guests', val: studentInfo.guests, opts: ['No Guests', 'Weekends Only', 'Anytime'] }
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color-light)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.label}</span>
              {isEditing ? (
                <select
                  value={item.val}
                  onChange={(e) => setStudentInfo({ ...studentInfo, [item.key]: e.target.value })}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {item.opts.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <Badge variant="coral">{item.val}</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ================= 5. SETTINGS SCREEN =================
export const SettingsScreen: React.FC<{
  darkMode: boolean;
  onThemeToggle: () => void;
  onLogout: () => void;
  onNavigateToProfile: () => void;
}> = ({ darkMode, onThemeToggle, onLogout, onNavigateToProfile }) => {
  const { user, logout } = useAuth();
  
  const settingGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color-light)',
    overflow: 'hidden',
    textAlign: 'left'
  };

  const rowStyle = (last = false): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: last ? 'none' : '1px solid var(--border-color-light)',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  });

  const handleLogoutClick = async () => {
    try {
      await logout();
      onLogout();
    } catch (err) {
      onLogout();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px' }} className="animate-fade-in">
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', textAlign: 'left' }}>Settings</h2>

      {/* Account Settings */}
      <div style={settingGroupStyle}>
        <div style={rowStyle()} onClick={onNavigateToProfile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={user?.name || 'Kabir Malhotra'} size="sm" />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{user?.name || 'Kabir Malhotra'}</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>View and edit profile details</p>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-secondary)" />
        </div>
      </div>

      {/* Application Settings */}
      <div style={settingGroupStyle}>
        <div style={rowStyle()} onClick={onThemeToggle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: darkMode ? '#ff9500' : '#0071e3', color: '#fff' }}>
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Dark Mode</span>
          </div>
          {/* iOS Toggle Switch */}
          <div
            style={{
              width: '46px',
              height: '26px',
              borderRadius: '20px',
              backgroundColor: darkMode ? '#34c759' : '#d2d2d7',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: darkMode ? '22px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>

        <div style={rowStyle()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#34c759', color: '#fff' }}>
              <Shield size={15} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Verified Badge (KYC)</span>
          </div>
          <Badge variant={user?.isEmailVerified ? 'success' : 'warning'}>
            {user?.isEmailVerified ? 'Verified' : 'Pending'}
          </Badge>
        </div>

        <div style={rowStyle(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5856d6', color: '#fff' }}>
              <CreditCard size={15} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Rent Transactions</span>
          </div>
          <ChevronRight size={16} color="var(--text-secondary)" />
        </div>
      </div>

      {/* Support & Legal */}
      <div style={settingGroupStyle}>
        <div style={rowStyle()}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Terms of Service</span>
          <ChevronRight size={16} color="var(--text-secondary)" />
        </div>
        <div style={rowStyle(true)}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Privacy Policy</span>
          <ChevronRight size={16} color="var(--text-secondary)" />
        </div>
      </div>

      {/* Logout button */}
      <Button variant="danger" fullWidth size="md" icon={<LogOut size={16} />} onClick={handleLogoutClick} style={{ height: '48px', borderRadius: '16px' }}>
        Log Out
      </Button>
    </div>
  );
};
