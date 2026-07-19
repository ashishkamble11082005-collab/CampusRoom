import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'Student' | 'Landlord' | 'Admin'>;
  fallbackScreen?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  fallbackScreen 
}) => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--brand-coral)] border-t-transparent" />
        <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Loading session...</p>
      </div>
    );
  }

  // 1. Unauthenticated -> Redirect to Login (or execute fallback screen navigation)
  if (!user) {
    if (fallbackScreen) {
      // Direct jump back to login page
      setTimeout(fallbackScreen, 0);
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="var(--brand-coral)" />
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '16px' }}>Authentication Required</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '20px' }}>
          Please log in to your account to view this page.
        </p>
      </div>
    );
  }

  // 2. Role not authorized -> Display Access Denied
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="var(--accent-amber)" />
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginTop: '16px' }}>Access Denied</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px', maxWidth: '240px' }}>
          Your account role ({user.role}) does not have permission to view this panel.
        </p>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          Log Out / Change Role
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
