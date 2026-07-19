import { useState, useEffect } from 'react';
import type { Property } from '../mockData';
import { initialColleges } from '../mockData';
import { PropertyCard, Button, StarRating, Badge, Avatar, Input } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { 
  Search as SearchIcon, SlidersHorizontal, ArrowLeft, Share2, 
  Heart, CheckCircle, Compass, X, MessageSquare
} from 'lucide-react';

// Shared Filter state type
export interface FilterState {
  college: string;
  maxPrice: number;
  type: string;
  sharing: string;
  gender: string;
  amenities: string[];
}

const defaultFilters: FilterState = {
  college: 'Symbiosis Pune',
  maxPrice: 20000,
  type: 'All',
  sharing: 'All',
  gender: 'All',
  amenities: []
};

// ================= 1. HOME SCREEN =================
export const HomeScreen: React.FC<{
  properties: Property[];
  onSelectProperty: (p: Property) => void;
  onNavigateToSearch: (searchQuery: string) => void;
  onNavigateToFavorites: () => void;
}> = ({ properties, onSelectProperty, onNavigateToSearch, onNavigateToFavorites }) => {
  const [searchVal, setSearchVal] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('Symbiosis Pune');

  const filteredFeatured = properties.filter(
    (p) => p.college === selectedCollege || selectedCollege === 'All'
  );

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Apple-style Welcome Header */}
      <div style={{ textAlign: 'left', marginTop: '8px' }}>
        <span onClick={onNavigateToFavorites} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-coral)', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer' }}>Discover Housing</span>
        <h2 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', marginTop: '4px' }}>Find your campus home</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>Zero brokerage rentals, verified student reviews.</p>
      </div>

      {/* Premium Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '4px 8px 4px 16px',
          boxShadow: 'var(--shadow-soft)',
          gap: '12px'
        }}
      >
        <SearchIcon size={18} color="var(--text-secondary)" />
        <input
          type="text"
          placeholder="Search near Symbiosis, IIT Delhi..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            color: 'var(--text-primary)',
            padding: '12px 0'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigateToSearch(searchVal || 'Symbiosis Pune');
          }}
        />
        <Button size="sm" onClick={() => onNavigateToSearch(searchVal || 'Symbiosis Pune')}>
          Search
        </Button>
      </div>

      {/* College hubs pills */}
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Popular Campus Hubs</h3>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
          {initialColleges.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCollege(c);
                setSearchVal(c);
              }}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: '20px',
                border: selectedCollege === c ? 'none' : '1px solid var(--border-color)',
                backgroundColor: selectedCollege === c ? 'var(--brand-coral)' : 'var(--bg-surface)',
                color: selectedCollege === c ? '#ffffff' : 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {c.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Properties Grid */}
      <div style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Featured Accommodations</h3>
          <span 
            onClick={() => onNavigateToSearch(selectedCollege)}
            style={{ fontSize: '13px', color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}
          >
            See All ({filteredFeatured.length})
          </span>
        </div>

        {filteredFeatured.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filteredFeatured.slice(0, 4).map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                title={p.title}
                location={p.location}
                price={p.price}
                rating={p.rating}
                reviewsCount={p.reviewsCount}
                image={p.image}
                isVerified={p.isVerified}
                distance={p.distance}
                onClick={() => onSelectProperty(p)}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color-light)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No listings nearby the selected college.</p>
          </div>
        )}
      </div>

      {/* Quick Promos */}
      <div
        style={{
          display: 'flex',
          background: 'linear-gradient(135deg, var(--brand-coral) 0%, #ff7b00 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'left',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px'
        }}
      >
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Are you seeking a Flatmate?</h4>
          <p style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px', maxWidth: '220px' }}>
            Answer our lifestyle quiz and unlock matches with compatibility scores!
          </p>
        </div>
        <Button variant="outline" size="sm" style={{ background: '#ffffff', color: 'var(--brand-coral)', border: 'none' }}>
          Take Quiz
        </Button>
      </div>
    </div>
  );
};

