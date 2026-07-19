import React from 'react';
import { Star, ShieldCheck, Heart, MapPin } from 'lucide-react';

// ================= BUTTON COMPONENT =================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-98 select-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--brand-coral)] text-white hover:bg-[var(--brand-coral-hover)] shadow-sm",
    secondary: "bg-[var(--brand-blue)] text-white hover:bg-[var(--brand-blue-hover)] shadow-sm",
    outline: "border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--border-color-light)]",
    ghost: "bg-transparent text-[var(--text-primary)] hover:bg-[var(--border-color-light)]",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2 rounded-2xl"
  };

  const widthStyle = fullWidth ? "w-full flex" : "";

  // Inline styling overrides for Tailwind emulation to ensure solid styling even if CSS overrides occur
  const inlineStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    borderRadius: size === 'sm' ? '8px' : size === 'lg' ? '16px' : '12px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: variant === 'outline' ? '1px solid var(--border-color)' : 'none',
    width: fullWidth ? '100%' : 'auto',
    gap: size === 'sm' ? '6px' : '8px',
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '16px' : '14px',
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '14px 24px' : '10px 18px',
    boxShadow: (variant === 'primary' || variant === 'secondary') ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
  };

  const getThemeColors = () => {
    switch (variant) {
      case 'primary':
        return { background: 'var(--brand-coral)', color: '#ffffff' };
      case 'secondary':
        return { background: 'var(--brand-blue)', color: '#ffffff' };
      case 'outline':
        return { background: 'transparent', color: 'var(--text-primary)' };
      case 'ghost':
        return { background: 'transparent', color: 'var(--text-primary)' };
      case 'danger':
        return { background: '#ff453a', color: '#ffffff' };
      default:
        return { background: 'var(--brand-coral)', color: '#ffffff' };
    }
  };

  const activeHoverStyle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    if (variant === 'primary') target.style.background = 'var(--brand-coral-hover)';
    else if (variant === 'secondary') target.style.background = 'var(--brand-blue-hover)';
    else if (variant === 'outline' || variant === 'ghost') target.style.background = 'var(--border-color-light)';
    else if (variant === 'danger') target.style.background = '#ff3b30';
  };

  const resetStyle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const colors = getThemeColors();
    target.style.background = colors.background;
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      style={{ ...inlineStyles, ...getThemeColors() }}
      onMouseEnter={activeHoverStyle}
      onMouseLeave={resetStyle}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...props}
    >
      {loading ? (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : icon}
      {children}
    </button>
  );
};

// ================= INPUT COMPONENT =================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    textAlign: 'left'
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '12px',
    border: error 
      ? '1.5px solid #ff453a' 
      : isFocused 
        ? '1.5px solid var(--brand-blue)' 
        : '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-surface-secondary)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    padding: '0 12px',
    boxShadow: isFocused ? '0 0 0 3px rgba(0, 113, 227, 0.15)' : 'none',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 6px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '14px',
    color: 'var(--text-primary)',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={wrapperStyle}>
        {icon && <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>{icon}</span>}
        <input
          style={{ ...inputStyle, ...style }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '11px', color: '#ff453a', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};

// ================= RATING COMPONENT =================
export const StarRating: React.FC<{ rating: number; count?: number; size?: number }> = ({ rating, count, size = 16 }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Star size={size} fill="var(--accent-amber)" color="var(--accent-amber)" />
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          ({count})
        </span>
      )}
    </div>
  );
};

// ================= BADGE COMPONENT =================
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'info' | 'warning' | 'default' | 'coral' }> = ({
  children,
  variant = 'default'
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(52, 199, 89, 0.1)', color: '#34c759' };
      case 'info':
        return { bg: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' };
      case 'warning':
        return { bg: 'rgba(255, 149, 0, 0.1)', color: '#ff9500' };
      case 'coral':
        return { bg: 'rgba(255, 56, 92, 0.1)', color: 'var(--brand-coral)' };
      default:
        return { bg: 'var(--border-color-light)', color: 'var(--text-secondary)' };
    }
  };

  const colors = getColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.color,
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
      }}
    >
      {children}
    </span>
  );
};

// ================= AVATAR COMPONENT =================
export const Avatar: React.FC<{
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
}> = ({ src, name, size = 'md', online }) => {
  const dims = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  };

  const d = dims[size];

  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${d}px`,
    height: `${d}px`,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-coral))',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: size === 'sm' ? '12px' : size === 'lg' ? '18px' : size === 'xl' ? '24px' : '15px',
    boxShadow: 'var(--shadow-soft)',
    overflow: 'visible'
  };

  return (
    <div style={containerStyle}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
      {online && (
        <span
          style={{
            position: 'absolute',
            bottom: '1px',
            right: '1px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-green)',
            border: '2px solid var(--bg-surface)'
          }}
        />
      )}
    </div>
  );
};

// ================= PROPERTY CARD COMPONENT =================
interface PropertyProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isVerified: boolean;
  distance: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
}

export const PropertyCard: React.FC<PropertyProps> = ({
  title,
  location,
  price,
  rating,
  reviewsCount,
  image,
  isVerified,
  distance,
  isFavorite = false,
  onFavoriteToggle,
  onClick
}) => {
  const [isFav, setIsFav] = React.useState(isFavorite);
  const [animateFav, setAnimateFav] = React.useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    setAnimateFav(true);
    setTimeout(() => setAnimateFav(false), 300);
    if (onFavoriteToggle) onFavoriteToggle();
  };

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color-light)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative'
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        className={animateFav ? 'heart-pop' : ''}
      >
        <Heart
          size={16}
          fill={isFav ? 'var(--brand-coral)' : 'none'}
          color={isFav ? 'var(--brand-coral)' : '#555555'}
        />
      </button>

      {/* Image Wrap */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '66.6%' /* 3:2 Aspect Ratio */ }}>
        <img
          src={image}
          alt={title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {isVerified && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#34c759',
              fontSize: '11px',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <ShieldCheck size={13} fill="#34c759" color="#ffffff" />
            <span>VERIFIED</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <h4
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {title}
          </h4>
          <StarRating rating={rating} count={reviewsCount} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
          <MapPin size={12} />
          <span>{location}</span>
          <span style={{ margin: '0 2px' }}>•</span>
          <span>{distance}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand-coral)' }}>
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>/ month</span>
        </div>
      </div>
    </div>
  );
};
