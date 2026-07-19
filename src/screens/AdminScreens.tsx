import { useState } from 'react';
import type { Property } from '../mockData';
import { Badge, Avatar } from '../components/UI';
import { 
  ShieldCheck, Users, Clock, 
  Check, X, FileText, Activity
} from 'lucide-react';

interface KycRequest {
  id: string;
  name: string;
  role: 'Student' | 'Landlord';
  documentType: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const AdminDashboardScreen: React.FC<{
  properties: Property[];
  onApproveProperty: (id: string) => void;
  onRejectProperty: (id: string) => void;
}> = ({ properties, onApproveProperty, onRejectProperty }) => {
  
  // Pending verification queue
  const pendingProperties = properties.filter((p) => !p.isVerified);
  
  // Mock KYC requests
  const [kycRequests, setKycRequests] = useState<KycRequest[]>([
    { id: 'k1', name: 'Rohan Das', role: 'Student', documentType: 'DU Identity Card', status: 'Pending' },
    { id: 'k2', name: 'Rajesh Shinde', role: 'Landlord', documentType: 'Aadhaar Card + Utility Bill', status: 'Pending' },
    { id: 'k3', name: 'Amit Roy', role: 'Student', documentType: 'IIT Delhi Admission Letter', status: 'Pending' }
  ]);

  const handleKycAction = (id: string, action: 'Approve' | 'Reject') => {
    setKycRequests(
      kycRequests.map((k) => (k.id === id ? { ...k, status: action === 'Approve' ? 'Approved' : 'Rejected' } : k))
    );
  };

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color-light)',
    borderRadius: '16px',
    textAlign: 'left'
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>System Administration</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Moderate property listings, audit logs, and approve KYC documents</p>
      </div>

      {/* Admin stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ ...cardStyle, display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 56, 92, 0.1)', color: 'var(--brand-coral)' }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Moderation Queue</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{pendingProperties.length} Properties</h3>
          </div>
        </div>

        <div style={{ ...cardStyle, display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34c759' }}>
            <Users size={20} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>KYC Approvals</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>
              {kycRequests.filter(k=>k.status === 'Pending').length} Pending
            </h3>
          </div>
        </div>
      </div>

      {/* Property Moderation Queue */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} color="var(--brand-coral)" /> Pending Listings Verification
        </h3>

        {pendingProperties.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingProperties.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-primary)',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <img src={p.image} alt="" style={{ width: '60px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{p.title}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Owner: {p.ownerName} • {p.college.split(' ')[0]}
                  </p>
                </div>
                {/* Moderation actions */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onApproveProperty(p.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--accent-green)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onRejectProperty(p.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>No properties awaiting moderation approval.</p>
        )}
      </div>

      {/* KYC Submissions verification */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileText size={16} color="var(--brand-blue)" /> Identity KYC Submissions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {kycRequests.map((k) => (
            <div
              key={k.id}
              style={{
                display: 'flex',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-primary)',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar name={k.name} size="sm" />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{k.name}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {k.role} • {k.documentType}
                  </p>
                </div>
              </div>

              {k.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleKycAction(k.id, 'Approve')}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(52, 199, 89, 0.1)',
                      color: '#34c759',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => handleKycAction(k.id, 'Reject')}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 69, 58, 0.1)',
                      color: '#ff453a',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <Badge variant={k.status === 'Approved' ? 'success' : 'default'}>{k.status}</Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Activity audit log */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} /> System Event logs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tenant kabir.des@symbiosis.edu logged in</span>
            <span>10 mins ago</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Verification request generated for Munich House</span>
            <span>22 mins ago</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Marketplace item 'Samsung Mini Fridge' published</span>
            <span>1 hr ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