// ================= 2. SEARCH & LISTINGS SCREEN =================
export const SearchScreen: React.FC<{
  properties: Property[];
  onSelectProperty: (p: Property) => void;
  onOpenFilter: () => void;
  filters: FilterState;
  onNavigateToMap: () => void;
}> = ({ properties, onSelectProperty, onOpenFilter, filters, onNavigateToMap }) => {
  
  // Apply active filters on mock database
  const filtered = properties.filter((p) => {
    if (filters.college && p.college !== filters.college) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.type !== 'All' && p.type !== filters.type) return false;
    if (filters.sharing !== 'All' && p.sharing !== filters.sharing) return false;
    if (filters.gender !== 'All' && p.gender !== filters.gender) return false;
    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every((a) => p.amenities.includes(a));
      if (!hasAll) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }} className="animate-fade-in">
      {/* Search Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', padding: '16px 16px 4px 16px', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Properties near campus</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {filtered.length} listings in {filters.college}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" size="sm" onClick={onOpenFilter} icon={<SlidersHorizontal size={14} />}>
            Filters
          </Button>
          <Button variant="secondary" size="sm" onClick={onNavigateToMap} icon={<Compass size={14} />}>
            Map
          </Button>
        </div>
      </div>

      {/* Render active chips */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '0 16px', flexWrap: 'nowrap', paddingBottom: '4px' }}>
        {filters.type !== 'All' && <Badge variant="info">Type: {filters.type}</Badge>}
        {filters.sharing !== 'All' && <Badge variant="info">Sharing: {filters.sharing}</Badge>}
        {filters.gender !== 'All' && <Badge variant="coral">{filters.gender}</Badge>}
        <Badge variant="default">Under ₹{filters.maxPrice.toLocaleString()}</Badge>
      </div>

      {/* Listings Grid */}
      <div style={{ flex: 1, padding: '0 16px 16px', overflowY: 'auto' }}>
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {filtered.map((p) => (
              <PropertyCard
                key={p.id}
                id={p.id}
                title={p.title}
                location={p.location}
                price={p.price}
                rating={p.rating}
                reviewsCount={p.reviewsCount}
                image={p.image}
                isVerified={p.isVerified}
                distance={p.distance}
                onClick={() => onSelectProperty(p)}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: '64px 20px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color-light)', marginTop: '20px' }}>
            <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No matches found</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>Try loosening your filters or selecting a different campus hub.</p>
            <Button size="sm" variant="outline" onClick={onOpenFilter}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= 3. FILTER DRAWERS/SCREEN =================
export const FilterDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
}> = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [college, setCollege] = useState(filters.college);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [type, setType] = useState(filters.type);
  const [sharing, setSharing] = useState(filters.sharing);
  const [gender, setGender] = useState(filters.gender);
  const [amenities, setAmenities] = useState<string[]>(filters.amenities);

  if (!isOpen) return null;

  const toggleAmenity = (a: string) => {
    if (amenities.includes(a)) {
      setAmenities(amenities.filter((item) => item !== a));
    } else {
      setAmenities([...amenities, a]);
    }
  };

  const handleApply = () => {
    onApplyFilters({ college, maxPrice, type, sharing, gender, amenities });
    onClose();
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    borderBottom: '1px solid var(--border-color-light)',
    paddingBottom: '16px',
    marginBottom: '16px'
  };

  const toggleGroup = (selected: string, options: string[], setter: (v: string) => void) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setter(o)}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 500,
            border: selected === o ? 'none' : '1px solid var(--border-color)',
            backgroundColor: selected === o ? 'var(--brand-coral)' : 'var(--bg-surface)',
            color: selected === o ? '#ffffff' : 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-surface)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-medium)',
        }}
        className="animate-slide-up"
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border-color-light)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Filters</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Fields */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', textAlign: 'left' }}>
          
          {/* Proximity College selection */}
          <div style={sectionStyle}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>University Campus</label>
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              {initialColleges.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Pricing range */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Max Monthly Rent</label>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-coral)' }}>₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={5000}
              max={30000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: 'var(--brand-coral)', width: '100%', cursor: 'pointer', margin: '10px 0' }}
            />
          </div>

          {/* Property Types */}
          <div style={sectionStyle}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Property Type</label>
            {toggleGroup(type, ['All', 'PG', 'Hostel', 'Flat', 'Room'], setType)}
          </div>

          {/* Sharing arrangements */}
          <div style={sectionStyle}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Sharing Capacity</label>
            {toggleGroup(sharing, ['All', 'Single', 'Double', 'Triple'], setSharing)}
          </div>

          {/* Gender restrictions */}
          <div style={sectionStyle}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Gender Restriction</label>
            {toggleGroup(gender, ['All', 'Boys only', 'Girls only', 'Co-ed'], setGender)}
          </div>

          {/* Amenities checks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Amenities</label>
            {['Wi-Fi', 'AC', 'Gym', 'Food Included', 'Power Backup', 'Security', 'Washing Machine'].map((amenity) => (
              <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  style={{ accentColor: 'var(--brand-coral)' }}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>

        </div>

        {/* Drawer Actions */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color-light)', display: 'flex', gap: '12px' }}>
          <Button variant="outline" fullWidth onClick={() => {
            setCollege(filters.college);
            setMaxPrice(defaultFilters.maxPrice);
            setType(defaultFilters.type);
            setSharing(defaultFilters.sharing);
            setGender(defaultFilters.gender);
            setAmenities([]);
          }}>
            Reset
          </Button>
          <Button fullWidth onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

