import { useState, useEffect } from 'react';
import './App.css';
import type { Property } from './mockData';
import { initialProperties } from './mockData';
import { Button, Badge } from './components/UI';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Component Imports
import { 
  SplashScreen, LoginScreen, RegisterScreen, 
  StudentProfileScreen, SettingsScreen 
} from './screens/AuthScreens';
import { 
  HomeScreen, SearchScreen, FilterDrawer, 
  RoomDetailsScreen, MapScreen, FavoritesScreen, CompareRoomsScreen 
} from './screens/SearchScreens';
import { 
  ChatScreen, RoommateFinderScreen, ReviewsScreen, 
  NotificationsScreen, MarketplaceScreen 
} from './screens/SocialScreens';
import { 
  OwnerDashboardScreen, AddRoomScreen, EditRoomScreen 
} from './screens/OwnerScreens';
import { AdminDashboardScreen } from './screens/AdminScreens';

// Icon Imports
import { 
  Home, Search, MessageSquare, User, Settings, 
  Sparkles, Layers, ShieldCheck, Sun, Moon, 
  ChevronRight, Laptop
} from 'lucide-react';

type Role = 'Student' | 'Landlord' | 'Admin';

function AppContent() {
  // Theme & Layout States
  const [darkMode, setDarkMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [activeRole, setActiveRole] = useState<Role>('Student');

  // React State Synced Mock Database
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['p1', 'p3']);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Navigation Parameter Pass States
  const [chatTargetId, setChatTargetId] = useState<string>('');
  const [chatTargetName, setChatTargetName] = useState<string>('');
  const [chatTargetRole, setChatTargetRole] = useState<'Student' | 'Landlord'>('Student');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    college: 'Symbiosis Pune',
    maxPrice: 20000,
    type: 'All',
    sharing: 'All',
    gender: 'All',
    amenities: [] as string[]
  });

  const { user, loading, logout, apiFetch } = useAuth();

  // 1. Fetch properties automatically from backend based on filters
  useEffect(() => {
    const fetchProperties = async () => {
      let path = `/properties?college=${encodeURIComponent(filters.college)}&maxPrice=${filters.maxPrice}`;
      if (filters.type !== 'All') path += `&type=${filters.type}`;
      if (filters.sharing !== 'All') path += `&sharing=${filters.sharing}`;
      if (filters.gender !== 'All') path += `&gender=${filters.gender}`;
      if (filters.amenities.length > 0) path += `&amenities=${filters.amenities.join(',')}`;

      try {
        const res = await fetch(`http://localhost:5000/api/v1/properties${path}`);
        if (res.ok) {
          const data = await res.json();
          // If database is empty, request auto-seeding!
          if (data.count === 0 && filters.college === 'Symbiosis Pune') {
            const seedRes = await fetch(`http://localhost:5000/api/v1/properties/seed`, { method: 'POST' });
            if (seedRes.ok) {
              const refetchRes = await fetch(`http://localhost:5000/api/v1/properties${path}`);
              const refetchData = await refetchRes.json();
              setProperties(refetchData.properties);
            }
          } else {
            setProperties(data.properties);
          }
        }
      } catch (err) {
        console.error("Failed to load listings from database:", err);
      }
    };
    fetchProperties();
  }, [filters]);

  // 2. Sync favorites with backend when user session changes
  useEffect(() => {
    const syncFavorites = async () => {
      if (user) {
        try {
          const res = await apiFetch('/student/favorites');
          if (res.ok) {
            const data = await res.json();
            setFavoriteIds(data.favorites.map((p: any) => p._id || p.id));
          }
        } catch (err) {
          console.error("Failed to sync favorites with database:", err);
        }
      } else {
        setFavoriteIds(['p1', 'p3']); // Fallback to mock defaults
      }
    };
    syncFavorites();
  }, [user]);

  // Sync role context with logged-in user profile automatically
  useEffect(() => {
    if (user) {
      setActiveRole(user.role);
      
      // Auto-route to their respective dashboard on login
      if (currentScreen === 'splash' || currentScreen === 'login' || currentScreen === 'register') {
        if (user.role === 'Student') {
          setCurrentScreen('home');
        } else if (user.role === 'Landlord') {
          setCurrentScreen('ownerDashboard');
        } else if (user.role === 'Admin') {
          setCurrentScreen('adminDashboard');
        }
      }
    } else {
      // If user logs out, return to login screen
      if (currentScreen !== 'splash' && currentScreen !== 'register') {
        setCurrentScreen('login');
      }
    }
  }, [user]);

  // Sync dark mode class
  useEffect(() => {
    const root = document.getElementById('app-container');
    if (root) {
      if (darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [darkMode]);

  // Handle splash completion
  const handleSplashComplete = () => {
    if (user) {
      if (user.role === 'Student') setCurrentScreen('home');
      else if (user.role === 'Landlord') setCurrentScreen('ownerDashboard');
      else setCurrentScreen('adminDashboard');
    } else {
      setCurrentScreen('login');
    }
  };

  // Auth logins (Mock bypass button handler)
  const handleBypassLogin = (role: Role) => {
    setActiveRole(role);
    if (role === 'Student') {
      setCurrentScreen('home');
    } else if (role === 'Landlord') {
      setCurrentScreen('ownerDashboard');
    } else if (role === 'Admin') {
      setCurrentScreen('adminDashboard');
    }
  };

  // Favorites trigger
  const handleFavoriteToggle = async (id: string) => {
    if (!user) {
      if (favoriteIds.includes(id)) {
        setFavoriteIds(favoriteIds.filter(x => x !== id));
      } else {
        setFavoriteIds([...favoriteIds, id]);
      }
      return;
    }

    const isFav = favoriteIds.includes(id);
    try {
      const res = await apiFetch(`/student/favorites/${id}`, {
        method: isFav ? 'DELETE' : 'POST'
      });
      if (res.ok) {
        if (isFav) {
          setFavoriteIds(favoriteIds.filter(x => x !== id));
        } else {
          setFavoriteIds([...favoriteIds, id]);
        }
      }
    } catch (err) {
      console.error("Failed to sync bookmark action:", err);
    }
  };



  // Admin Actions
  const handleApproveProperty = (id: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, isVerified: true } : p));
  };

  const handleRejectProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  // Navigation redirect to Chat
  const handleContactOwner = (p: Property) => {
    setChatTargetId(p.ownerId ? p.ownerId.toString() : '');
    setChatTargetName(p.ownerName);
    setChatTargetRole('Landlord');
    setCurrentScreen('chat');
  };

  const handleStartChatRoommate = (name: string) => {
    // Generate a mock roommate user ID based on name to populate chat participants
    const mockRoommateId = name === 'Aarav Sharma' ? '60d5ec4b868e8215881e1a5d' : '60d5ec4b868e8215881e1a5e';
    setChatTargetId(mockRoommateId);
    setChatTargetName(name);
    setChatTargetRole('Student');
    setCurrentScreen('chat');
  };

  // Left panel screen categories lists
  const screensList = [
    { category: 'Authentication & Profile', items: [
      { id: 'splash', label: 'Splash Screen', roles: ['Student', 'Landlord', 'Admin'] },
      { id: 'login', label: 'Login Screen', roles: ['Student', 'Landlord', 'Admin'] },
      { id: 'register', label: 'Register Screen', roles: ['Student', 'Landlord'] },
      { id: 'profile', label: 'Student Profile', roles: ['Student'] },
      { id: 'settings', label: 'Settings Panel', roles: ['Student', 'Landlord', 'Admin'] }
    ]},
    { category: 'Search & Booking', items: [
      { id: 'home', label: 'Home Feed', roles: ['Student'] },
      { id: 'search', label: 'Search & Filters', roles: ['Student'] },
      { id: 'details', label: 'Room Details', roles: ['Student'] },
      { id: 'map', label: 'Campus Maps', roles: ['Student'] },
      { id: 'favorites', label: 'Favorites Grid', roles: ['Student'] },
      { id: 'compare', label: 'Compare Rooms', roles: ['Student'] }
    ]},
    { category: 'Social & Matchmaking', items: [
      { id: 'roommateFinder', label: 'Roommate Matcher', roles: ['Student'] },
      { id: 'chat', label: 'Chat Messaging', roles: ['Student', 'Landlord'] },
      { id: 'reviews', label: 'Reviews & Feedback', roles: ['Student'] },
      { id: 'notifications', label: 'Notification logs', roles: ['Student', 'Landlord', 'Admin'] },
      { id: 'marketplace', label: 'Student Classifieds', roles: ['Student'] }
    ]},
    { category: 'Property Owner (Landlord)', items: [
      { id: 'ownerDashboard', label: 'Owner Dashboard', roles: ['Landlord'] },
      { id: 'addRoom', label: 'List Property Form', roles: ['Landlord'] },
      { id: 'editRoom', label: 'Edit Property Details', roles: ['Landlord'] }
    ]},
    { category: 'System Administration', items: [
      { id: 'adminDashboard', label: 'Admin Moderation', roles: ['Admin'] }
    ]}
  ];

  // Render simulated screen in Mobile Frame with Protected Routes
  const renderSimulatedScreen = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--brand-coral)] border-t-transparent" />
          <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Loading session...</p>
        </div>
      );
    }

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleBypassLogin} 
            onNavigateToRegister={() => setCurrentScreen('register')} 
          />
        );
      case 'register':
        return (
          <RegisterScreen 
            onRegister={() => setCurrentScreen('home')} 
            onNavigateToLogin={() => setCurrentScreen('login')} 
          />
        );
      
      // -- Protected Student Views --
      case 'home':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <HomeScreen 
              properties={properties} 
              onSelectProperty={(p) => { setSelectedProperty(p); setCurrentScreen('details'); }} 
              onNavigateToSearch={(q) => { setFilters({ ...filters, college: q }); setCurrentScreen('search'); }}
              onNavigateToFavorites={() => setCurrentScreen('favorites')}
            />
          </ProtectedRoute>
        );
      case 'search':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <SearchScreen 
              properties={properties} 
              onSelectProperty={(p) => { setSelectedProperty(p); setCurrentScreen('details'); }}
              onOpenFilter={() => setIsFilterOpen(true)}
              filters={filters}
              onNavigateToMap={() => setCurrentScreen('map')}
            />
          </ProtectedRoute>
        );
      case 'details':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            {selectedProperty ? (
              <RoomDetailsScreen
                property={selectedProperty}
                onBack={() => setCurrentScreen('search')}
                onContactOwner={handleContactOwner}
                onToggleFavorite={handleFavoriteToggle}
                isFavorited={favoriteIds.includes(selectedProperty.id)}
              />
            ) : (
              <div style={{ padding: '20px' }}>Please select a property first.</div>
            )}
          </ProtectedRoute>
        );
      case 'map':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <MapScreen 
              properties={properties} 
              onBack={() => setCurrentScreen('search')} 
              onSelectProperty={(p) => { setSelectedProperty(p); setCurrentScreen('details'); }}
            />
          </ProtectedRoute>
        );
      case 'favorites':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <FavoritesScreen 
              properties={properties} 
              favoriteIds={favoriteIds} 
              onSelectProperty={(p) => { setSelectedProperty(p); setCurrentScreen('details'); }}
              onRemoveFavorite={handleFavoriteToggle}
            />
          </ProtectedRoute>
        );
      case 'compare':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <CompareRoomsScreen 
              properties={properties} 
              onSelectProperty={(p) => { setSelectedProperty(p); setCurrentScreen('details'); }}
            />
          </ProtectedRoute>
        );
      case 'roommateFinder':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <RoommateFinderScreen onStartChat={handleStartChatRoommate} />
          </ProtectedRoute>
        );
      case 'chat':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Landlord', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <ChatScreen 
              initialChatTargetId={chatTargetId}
              initialChatTargetName={chatTargetName}
              initialChatTargetRole={chatTargetRole}
            />
          </ProtectedRoute>
        );
      case 'reviews':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <ReviewsScreen />
          </ProtectedRoute>
        );
      case 'notifications':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Landlord', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <NotificationsScreen />
          </ProtectedRoute>
        );
      case 'marketplace':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <MarketplaceScreen />
          </ProtectedRoute>
        );
      case 'profile':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <StudentProfileScreen />
          </ProtectedRoute>
        );
      case 'settings':
        return (
          <ProtectedRoute allowedRoles={['Student', 'Landlord', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <SettingsScreen 
              darkMode={darkMode} 
              onThemeToggle={() => setDarkMode(!darkMode)} 
              onLogout={() => setCurrentScreen('login')}
              onNavigateToProfile={() => setCurrentScreen('profile')}
            />
          </ProtectedRoute>
        );

      // -- Protected Landlord Views --
      case 'ownerDashboard':
        return (
          <ProtectedRoute allowedRoles={['Landlord', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <OwnerDashboardScreen
              onNavigateToAddRoom={() => setCurrentScreen('addRoom')}
              onNavigateToEditRoom={(p) => { setSelectedProperty(p); setCurrentScreen('editRoom'); }}
            />
          </ProtectedRoute>
        );
      case 'addRoom':
        return (
          <ProtectedRoute allowedRoles={['Landlord', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <AddRoomScreen 
              onCancel={() => setCurrentScreen('ownerDashboard')} 
            />
          </ProtectedRoute>
        );
      case 'editRoom':
        return (
          <ProtectedRoute allowedRoles={['Landlord', 'Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            {selectedProperty ? (
              <EditRoomScreen
                property={selectedProperty}
                onCancel={() => setCurrentScreen('ownerDashboard')}
              />
            ) : (
              <div style={{ padding: '20px' }}>Please select a property first.</div>
            )}
          </ProtectedRoute>
        );

      // -- Protected Admin Views --
      case 'adminDashboard':
        return (
          <ProtectedRoute allowedRoles={['Admin']} fallbackScreen={() => setCurrentScreen('login')}>
            <AdminDashboardScreen
              properties={properties}
              onApproveProperty={handleApproveProperty}
              onRejectProperty={handleRejectProperty}
            />
          </ProtectedRoute>
        );
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  const handleLogoutDeck = async () => {
    try {
      await logout();
      setCurrentScreen('login');
    } catch (err) {
      setCurrentScreen('login');
    }
  };

  return (
    <div id="app-container">
      {/* 1. LEFT PRESENTATION CONTROL DECK */}
      <div id="control-deck">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-color-light)', paddingBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--brand-coral), #ff7b00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 800 }}>
            <span style={{ margin: 'auto' }}>C</span>
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit' }}>CampusRoom</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>UX/UI Design System</span>
          </div>
        </div>

        {/* Global theme toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant={!darkMode ? 'secondary' : 'outline'} 
            onClick={() => setDarkMode(false)} 
            style={{ flex: 1, height: '36px', borderRadius: '8px', padding: 0 }}
            icon={<Sun size={14} />}
          >
            Light Mode
          </Button>
          <Button 
            variant={darkMode ? 'secondary' : 'outline'} 
            onClick={() => setDarkMode(true)} 
            style={{ flex: 1, height: '36px', borderRadius: '8px', padding: 0 }}
            icon={<Moon size={14} />}
          >
            Dark Mode
          </Button>
        </div>

        {/* Presenter session status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>SESSION CONTEXT</span>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{user.name}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{user.email} • <Badge variant="coral">{user.role}</Badge></span>
              <span onClick={handleLogoutDeck} style={{ fontSize: '11px', color: 'red', cursor: 'pointer', fontWeight: 500, marginTop: '4px' }}>Log Out Session</span>
            </div>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Guest User (Signed Out)</span>
          )}
        </div>

        {/* Presenter role bypass switches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>ROLE BYPASS (DEV MODE)</span>
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
            {(['Student', 'Landlord', 'Admin'] as const).map(r => (
              <button
                key={r}
                onClick={() => handleBypassLogin(r)}
                style={{
                  flex: 1,
                  padding: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeRole === r ? 'var(--bg-surface)' : 'transparent',
                  color: activeRole === r ? 'var(--brand-coral)' : 'var(--text-secondary)',
                  boxShadow: activeRole === r ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Screen quick navigator index */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
          {screensList.map((cat) => (
            <div key={cat.category} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', paddingLeft: '4px', marginBottom: '2px' }}>
                {cat.category}
              </span>
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    // Update role context automatically to match the screen
                    if (item.id === 'ownerDashboard' || item.id === 'addRoom' || item.id === 'editRoom') {
                      setActiveRole('Landlord');
                    } else if (item.id === 'adminDashboard') {
                      setActiveRole('Admin');
                    } else if (item.id === 'home' || item.id === 'search' || item.id === 'roommateFinder' || item.id === 'marketplace' || item.id === 'profile') {
                      setActiveRole('Student');
                    }
                    setCurrentScreen(item.id);
                  }}
                  className={`sidebar-list-item ${currentScreen === item.id ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={12} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Apple Design System Badge footer */}
        <div style={{ borderTop: '1px solid var(--border-color-light)', paddingTop: '12px', fontSize: '10.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left' }}>
          <Laptop size={14} />
          <span>Designed with Apple & Airbnb tokens. v1.0.0</span>
        </div>
      </div>

      {/* 2. DYNAMIC MOBILE PREVIEW FRAME WRAP */}
      <div id="preview-stage">
        <div className="phone-frame">
          {/* iOS Notch Overlay */}
          <div className="phone-notch" />
          
          {/* iOS Top Status Bar */}
          <div className="phone-status-bar">
            <span>3:40</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span>5G</span>
              <div style={{ width: '18px', height: '10px', border: '1px solid var(--text-primary)', borderRadius: '3px', padding: '1px', display: 'flex' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--text-primary)', borderRadius: '1px' }} />
              </div>
            </div>
          </div>

          {/* Render Simulated Content inside phone window */}
          <div className="phone-screen-content">
            {renderSimulatedScreen()}
          </div>

          {/* Floating dynamic Bottom Sheets/Drawers */}
          <FilterDrawer
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onApplyFilters={(f) => { setFilters(f); setCurrentScreen('search'); }}
          />

          {/* Dynamic iOS Bottom Navigation tabs depending on active role */}
          {currentScreen !== 'splash' && currentScreen !== 'login' && currentScreen !== 'register' && (
            <div className="phone-navbar">
              {activeRole === 'Student' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('home')} 
                    className={`navbar-tab ${currentScreen === 'home' ? 'active' : ''}`}
                  >
                    <Home size={20} />
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('search')} 
                    className={`navbar-tab ${currentScreen === 'search' ? 'active' : ''}`}
                  >
                    <Search size={20} />
                    <span>Explore</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('roommateFinder')} 
                    className={`navbar-tab ${currentScreen === 'roommateFinder' ? 'active' : ''}`}
                  >
                    <Sparkles size={20} />
                    <span>Matches</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('chat')} 
                    className={`navbar-tab ${currentScreen === 'chat' ? 'active' : ''}`}
                  >
                    <MessageSquare size={20} />
                    <span>Chats</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('settings')} 
                    className={`navbar-tab ${currentScreen === 'settings' ? 'active' : ''}`}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </button>
                </>
              )}

              {activeRole === 'Landlord' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('ownerDashboard')} 
                    className={`navbar-tab ${currentScreen === 'ownerDashboard' ? 'active' : ''}`}
                  >
                    <Layers size={20} />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('addRoom')} 
                    className={`navbar-tab ${currentScreen === 'addRoom' ? 'active' : ''}`}
                  >
                    <Sparkles size={20} />
                    <span>List Room</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('chat')} 
                    className={`navbar-tab ${currentScreen === 'chat' ? 'active' : ''}`}
                  >
                    <MessageSquare size={20} />
                    <span>Chats</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('settings')} 
                    className={`navbar-tab ${currentScreen === 'settings' ? 'active' : ''}`}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                </>
              )}

              {activeRole === 'Admin' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('adminDashboard')} 
                    className={`navbar-tab ${currentScreen === 'adminDashboard' ? 'active' : ''}`}
                  >
                    <ShieldCheck size={20} />
                    <span>Admin Panel</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('settings')} 
                    className={`navbar-tab ${currentScreen === 'settings' ? 'active' : ''}`}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
