import React, { useState, useEffect, useRef } from 'react';
import type { Property } from '../mockData';
import { initialColleges } from '../mockData';
import { Button, Input, Badge } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { 
  Building, Plus, Edit2, 
  Trash2, Upload, ArrowLeft, ArrowRight, Check,
  Calendar, Phone, MessageSquare, Heart, Award, PlayCircle
} from 'lucide-react';

// ================= 1. OWNER CONTROL PANEL =================
export const OwnerDashboardScreen: React.FC<{
  onNavigateToAddRoom: () => void;
  onNavigateToEditRoom: (p: Property) => void;
}> = ({ onNavigateToAddRoom, onNavigateToEditRoom }) => {
  const { user, apiFetch } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'listings' | 'visits' | 'kyc' | 'analytics'>('listings');
  const [properties, setProperties] = useState<Property[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalListings: 0,
    verifiedListings: 0,
    bookmarksCount: 0,
    callsCount: 0,
    chatsCount: 0,
    visitRequests: []
  });
  
  // KYC verification form states
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [kycLoading, setKycLoading] = useState(false);
  const [kycSuccess, setKycSuccess] = useState('');
  const [kycError, setKycError] = useState('');

  const [loading, setLoading] = useState(false);

  // Load properties and analytics from database
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch properties
      const propRes = await apiFetch('/owner/properties');
      if (propRes.ok) {
        const propData = await propRes.json();
        setProperties(propData.properties);
      }
      
      // 2. Fetch analytics
      const analRes = await apiFetch('/owner/analytics');
      if (analRes.ok) {
        const analData = await analRes.json();
        setAnalytics(analData.analytics);
      }
    } catch (err) {
      console.error('Failed to load owner dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Handle KYC submissions
  const handleVerifyKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    setKycLoading(true);
    setKycSuccess('');
    setKycError('');
    try {
      const res = await apiFetch('/owner/verify-kyc', {
        method: 'POST',
        body: JSON.stringify({ aadhaarNumber, panNumber })
      });
      const data = await res.json();
      if (res.ok) {
        setKycSuccess('KYC Verified! A Blue Verified Badge has been issued.');
        // Refresh session to update isBlueVerified token details
        if (user) {
          const updatedUser = { ...user, isBlueVerified: true, kycStatus: 'approved' };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.location.reload(); // Quick refresh to update global context safely
        }
      } else {
        setKycError(data.message || 'Verification failed.');
      }
    } catch (err: any) {
      setKycError(err.message || 'Error occurred.');
    } finally {
      setKycLoading(false);
    }
  };

  // Delete listing
  const handleDeleteListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await apiFetch(`/owner/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete property listing:', err);
    }
  };

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color-light)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'left'
  };

  const tabButtonStyle = (tab: typeof activeTab): React.CSSProperties => ({
    flex: 1,
    padding: '10px 4px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? 'var(--brand-coral)' : 'var(--bg-surface-secondary)',
    color: activeTab === tab ? '#ffffff' : 'var(--text-secondary)',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      
      {/* Header section with Blue Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Owner Control Panel
            {user?.isBlueVerified && (
              <span title="Blue Verified Landlord" style={{ display: 'inline-flex', alignSelf: 'center', color: '#0071e3' }}>
                <Award size={20} fill="#0071e3" color="#fff" />
              </span>
            )}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Manage properties, occupancy rates, and student inquiries</p>
        </div>
        <Button size="sm" onClick={onNavigateToAddRoom} icon={<Plus size={14} />}>
          Add Room
        </Button>
      </div>

      {/* Quick Analytics Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={cardStyle}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34c759' }}>
            <Building size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Properties</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              {analytics.totalListings} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400 }}>({analytics.verifiedListings} Verified)</span>
            </h3>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 149, 0, 0.1)', color: '#ff9500' }}>
            <Heart size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Bookmarks</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{analytics.bookmarksCount} Saves</h3>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px' }}>
        <button onClick={() => setActiveTab('listings')} style={tabButtonStyle('listings')}>Listings</button>
        <button onClick={() => setActiveTab('visits')} style={tabButtonStyle('visits')}>Visits ({analytics.visitRequests?.length || 0})</button>
        <button onClick={() => setActiveTab('kyc')} style={tabButtonStyle('kyc')}>KYC Badge</button>
        <button onClick={() => setActiveTab('analytics')} style={tabButtonStyle('analytics')}>Analytics</button>
      </div>

      {/* Loading state indicator */}
      {loading && <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Syncing data...</p>}

      {/* Tab: Listings */}
      {activeTab === 'listings' && !loading && (
        <div style={{ textAlign: 'left' }} className="animate-fade-in">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Active Listings</h3>
          {properties.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {properties.map((p) => (
                <div
                  key={p._id || p.id}
                  style={{
                    display: 'flex',
                    padding: '12px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color-light)',
                    gap: '12px',
                    alignItems: 'center'
                  }}
                >
                  <img src={p.image || (p.images && p.images[0])} alt="" style={{ width: '70px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{p.title}</h4>
                      <Badge variant={p.isVerified ? 'success' : 'warning'}>
                        {p.isVerified ? 'VERIFIED' : 'PENDING'}
                      </Badge>
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>₹{p.price.toLocaleString()} • {p.collegeName || p.college}</span>
                  </div>

                  {/* CRUD controls */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onNavigateToEditRoom(p)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteListing(p._id || p.id)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,69,58,0.2)',
                        backgroundColor: 'rgba(255,69,58,0.05)',
                        cursor: 'pointer',
                        color: '#ff453a'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
              No active listings found. Click Add Room to create one!
            </p>
          )}
        </div>
      )}

      {/* Tab: Visits */}
      {activeTab === 'visits' && (
        <div style={{ textAlign: 'left' }} className="animate-fade-in">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Scheduled Student Visits</h3>
          {analytics.visitRequests && analytics.visitRequests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analytics.visitRequests.map((visit: any) => (
                <div 
                  key={visit._id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color-light)',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>Inquiry ID: #{visit._id.slice(-6)}</span>
                    <Badge variant={visit.status === 'scheduled' ? 'info' : 'success'}>
                      {visit.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} />
                    <span>{visit.visitDate} • {visit.visitTimeSlot}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>Student ID: {visit.studentId}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
              No scheduled visits yet.
            </p>
          )}
        </div>
      )}

      {/* Tab: KYC Verification */}
      {activeTab === 'kyc' && (
        <div style={{ textAlign: 'left' }} className="animate-fade-in">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Verify Aadhaar & PAN Card</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Submit your details to gain a Blue Verified Badge, which increases student response rates by 80%.
          </p>

          {user?.isBlueVerified ? (
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0, 113, 227, 0.08)', border: '1px solid rgba(0, 113, 227, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={28} fill="#0071e3" color="#fff" />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0071e3' }}>Blue Verified Landlord</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Aadhaar and PAN details have been validated by our automated KYC partner.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyKyc} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {kycSuccess && (
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(52, 199, 89, 0.08)', color: '#34c759', fontSize: '12.5px' }}>
                  {kycSuccess}
                </div>
              )}
              {kycError && (
                <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 69, 58, 0.08)', color: '#ff453a', fontSize: '12.5px' }}>
                  {kycError}
                </div>
              )}

              <Input
                label="Aadhaar Card Number (12 Digits)"
                type="text"
                placeholder="e.g. 123456789012"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={12}
                required
              />

              <Input
                label="PAN Card Number (10 Alphanumeric Characters)"
                type="text"
                placeholder="e.g. ABCDE1234F"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                maxLength={10}
                required
              />

              <Button type="submit" loading={kycLoading} fullWidth size="md">
                Verify Credentials
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Tab: Stats Analytics Details */}
      {activeTab === 'analytics' && (
        <div style={{ textAlign: 'left' }} className="animate-fade-in">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Inquiry Analytics Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color-light)', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-coral)' }}>
                <Phone size={16} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Call Clicks</span>
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{analytics.callsCount}</h4>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Direct phone inquiry clicks</p>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color-light)', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-blue)' }}>
                <MessageSquare size={16} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Chat Inquiries</span>
              </div>
              <h4 style={{ fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>{analytics.chatsCount}</h4>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Active database chat threads</p>
            </div>
          </div>

          {/* Video Tour Banner Indicator */}
          <div 
            style={{ 
              marginTop: '16px', 
              padding: '16px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--bg-surface-secondary)', 
              border: '1px solid var(--border-color-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PlayCircle size={16} color="var(--brand-coral)" />
                Video Walkthroughs
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Properties with walkthroughs receive 3x more bookings.
              </p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      )}

    </div>
  );
};

// ================= 2. ADD ROOM SCREEN =================
export const AddRoomScreen: React.FC<{
  onCancel: () => void;
}> = ({ onCancel }) => {
  const { apiFetch } = useAuth();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(12000);
  const [deposit, setDeposit] = useState(24000);
  const [distance, setDistance] = useState('0.5 km');
  const [walkingTimeText, setWalkingTimeText] = useState('6 mins walk');
  const [college, setCollege] = useState('Symbiosis Pune');
  const [type, setType] = useState<'PG' | 'Hostel' | 'Flat' | 'Room'>('PG');
  const [sharing, setSharing] = useState<'Single' | 'Double' | 'Triple'>('Double');
  const [gender, setGender] = useState<'Boys only' | 'Girls only' | 'Co-ed'>('Boys only');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>(['No smoking', 'No loud music after 10 PM']);
  
  // Media states
  const imageUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80';
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [base64Video, setBase64Video] = useState<string>('');
  const [base64Tour360, setBase64Tour360] = useState<string>('');
  
  const [loading, setLoading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const tour360InputRef = useRef<HTMLInputElement>(null);

  const toggleAmenity = (a: string) => {
    if (amenities.includes(a)) {
      setAmenities(amenities.filter(x => x !== a));
    } else {
      setAmenities([...amenities, a]);
    }
  };

  const toggleRule = (r: string) => {
    if (rules.includes(r)) {
      setRules(rules.filter(x => x !== r));
    } else {
      setRules([...rules, r]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Images((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Video(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTour360Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Tour360(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        price,
        collegeName: college,
        distanceText: distance,
        type,
        sharing,
        gender,
        amenities,
        images: base64Images.length > 0 ? base64Images : [imageUrl],
        videoUrl: base64Video,
        tour360Url: base64Tour360,
        deposit,
        walkingTimeText,
        rules
      };

      const res = await apiFetch('/owner/properties', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onCancel();
      }
    } catch (err) {
      console.error('Failed to submit listing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }} className="animate-fade-in">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={onCancel} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit' }}>List Accommodation</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '8px 0' }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: step === s ? 'var(--brand-coral)' : step > s ? 'var(--accent-green)' : 'var(--border-color-light)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px'
            }}
          >
            {step > s ? <Check size={14} /> : s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color-light)' }}>
        
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Step 1: Listing Details</h3>
            <Input label="Listing Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Stanza Living Delhi House" required />
            <Input label="Neighborhood Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kothrud, Pune" required />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="Monthly Rent (INR)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
              <Input label="Security Deposit (INR)" type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="Transit Distance" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 0.8 km" required />
              <Input label="Walking Time" value={walkingTimeText} onChange={(e) => setWalkingTimeText(e.target.value)} placeholder="e.g. 10 mins walk" required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Target University Campus</label>
              <select value={college} onChange={(e) => setCollege(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                {initialColleges.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Step 2: Configurations & Rules</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Property Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                  {['PG', 'Hostel', 'Flat', 'Room'].map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Sharing Capacity</label>
                <select value={sharing} onChange={(e) => setSharing(e.target.value as any)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                  {['Single', 'Double', 'Triple'].map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Gender Preference</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as any)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                {['Boys only', 'Girls only', 'Co-ed'].map(t=> <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Amenities Included</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['Wi-Fi', 'AC', 'Gym', 'Food Included', 'Power Backup', 'Security', 'Washing Machine'].map((a) => (
                  <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} style={{ accentColor: 'var(--brand-coral)' }} />
                    {a}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color-light)', paddingTop: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>House Rules</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                {['No smoking', 'No loud music after 10 PM', 'No opposite gender guests overnight', 'Pets not allowed', 'No alcohol allowed'].map((r) => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={rules.includes(r)} onChange={() => toggleRule(r)} style={{ accentColor: 'var(--brand-coral)' }} />
                    {r}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Step 3: Descriptions & Media Uploads</h3>
            <Input label="Listing Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write rules, food timing, etc." />
            
            {/* Base64 Images Uploader */}
            <div 
              onClick={() => imageInputRef.current?.click()}
              style={{ border: '2px dashed var(--border-color)', padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-primary)' }}
            >
              <Upload size={20} color="var(--text-secondary)" style={{ margin: '0 auto 6px' }} />
              <p style={{ fontSize: '12px', fontWeight: 600 }}>Upload Room Images</p>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>({base64Images.length} images added)</span>
            </div>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={imageInputRef} 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />

            {/* Base64 Video Uploader */}
            <div 
              onClick={() => videoInputRef.current?.click()}
              style={{ border: '2px dashed var(--border-color)', padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-primary)' }}
            >
              <PlayCircle size={20} color="var(--text-secondary)" style={{ margin: '0 auto 6px' }} />
              <p style={{ fontSize: '12px', fontWeight: 600 }}>Upload Video Walkthrough</p>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {base64Video ? 'Walkthrough Video loaded' : 'Upload short 3-second tour'}
              </span>
            </div>
            <input 
              type="file" 
              accept="video/*" 
              ref={videoInputRef} 
              onChange={handleVideoUpload} 
              style={{ display: 'none' }} 
            />

            {/* Base64 360 Panorama Uploader */}
            <div 
              onClick={() => tour360InputRef.current?.click()}
              style={{ border: '2px dashed var(--border-color)', padding: '16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-primary)' }}
            >
              <Building size={20} color="var(--text-secondary)" style={{ margin: '0 auto 6px' }} />
              <p style={{ fontSize: '12px', fontWeight: 600 }}>Upload 360° Panoramic Photo</p>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {base64Tour360 ? '360° Panoramic Tour loaded' : 'Upload landscape layout backdrop'}
              </span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={tour360InputRef} 
              onChange={handleTour360Upload} 
              style={{ display: 'none' }} 
            />
          </div>
        )}

        {/* Buttons flow controls */}
        <div style={{ display: 'flex', justifySelf: 'stretch', gap: '12px', borderTop: '1px solid var(--border-color-light)', paddingTop: '16px' }}>
          {step > 1 ? (
            <Button type="button" variant="outline" fullWidth onClick={handlePrev} icon={<ArrowLeft size={14} />}>Back</Button>
          ) : (
            <Button type="button" variant="ghost" fullWidth onClick={onCancel}>Cancel</Button>
          )}

          {step < 3 ? (
            <Button type="button" fullWidth onClick={handleNext} style={{ gap: '6px' }}>Next <ArrowRight size={14} /></Button>
          ) : (
            <Button type="submit" variant="secondary" fullWidth loading={loading}>Publish Listing</Button>
          )}
        </div>
      </form>
    </div>
  );
};

// ================= 3. EDIT ROOM SCREEN =================
export const EditRoomScreen: React.FC<{
  property: Property;
  onCancel: () => void;
}> = ({ property, onCancel }) => {
  const { apiFetch } = useAuth();
  const [title, setTitle] = useState(property.title);
  const [location, setLocation] = useState(property.location);
  const [price, setPrice] = useState(property.price);
  const [deposit, setDeposit] = useState(property.deposit || (property.price * 2));
  const [distance, setDistance] = useState(property.distanceText || property.distance);
  const [walkingTimeText, setWalkingTimeText] = useState(property.walkingTimeText || '5 mins walk');
  const [description, setDescription] = useState(property.description || '');
  const [rules, setRules] = useState<string[]>(property.rules || []);
  const [loading, setLoading] = useState(false);

  const toggleRule = (r: string) => {
    if (rules.includes(r)) {
      setRules(rules.filter(x => x !== r));
    } else {
      setRules([...rules, r]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    setLoading(true);
    try {
      const res = await apiFetch(`/owner/properties/${property._id || property.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          location,
          price,
          deposit,
          distanceText: distance,
          walkingTimeText,
          description,
          rules
        })
      });
      if (res.ok) {
        onCancel();
      }
    } catch (err) {
      console.error('Failed to update listing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }} className="animate-fade-in">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={onCancel} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit' }}>Edit Listing</h2>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color-light)' }}>
        <Input label="Listing Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Monthly Rent (INR)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          <Input label="Security Deposit (INR)" type="number" value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Transit Distance" value={distance} onChange={(e) => setDistance(e.target.value)} required />
          <Input label="Walking Time" value={walkingTimeText} onChange={(e) => setWalkingTimeText(e.target.value)} required />
        </div>

        <Input label="Listing Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color-light)', paddingTop: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>House Rules</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {['No smoking', 'No loud music after 10 PM', 'No opposite gender guests overnight', 'Pets not allowed', 'No alcohol allowed'].map((r) => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={rules.includes(r)} onChange={() => toggleRule(r)} style={{ accentColor: 'var(--brand-coral)' }} />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifySelf: 'stretch', gap: '12px', borderTop: '1px solid var(--border-color-light)', paddingTop: '16px' }}>
          <Button type="button" variant="outline" fullWidth onClick={onCancel}>Cancel</Button>
          <Button type="submit" fullWidth loading={loading}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};
