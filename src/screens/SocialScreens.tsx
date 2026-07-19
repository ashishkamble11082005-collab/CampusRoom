import React, { useState, useEffect } from 'react';
import type { 
  RoommateProfile, MarketplaceItem, 
  SystemNotification, PropertyReview 
} from '../mockData';
import { initialRoommates, initialMarketplace, initialNotifications, initialReviews } from '../mockData';
import { Button, Avatar, StarRating, Input } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { 
  Send, Heart, X, Bell, Trash2, PenTool, Flame
} from 'lucide-react';

// ================= 1. ROOMMATE FINDER SCREEN =================
export const RoommateFinderScreen: React.FC<{
  onStartChat: (name: string, role: 'Student') => void;
}> = ({ onStartChat }) => {
  const [profiles] = useState<RoommateProfile[]>(initialRoommates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [showMatchAlert, setShowMatchAlert] = useState(false);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (dir: 'left' | 'right') => {
    setSwipeDir(dir);
    setTimeout(() => {
      if (dir === 'right') {
        setShowMatchAlert(true);
      } else {
        nextCard();
      }
    }, 300);
  };

  const nextCard = () => {
    setSwipeDir(null);
    setShowMatchAlert(false);
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  if (!currentProfile) return null;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', alignItems: 'center' }} className="animate-fade-in">
      <div style={{ width: '100%', textAlign: 'left' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>Roommate Finder</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Swipe right to match and connect with students</p>
      </div>

      {showMatchAlert ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color-light)',
            borderRadius: '20px',
            padding: '40px 20px',
            flex: 1,
            width: '100%',
            maxWidth: '360px',
            boxShadow: 'var(--shadow-medium)',
            textAlign: 'center'
          }}
          className="animate-scale-up"
        >
          <div style={{ fontSize: '50px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--brand-coral)', fontFamily: 'Outfit' }}>It's a Match!</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px', maxWidth: '240px' }}>
            You and {currentProfile.name} share compatible lifestyle preferences.
          </p>
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <Button variant="outline" fullWidth onClick={nextCard}>Keep Swiping</Button>
            <Button fullWidth onClick={() => {
              onStartChat(currentProfile.name, 'Student');
              nextCard();
            }}>Say Hello</Button>
          </div>
        </div>
      ) : (
        /* Roommate Profile Card Container */
        <div
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '360px',
            position: 'relative',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color-light)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-medium)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            transform: swipeDir === 'left' ? 'translateX(-200px) rotate(-10deg)' : swipeDir === 'right' ? 'translateX(200px) rotate(10deg)' : 'none',
            opacity: swipeDir ? 0 : 1,
            textAlign: 'left'
          }}
        >
          {/* Card Image Overlay */}
          <div style={{ height: '220px', position: 'relative', background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-coral))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '72px', fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>
              {currentProfile.name.split(' ').map(x=>x[0]).join('')}
            </span>
            {/* Match Score Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(52, 199, 89, 0.95)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <Flame size={12} fill="#fff" />
              <span>{currentProfile.matchScore}% Match</span>
            </div>
          </div>

          {/* Profile description details */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{currentProfile.name}, {currentProfile.age}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{currentProfile.college}</p>
            </div>
            
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              "{currentProfile.bio}"
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color-light)' }} />

            {/* Lifestyle traits list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Sleep schedule', val: currentProfile.lifestyle.sleep },
                { label: 'Cleanliness', val: currentProfile.lifestyle.cleanliness },
                { label: 'Food Habits', val: currentProfile.lifestyle.food },
                { label: 'Study focus', val: currentProfile.lifestyle.noise }
              ].map((t) => (
                <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions panel */}
          <div style={{ display: 'flex', padding: '16px 20px 24px', gap: '20px', justifyContent: 'center', borderTop: '1px solid var(--border-color-light)' }}>
            <button
              onClick={() => handleSwipe('left')}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 69, 58, 0.1)',
                color: '#ff453a',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'scale 0.15s ease'
              }}
              onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.1)'}
              onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}
            >
              <X size={22} />
            </button>
            <button
              onClick={() => handleSwipe('right')}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                color: '#34c759',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'scale 0.15s ease'
              }}
              onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.1)'}
              onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}
            >
              <Heart size={22} fill="#34c759" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= 2. CHAT SCREEN =================
