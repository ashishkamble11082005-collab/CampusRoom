import { useState } from 'react';
import type { Property } from '../mockData';
import { initialColleges } from '../mockData';
import { Button, Input, Badge } from '../components/UI';
import { 
  Building, DollarSign, Plus, Edit2, 
  Trash2, Upload, ArrowLeft, ArrowRight, Check
} from 'lucide-react';

// ================= 1. OWNER DASHBOARD SCREEN =================
export const OwnerDashboardScreen: React.FC<{
  properties: Property[];
  onNavigateToAddRoom: () => void;
  onNavigateToEditRoom: (p: Property) => void;
  onDeleteRoom: (id: string) => void;
}> = ({ properties, onNavigateToAddRoom, onNavigateToEditRoom, onDeleteRoom }) => {
  
  // Calculate analytics metrics
  const totalListings = properties.length;
  const verifiedListings = properties.filter(p => p.isVerified).length;
  const projectedRevenue = properties.reduce((acc, p) => acc + p.price, 0);

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

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>Owner Control Panel</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Manage properties, occupancy rates, and student inquiries</p>
        </div>
        <Button size="sm" onClick={onNavigateToAddRoom} icon={<Plus size={14} />}>
          Add Room
        </Button>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={cardStyle}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34c759' }}>
            <Building size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Properties</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{totalListings} <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400 }}>({verifiedListings} Verified)</span></h3>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Proj. Income</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>₹{projectedRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Active properties listed by this host */}
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Active Listings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {properties.map((p) => (
            <div
              key={p.id}
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
              <img src={p.image} alt="" style={{ width: '70px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{p.title}</h4>
                  <Badge variant={p.isVerified ? 'success' : 'warning'}>
                    {p.isVerified ? 'VERIFIED' : 'PENDING'}
                  </Badge>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>₹{p.price.toLocaleString()} • {p.college.split(' ')[0]}</span>
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
                  onClick={() => onDeleteRoom(p.id)}
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
      </div>
    </div>
  );
};

// ================= 2. ADD ROOM SCREEN =================
export const AddRoomScreen: React.FC<{
  onAddRoom: (p: Omit<Property, 'id' | 'rating' | 'reviewsCount' | 'isVerified' | 'coordinates'>) => void;
  onCancel: () => void;
}> = ({ onAddRoom, onCancel }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(12000);
  const [distance, setDistance] = useState('0.5 km');
  const [college, setCollege] = useState('Symbiosis Pune');
  const [type, setType] = useState<'PG' | 'Hostel' | 'Flat' | 'Room'>('PG');
  const [sharing, setSharing] = useState<'Single' | 'Double' | 'Triple'>('Double');
  const [gender, setGender] = useState<'Boys only' | 'Girls only' | 'Co-ed'>('Boys only');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80');

  const toggleAmenity = (a: string) => {
    if (amenities.includes(a)) {
      setAmenities(amenities.filter(x => x !== a));
    } else {
      setAmenities([...amenities, a]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    onAddRoom({
      title,
      location,
      price,
      distance,
      college,
      type,
      sharing,
      gender,
      description,
      amenities,
      image: imageUrl,
      images: [imageUrl],
      ownerName: 'You (Owner)',
      ownerPhone: '+91 99999 88888'
    });
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }} className="animate-fade-in">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={onCancel} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit' }}>List Accommodation</h2>
      </div>

      {/* Step indicator bubbles */}
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
              <Input label="Transit Distance" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g. 0.8 km" required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Target University Campus</label>
              <select value={college} onChange={(e) => setCollege(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                {initialColleges.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Step 2: Room Configurations</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Property Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                  {['PG', 'Hostel', 'Flat', 'Room'].map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Sharing Capacity</label>
                <select value={sharing} onChange={(e) => setSharing(e.target.value as any)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                  {['Single', 'Double', 'Triple'].map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Gender Preference</label>
              <select value={gender} onChange={(e) => setGender(e.target.value as any)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
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
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Step 3: Descriptions & Photos</h3>
            <Input label="Listing Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write rules, proximity advantages, food timing, etc." />
            
            {/* Upload mock box */}
            <div style={{ border: '2px dashed var(--border-color)', padding: '32px 16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-primary)' }}>
              <Upload size={32} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '12px', fontWeight: 600 }}>Mock Upload Room Photo</p>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Click to pick room mock layout</span>
            </div>

            <Input label="Simulated Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
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
            <Button type="submit" variant="secondary" fullWidth>Publish Listing</Button>
          )}
        </div>
      </form>
    </div>
  );
};

// ================= 3. EDIT ROOM SCREEN =================
export const EditRoomScreen: React.FC<{
  property: Property;
  onSaveRoom: (updated: Property) => void;
  onCancel: () => void;
}> = ({ property, onSaveRoom, onCancel }) => {
  const [title, setTitle] = useState(property.title);
  const [location, setLocation] = useState(property.location);
  const [price, setPrice] = useState(property.price);
  const [description, setDescription] = useState(property.description);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    onSaveRoom({
      ...property,
      title,
      location,
      price,
      description
    });
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
        <Input label="Monthly Rent (INR)" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        <Input label="Listing Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <div style={{ display: 'flex', justifySelf: 'stretch', gap: '12px', borderTop: '1px solid var(--border-color-light)', paddingTop: '16px' }}>
          <Button type="button" variant="outline" fullWidth onClick={onCancel}>Cancel</Button>
          <Button type="submit" fullWidth>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};