// ================= 4. ROOM DETAILS SCREEN =================
export const RoomDetailsScreen: React.FC<{
  property: Property;
  onBack: () => void;
  onContactOwner: (p: Property) => void;
  onToggleFavorite: (id: string) => void;
  isFavorited: boolean;
}> = ({ property, onBack, onContactOwner, onToggleFavorite, isFavorited }) => {
  const { apiFetch, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(property.image || (property.images && property.images[0]));

  // Reviews states
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [safety, setSafety] = useState(5);
  const [landlord, setLandlord] = useState(5);
  const [value, setValue] = useState(5);

  // Booking states
  const [visitDate, setVisitDate] = useState('');
  const [visitTimeSlot, setVisitTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const propertyId = property._id || property.id;
      const res = await apiFetch(`/properties/${propertyId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedImage(property.image || (property.images && property.images[0]));
    loadReviews();
    setBookingSuccess('');
    setBookingError('');
  }, [property]);

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate) {
      setBookingError('Please choose a visit date.');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      const propertyId = property._id || property.id;
      const res = await apiFetch(`/properties/${propertyId}/book`, {
        method: 'POST',
        body: JSON.stringify({ visitDate, visitTimeSlot })
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess('Visit booked! The landlord will coordinate shortly.');
      } else {
        setBookingError(data.message || 'Failed to submit visit booking.');
      }
    } catch (err: any) {
      setBookingError(err.message || 'An error occurred.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      const propertyId = property._id || property.id;
      const res = await apiFetch(`/properties/${propertyId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: reviewRating,
          cleanliness,
          safety,
          landlord,
          value,
          text: reviewText
        })
      });
      if (res.ok) {
        setReviewText('');
        loadReviews();
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const handleWhatsAppRedirect = () => {
    const phone = property.ownerPhone || '+919876543210';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = `Hi ${property.ownerName}, I found your listing "${property.title}" on CampusRoom and would like to ask about availability.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color-light)',
    padding: '20px',
    borderRadius: '16px',
    textAlign: 'left',
    marginTop: '16px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }} className="animate-fade-in">
      {/* Sticky Detail Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-color-light)', backgroundColor: 'var(--bg-surface)', zIndex: 10 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)' }}><Share2 size={18} /></button>
          <button 
            onClick={() => onToggleFavorite(property._id || property.id)} 
            style={{ border: 'none', background: 'transparent' }}
          >
            <Heart size={18} fill={isFavorited ? 'var(--brand-coral)' : 'none'} color={isFavorited ? 'var(--brand-coral)' : 'var(--text-primary)'} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', textAlign: 'left' }}>
        {/* Main Photo Gallery */}
        <div style={{ width: '100%', position: 'relative' }}>
          <img src={selectedImage} alt={property.title} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
          
          {/* Thumbnails row */}
          {property.images && property.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', overflowX: 'auto', backgroundColor: 'rgba(0,0,0,0.05)' }}>
              {property.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '60px',
                    height: '40px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid var(--brand-coral)' : 'none'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content details */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Verification, Price and Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, paddingRight: '8px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                {property.isVerified && <Badge variant="success">Verified Room</Badge>}
                <Badge variant="coral">{property.gender}</Badge>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit' }}>{property.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                {property.distanceText} from {property.collegeName}
              </p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-coral)' }}>₹{property.price.toLocaleString()}</span>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>per month</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color-light)' }} />

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'var(--bg-primary)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Rating</span>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <StarRating rating={property.averageRating || property.rating} />
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'var(--bg-primary)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Room Type</span>
              <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>{property.type}</p>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'var(--bg-primary)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Sharing</span>
              <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>{property.sharing}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>About this accommodation</h4>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{property.description}</p>
          </div>

          {/* Amenities List */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Amenities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {property.amenities.map((amenity) => (
                <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <CheckCircle size={14} color="var(--accent-green)" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Landlord information card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border-color-light)',
              backgroundColor: 'var(--bg-surface-secondary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar name={property.ownerName} size="md" />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Host / Landlord</span>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{property.ownerName}</h4>
                </div>
              </div>
              <Badge variant="success">Zero Brokerage</Badge>
            </div>
            
            {/* Communication Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="primary" 
                size="sm" 
                style={{ flex: 1 }}
                onClick={() => onContactOwner(property)}
                icon={<MessageSquare size={14} />}
              >
                Chat
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                style={{ flex: 1, border: '1px solid #25d366', color: '#25d366' }}
                onClick={handleWhatsAppRedirect}
              >
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Book Visit Slots Form Container */}
          <div style={formSectionStyle}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Schedule a Physical Visit
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Choose a date and preferred time slot. The owner will meet you at the property.
            </p>

            {bookingSuccess && (
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(52, 199, 89, 0.08)', color: '#34c759', fontSize: '12px' }}>
                {bookingSuccess}
              </div>
            )}
            {bookingError && (
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 69, 58, 0.08)', color: '#ff453a', fontSize: '12px' }}>
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBookVisit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Input
                label="Visit Date"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Time Slot</span>
                <select
                  value={visitTimeSlot}
                  onChange={(e) => setVisitTimeSlot(e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                  <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="05:00 PM - 07:00 PM">Evening (05:00 PM - 07:00 PM)</option>
                </select>
              </div>
              <Button type="submit" loading={bookingLoading} fullWidth size="md">
                Schedule Visit Slot
              </Button>
            </form>
          </div>

          {/* Reviews & Ratings Feed */}
          <div style={formSectionStyle}>
            <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Reviews & Ratings</h4>
            
            {/* Average rating banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-coral)' }}>
                {property.averageRating || property.rating}
              </div>
              <div>
                <StarRating rating={property.averageRating || property.rating} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                  Based on {reviewsList.length} verified reviews
                </span>
              </div>
            </div>

            {/* List of reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {reviewsLoading ? (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading reviews...</p>
              ) : reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div key={rev._id} style={{ borderBottom: '1px solid var(--border-color-light)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{rev.studentName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        ★ {rev.rating}/5
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                      {rev.text}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>No reviews posted yet. Be the first!</p>
              )}
            </div>

            {/* Add Review Sub-Form */}
            {user && (
              <form onSubmit={handlePostReview} style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color-light)', paddingTop: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Write a Review</span>
                
                {/* Sliders breakdown */}
                {[
                  { label: 'Overall Rating', val: reviewRating, set: setReviewRating },
                  { label: 'Cleanliness', val: cleanliness, set: setCleanliness },
                  { label: 'Safety', val: safety, set: setSafety },
                  { label: 'Landlord Behavior', val: landlord, set: setLandlord },
                  { label: 'Value for Money', val: value, set: setValue }
                ].map((slider) => (
                  <div key={slider.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{slider.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={slider.val} 
                        onChange={(e) => slider.set(Number(e.target.value))}
                        style={{ width: '80px', accentColor: 'var(--brand-coral)' }}
                      />
                      <span style={{ fontSize: '11px', fontWeight: 600, width: '12px' }}>{slider.val}</span>
                    </div>
                  </div>
                ))}

                <Input
                  label="Your Comment"
                  type="text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience (safety, wifi, water access, etc.)"
                  required
                />

                <Button type="submit" size="sm" fullWidth>
                  Submit Verified Review
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// ================= 5. DYNAMIC MAP SCREEN =================
export const MapScreen: React.FC<{
  properties: Property[];
  onBack: () => void;
  onSelectProperty: (p: Property) => void;
}> = ({ properties, onBack, onSelectProperty }) => {
  const [activePin, setActivePin] = useState<Property | null>(null);

  // SVG simulated coordinate map
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} className="animate-fade-in">
      {/* Map Search Bar / Header */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-color-light)', backgroundColor: 'var(--bg-surface)' }}>
        <button onClick={onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '16px' }}>Campus Map View</span>
      </div>

      {/* SVG Vector Map Area */}
      <div style={{ flex: 1, backgroundColor: '#e4f2e6', position: 'relative', overflow: 'hidden' }}>
        {/* Custom background grids simulating roads/rivers/parks */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {/* River */}
          <path d="M-10,120 Q 200,60 500,220" fill="none" stroke="#a5c9eb" strokeWidth="24" opacity="0.6" />
          {/* Main Road */}
          <path d="M80,-20 L 80,600" fill="none" stroke="#ffffff" strokeWidth="16" opacity="0.8" />
          <path d="M-20,180 L 600,180" fill="none" stroke="#ffffff" strokeWidth="12" opacity="0.8" />
          {/* Secondary Roads */}
          <line x1="30" y1="0" x2="30" y2="600" stroke="#ffffff" strokeWidth="6" strokeDasharray="5" opacity="0.5" />
          <line x1="280" y1="0" x2="280" y2="600" stroke="#ffffff" strokeWidth="6" strokeDasharray="5" opacity="0.5" />
        </svg>

        {/* College Campus Hub Anchor Marker */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--brand-blue)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.4)'
            }}
          >
            🎓 Symbiosis Campus
          </div>
          <div style={{ width: '4px', height: '12px', backgroundColor: 'var(--brand-blue)' }} />
          {/* Range rings */}
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '2px dashed rgba(0, 113, 227, 0.25)',
              transform: 'translateY(-75px)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Map Pins */}
        {properties.map((p) => {
          const isActive = activePin?.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePin(p)}
              style={{
                position: 'absolute',
                left: `${p.coordinates?.x ?? 40}%`,
                top: `${p.coordinates?.y ?? 40}%`,
                transform: 'translate(-50%, -50%)',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: isActive ? 20 : 15,
                transition: 'scale 0.2s ease'
              }}
            >
              <div
                style={{
                  padding: '4px 8px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'var(--brand-coral)' : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  border: `1.5px solid ${isActive ? '#ffffff' : 'var(--brand-coral)'}`,
                  whiteSpace: 'nowrap'
                }}
              >
                ₹{Math.round(p.price / 1000)}k
              </div>
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `6px solid ${isActive ? 'var(--brand-coral)' : 'var(--bg-surface)'}`,
                  marginTop: '-1px'
                }}
              />
            </button>
          );
        })}

        {/* Pin Hover Overlay card */}
        {activePin && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '12px',
              display: 'flex',
              gap: '12px',
              boxShadow: 'var(--shadow-medium)',
              border: '1px solid var(--border-color-light)',
              zIndex: 30
            }}
            className="animate-slide-up"
          >
            <img src={activePin.image} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
            <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{activePin.title}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{activePin.distance} • {activePin.location}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-coral)' }}>₹{activePin.price.toLocaleString()}</span>
                <Button size="sm" onClick={() => onSelectProperty(activePin)}>Details</Button>
              </div>
            </div>
            <button onClick={() => setActivePin(null)} style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= 6. FAVORITES SCREEN =================
export const FavoritesScreen: React.FC<{
  properties: Property[];
  favoriteIds: string[];
  onSelectProperty: (p: Property) => void;
  onRemoveFavorite: (id: string) => void;
}> = ({ properties, favoriteIds, onSelectProperty, onRemoveFavorite }) => {
  
  const favoritedList = properties.filter((p) => favoriteIds.includes(p.id));

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', textAlign: 'left' }}>Favorites</h2>
      
      {favoritedList.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {favoritedList.map((p) => (
            <PropertyCard
              key={p.id}
              id={p.id}
              title={p.title}
              location={p.location}
              price={p.price}
              rating={p.rating}
              reviewsCount={p.reviewsCount}
              image={p.image}
              isVerified={p.isVerified}
              distance={p.distance}
              isFavorite={true}
              onFavoriteToggle={() => onRemoveFavorite(p.id)}
              onClick={() => onSelectProperty(p)}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 16px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color-light)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Your favorited properties will appear here.</p>
        </div>
      )}
    </div>
  );
};

// ================= 7. COMPARE ROOMS SCREEN =================
export const CompareRoomsScreen: React.FC<{
  properties: Property[];
  onSelectProperty: (p: Property) => void;
}> = ({ properties, onSelectProperty }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([properties[0]?.id, properties[1]?.id].filter(Boolean));

  const toggleCompare = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= 3) return; // Cap at 3 properties
      setSelectedIds([...selectedIds, id]);
    }
  };

  const comparedProps = properties.filter((p) => selectedIds.includes(p.id));

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>Compare Rooms</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Compare specifications side-by-side (max 3 rooms)</p>
      </div>

      {/* Select rooms strip */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
        {properties.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggleCompare(p.id)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: '8px',
                border: isSelected ? '2px solid var(--brand-coral)' : '1px solid var(--border-color)',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: isSelected ? 'rgba(255,56,92,0.05)' : 'var(--bg-surface)',
                color: isSelected ? 'var(--brand-coral)' : 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {isSelected ? '✓ ' : ''}{p.title.slice(0, 15)}...
            </button>
          );
        })}
      </div>

      {/* Comparison Table */}
      {comparedProps.length > 0 ? (
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color-light)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color-light)', backgroundColor: 'var(--bg-surface-secondary)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Spec / Room</th>
                {comparedProps.map((p) => (
                  <th key={p.id} style={{ padding: '12px', fontWeight: 700, minWidth: '120px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px' }}>{p.title}</span>
                      <Button size="sm" variant="ghost" onClick={() => onSelectProperty(p)} style={{ fontSize: '10px', padding: '2px 6px' }}>Details</Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rent Price */}
              <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Rent / Month</td>
                {comparedProps.map((p) => (
                  <td key={p.id} style={{ padding: '12px', fontWeight: 700, color: 'var(--brand-coral)' }}>₹{p.price.toLocaleString()}</td>
                ))}
              </tr>
              {/* Proximity */}
              <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Distance to Campus</td>
                {comparedProps.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>{p.distance}</td>
                ))}
              </tr>
              {/* Type */}
              <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Type</td>
                {comparedProps.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>{p.type}</td>
                ))}
              </tr>
              {/* Sharing */}
              <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Sharing</td>
                {comparedProps.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>{p.sharing}</td>
                ))}
              </tr>
              {/* Rating */}
              <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Rating</td>
                {comparedProps.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>★ {p.rating} ({p.reviewsCount})</td>
                ))}
              </tr>
              {/* Amenities */}
              <tr style={{ borderBottom: '1px solid var(--border-color-light)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Amenities</td>
                {comparedProps.map((p) => (
                  <td key={p.id} style={{ padding: '12px', fontSize: '11px' }}>
                    {p.amenities.slice(0, 3).join(', ')}
                    {p.amenities.length > 3 ? '...' : ''}
                  </td>
                ))}
              </tr>
              {/* Verification */}
              <tr>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Verification</td>
                {comparedProps.map((p) => (
                  <td key={p.id} style={{ padding: '12px' }}>
                    <Badge variant={p.isVerified ? 'success' : 'default'}>
                      {p.isVerified ? 'VERIFIED' : 'PENDING'}
                    </Badge>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: '48px 16px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color-light)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Select multiple rooms above to compare side-by-side.</p>
        </div>
      )}
    </div>
  );
};