export const ChatScreen: React.FC<{
  initialChatTargetId?: string;
  initialChatTargetName?: string;
  initialChatTargetRole?: 'Student' | 'Landlord';
}> = ({ initialChatTargetId }) => {
  const { apiFetch, user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load chat rooms from backend
  const loadRooms = async (selectRoomId?: string) => {
    try {
      setLoadingRooms(true);
      const res = await apiFetch('/chats/rooms');
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms);
        if (data.rooms.length > 0 && !activeRoomId && !selectRoomId) {
          setActiveRoomId(data.rooms[0]._id);
        } else if (selectRoomId) {
          setActiveRoomId(selectRoomId);
        }
      }
    } catch (err) {
      console.error('Failed to load chat rooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Load messages for active room
  const loadMessages = async (silent = false) => {
    if (!activeRoomId) return;
    try {
      if (!silent) setLoadingMessages(true);
      const res = await apiFetch(`/chats/rooms/${activeRoomId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // 1. Initial Load
  useEffect(() => {
    const initializeChat = async () => {
      if (initialChatTargetId) {
        // Create or get room with landlord/roommate
        try {
          const res = await apiFetch('/chats/rooms', {
            method: 'POST',
            body: JSON.stringify({ targetUserId: initialChatTargetId })
          });
          if (res.ok) {
            const data = await res.json();
            await loadRooms(data.room._id);
          } else {
            await loadRooms();
          }
        } catch (err) {
          console.error('Failed to initialize conversation room:', err);
          await loadRooms();
        }
      } else {
        await loadRooms();
      }
    };
    initializeChat();
  }, [initialChatTargetId]);

  // 2. Load messages whenever active room changes
  useEffect(() => {
    loadMessages();
  }, [activeRoomId]);

  // 3. Set up polling to simulate live web sockets (refresh messages list every 3s)
  useEffect(() => {
    if (!activeRoomId) return;
    const interval = setInterval(() => {
      loadMessages(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeRoomId]);

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeRoomId) return;

    const tempText = inputMessage;
    setInputMessage('');

    try {
      const res = await apiFetch(`/chats/rooms/${activeRoomId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text: tempText })
      });
      if (res.ok) {
        // Reload messages immediately
        loadMessages(true);
        // Refresh conversations list to update lastMessage timestamp
        loadRooms(activeRoomId);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const getRecipientName = (room: any) => {
    if (!user) return 'Chat Participant';
    const recipient = room.participants.find((p: any) => p._id !== user.id);
    return recipient ? recipient.name : 'Unknown User';
  };

  const getRecipientRole = (room: any) => {
    if (!user) return 'User';
    const recipient = room.participants.find((p: any) => p._id !== user.id);
    return recipient ? recipient.role : 'User';
  };

  const activeRoom = rooms.find((r) => r._id === activeRoomId);

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: 'var(--bg-surface)' }} className="animate-fade-in">
      {/* Chats channels sidebar list */}
      <div style={{ width: '80px', borderRight: '1px solid var(--border-color-light)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', paddingTop: '16px', overflowY: 'auto' }}>
        {loadingRooms ? (
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Loading...</span>
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => setActiveRoomId(room._id)}
              style={{
                border: 'none',
                background: 'transparent',
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '50%',
                padding: '2px',
                borderWidth: activeRoomId === room._id ? '2px' : '0px',
                borderColor: 'var(--brand-coral)',
                flexShrink: 0
              }}
            >
              <Avatar name={getRecipientName(room)} size="md" />
            </button>
          ))
        ) : (
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '0 8px', textAlign: 'center' }}>No chats</span>
        )}
      </div>

      {/* Main chat messaging layout */}
      {activeRoom ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color-light)', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
            <Avatar name={getRecipientName(activeRoom)} size="sm" />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{getRecipientName(activeRoom)}</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{getRecipientRole(activeRoom)}</span>
            </div>
          </div>

          {/* Messages list scroll window */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loadingMessages ? (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Loading messages...</p>
            ) : messages.length > 0 ? (
              messages.map((m) => {
                const isMe = user ? m.senderId === user.id : false;
                const timeString = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={m._id}
                    style={{
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        backgroundColor: isMe ? 'var(--brand-blue)' : 'var(--bg-primary)',
                        color: isMe ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '13.5px',
                        lineHeight: '1.4',
                        textAlign: 'left'
                      }}
                    >
                      {m.text}
                    </div>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '4px' }}>{timeString}</span>
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', margin: 'auto' }}>
                Say hello! Start your conversation.
              </p>
            )}
          </div>

          {/* Message input */}
          <form onSubmit={handleSend} style={{ display: 'flex', padding: '12px', gap: '8px', borderTop: '1px solid var(--border-color-light)' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '13px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            />
            <Button type="submit" variant="secondary" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <p>No active conversations.</p>
        </div>
      )}
    </div>
  );
};

// ================= 3. REVIEWS & RATING MANAGEMENT SCREEN =================
export const ReviewsScreen: React.FC = () => {
  const [reviews, setReviews] = useState<PropertyReview[]>(initialReviews);
  const studentName = 'Ananya Sen';
  const [text, setText] = useState('');
  const rating = 5;
  const [cleanliness, setCleanliness] = useState(5);
  const [safety, setSafety] = useState(5);
  const [landlord, setLandlord] = useState(5);
  const [value, setValue] = useState(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newRev: PropertyReview = {
      id: `rev_${Date.now()}`,
      studentName,
      rating,
      text,
      date: 'Today',
      categories: { cleanliness, safety, landlord, value }
    };

    setReviews([newRev, ...reviews]);
    setText('');
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }} className="animate-fade-in">
      <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>Reviews & Feedback</h2>

      {/* Review Aggregation Breakdown info card */}
      <div style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color-light)', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Student Ratings Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Cleanliness', val: 4.8 },
            { label: 'Safety & Security', val: 4.9 },
            { label: 'Landlord Cooperation', val: 4.5 },
            { label: 'Value for Money', val: 4.6 }
          ].map((cat) => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', width: '130px', color: 'var(--text-secondary)' }}>{cat.label}</span>
              {/* Progress bar */}
              <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'var(--border-color-light)', overflow: 'hidden' }}>
                <div style={{ width: `${(cat.val / 5) * 100}%`, height: '100%', backgroundColor: 'var(--brand-coral)' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{cat.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review Form */}
      <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color-light)', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, display: 'flex', gap: '6px', alignItems: 'center' }}>
          <PenTool size={16} /> Write a Verified Review
        </h3>
        
        {/* Category Ratings Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Cleanliness', val: cleanliness, set: setCleanliness },
            { label: 'Safety', val: safety, set: setSafety },
            { label: 'Landlord', val: landlord, set: setLandlord },
            { label: 'Value', val: value, set: setValue }
          ].map((cat) => (
            <div key={cat.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>{cat.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.val}★</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={5} 
                value={cat.val} 
                onChange={(e) => cat.set(Number(e.target.value))} 
                style={{ accentColor: 'var(--brand-coral)', height: '4px' }} 
              />
            </div>
          ))}
        </div>

        <Input
          label="Review Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your living experience, amenities condition, food, etc."
          required
        />

        <Button type="submit" size="sm">Submit Review</Button>
      </form>

      {/* Reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ padding: '16px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color-light)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar name={r.studentName} size="sm" />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{r.studentName}</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{r.date}</span>
                </div>
              </div>
              <StarRating rating={r.rating} />
            </div>
            <p style={{ fontSize: '12.5px', lineHeight: '1.4', color: 'var(--text-secondary)' }}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= 4. NOTIFICATIONS SCREEN =================
export const NotificationsScreen: React.FC = () => {
  const [notifs, setNotifs] = useState<SystemNotification[]>(initialNotifications);

  const handleClear = (id: string) => {
    setNotifs(notifs.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>Notifications</h2>
        {notifs.some(n=>n.unread) && (
          <span onClick={markAllRead} style={{ fontSize: '12px', color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}>
            Mark all read
          </span>
        )}
      </div>

      {notifs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifs.map((n) => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: n.unread ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)',
                border: '1px solid var(--border-color-light)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: n.type === 'match' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(0, 113, 227, 0.1)',
                  color: n.type === 'match' ? '#34c759' : '#0071e3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bell size={16} />
              </div>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{n.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>{n.time}</span>
              </div>
              <button
                onClick={() => handleClear(n.id)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 16px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color-light)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>You have no notifications.</p>
        </div>
      )}
    </div>
  );
};

// ================= 5. STUDENT MARKETPLACE =================
export const MarketplaceScreen: React.FC = () => {
  const [items] = useState<MarketplaceItem[]>(initialMarketplace);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Furniture' | 'Electronics' | 'Books'>('All');

  const filteredItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit' }}>Campus Marketplace</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Buy and sell study furniture, books, and home electronics directly from students.</p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
        {(['All', 'Furniture', 'Electronics', 'Books'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
              backgroundColor: activeCategory === cat ? 'var(--brand-coral)' : 'var(--bg-surface)',
              color: activeCategory === cat ? '#ffffff' : 'var(--text-primary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color-light)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <img src={item.image} alt={item.title} style={{ height: '110px', width: '100%', objectFit: 'cover' }} />
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h4 style={{ fontSize: '12.5px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</h4>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{item.college.split(' ')[0]}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-coral)', marginTop: '2px' }}>₹{item.price}</span>
                <Button size="sm" variant="outline" style={{ fontSize: '10px', padding: '4px 0', marginTop: '6px' }}>
                  Contact Seller
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '48px 16px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color-light)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No marketplace items available in this category.</p>
        </div>
      )}
    </div>
  );
};
