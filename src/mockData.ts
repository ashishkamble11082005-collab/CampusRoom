// shared mock database for CampusRoom interactive UI prototype

export interface Property {
  id: string;
  _id?: string; // MongoDB object identifier
  ownerId?: string; // Landlord User ID
  title: string;
  location: string;
  price: number;
  rating: number;
  averageRating?: number; // MongoDB rating aggregate
  reviewsCount: number;
  image: string;
  images: string[];
  isVerified: boolean;
  distance: string;
  distanceText?: string; // MongoDB distance string
  college: string;
  collegeName?: string; // MongoDB college name
  type: 'PG' | 'Hostel' | 'Flat' | 'Room';
  sharing: 'Single' | 'Double' | 'Triple';
  amenities: string[];
  gender: 'Girls only' | 'Boys only' | 'Co-ed';
  ownerName: string;
  ownerPhone: string;
  ownerAvatar?: string;
  description: string;
  coordinates: { x: number; y: number }; // Simulated map layout relative coordinates (0-100)
}

export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  college: string;
  avatar?: string;
  matchScore: number;
  bio: string;
  lifestyle: {
    sleep: 'Early Bird' | 'Night Owl' | 'Flexible';
    cleanliness: 'Neat Freak' | 'Moderate' | 'Relaxed';
    food: 'Veg Only' | 'Non-Veg Allowed' | 'Vegan';
    noise: 'Quiet Study' | 'Music Friendly' | 'No preference';
    guests: 'No Guests' | 'Weekends Only' | 'Anytime';
  };
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  college: string;
  category: 'Furniture' | 'Electronics' | 'Books' | 'Other';
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  avatar?: string;
  role: 'Student' | 'Landlord';
  lastMessage: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface SystemNotification {
  id: string;
  type: 'match' | 'message' | 'approval' | 'booking';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface PropertyReview {
  id: string;
  studentName: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  categories: {
    cleanliness: number;
    safety: number;
    landlord: number;
    value: number;
  };
}

export const initialColleges = [
  "Delhi University (DU)",
  "IIT Delhi",
  "BITS Pilani",
  "Symbiosis Pune",
  "Christ University Bangalore",
  "VIT Vellore",
  "SRM Chennai"
];

export const initialProperties: Property[] = [
  {
    id: "p1",
    title: "Stanza Living Munich House",
    location: "Kothrud, Pune",
    price: 12500,
    rating: 4.8,
    reviewsCount: 32,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80"
    ],
    isVerified: true,
    distance: "0.8 km",
    college: "Symbiosis Pune",
    type: "PG",
    sharing: "Double",
    amenities: ["Wi-Fi", "AC", "Gym", "Power Backup", "Food Included", "Security"],
    gender: "Boys only",
    ownerName: "Rajesh Shinde",
    ownerPhone: "+91 98765 43210",
    ownerAvatar: "",
    description: "Premium co-living space specifically designed for Symbiosis Pune students. Munich House offers fully serviced air-conditioned rooms, double-sharing layouts, and organic nutritious food planned by professional nutritionists. The property boasts a fully equipped rooftop gym and 24/7 security.",
    coordinates: { x: 30, y: 40 }
  },
  {
    id: "p2",
    title: "Olive Student Co-living Hub",
    location: "Vasant Kunj, Delhi",
    price: 16000,
    rating: 4.9,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"
    ],
    isVerified: true,
    distance: "1.2 km",
    college: "Delhi University (DU)",
    type: "Flat",
    sharing: "Single",
    amenities: ["Wi-Fi", "AC", "Washing Machine", "Kitchenette", "Gym", "Parking"],
    gender: "Co-ed",
    ownerName: "Vikram Malhotra",
    ownerPhone: "+91 98123 45678",
    description: "Luxurious single-occupancy studio flats near North Campus. Features fully functional kitchenettes, modern wooden flooring, attached private balcony, and high-speed fiber Wi-Fi. Perfect for students looking for privacy and peace during exam seasons.",
    coordinates: { x: 55, y: 35 }
  },
  {
    id: "p3",
    title: "Radha Raman Girls PG & Hostel",
    location: "Vellore Main Road",
    price: 9000,
    rating: 4.5,
    reviewsCount: 18,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
    ],
    isVerified: true,
    distance: "0.5 km",
    college: "VIT Vellore",
    type: "Hostel",
    sharing: "Triple",
    amenities: ["Wi-Fi", "Food Included", "Washing Machine", "Security", "CCTV"],
    gender: "Girls only",
    ownerName: "Mrs. Revathi Subramanian",
    ownerPhone: "+91 94440 12345",
    description: "A secure and cozy triple-sharing paying guest room located right outside the VIT Vellore main gate. Home-like vegetarian food served three times a day. Strictly girls-only with biometric attendance security, power backup, and regular housekeeping.",
    coordinates: { x: 45, y: 65 }
  },
  {
    id: "p4",
    title: "Heritage Boys Flatmate Residency",
    location: "Katraj, Pune",
    price: 7500,
    rating: 4.2,
    reviewsCount: 11,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    ],
    isVerified: false,
    distance: "2.5 km",
    college: "Symbiosis Pune",
    type: "Room",
    sharing: "Double",
    amenities: ["Wi-Fi", "Parking", "Kitchenette"],
    gender: "Boys only",
    ownerName: "Anil Deshmukh",
    ownerPhone: "+91 99221 88776",
    description: "Budget-friendly shared room in a 2BHK flat. Close to local transport nodes. Semi-furnished kitchen layout where students can cook independently. Open parking for bikes is included.",
    coordinates: { x: 25, y: 70 }
  }
];

export const initialRoommates: RoommateProfile[] = [
  {
    id: "r1",
    name: "Aarav Sharma",
    age: 20,
    college: "IIT Delhi",
    matchScore: 98,
    avatar: "",
    bio: "Computer Science junior. Friendly, love playing Valorant, and active code-hackathon participant. I keep my space fairly clean but don't mind occasional clutter.",
    lifestyle: {
      sleep: "Night Owl",
      cleanliness: "Moderate",
      food: "Non-Veg Allowed",
      noise: "Music Friendly",
      guests: "Weekends Only"
    }
  },
  {
    id: "r2",
    name: "Sneha Iyer",
    age: 19,
    college: "Symbiosis Pune",
    matchScore: 92,
    avatar: "",
    bio: "Design student at Symbiosis. Love painting, indie music, and morning coffees. Very organized and strictly vegan. Looking for a quiet, roommate space.",
    lifestyle: {
      sleep: "Early Bird",
      cleanliness: "Neat Freak",
      food: "Vegan",
      noise: "Quiet Study",
      guests: "No Guests"
    }
  },
  {
    id: "r3",
    name: "Rohan Das",
    age: 21,
    college: "Delhi University (DU)",
    matchScore: 85,
    avatar: "",
    bio: "Economics major. Guitarist, sports enthusiast, and chill vibe. Flexible about house rules but prefer someone who balances studies and social life.",
    lifestyle: {
      sleep: "Flexible",
      cleanliness: "Relaxed",
      food: "Non-Veg Allowed",
      noise: "Music Friendly",
      guests: "Anytime"
    }
  }
];

export const initialMarketplace: MarketplaceItem[] = [
  {
    id: "m1",
    title: "Mini Fridge (190L, Samsung)",
    price: 4500,
    image: "https://images.unsplash.com/photo-1571175432267-efb9291a1827?auto=format&fit=crop&w=400&q=80",
    seller: "Karan Johar",
    college: "Symbiosis Pune",
    category: "Electronics"
  },
  {
    id: "m2",
    title: "Wooden Study Table + Cushion Chair",
    price: 1800,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80",
    seller: "Pooja Hegde",
    college: "VIT Vellore",
    category: "Furniture"
  },
  {
    id: "m3",
    title: "Engineering Semester 3 Textbook Bundle",
    price: 600,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
    seller: "Rahul Roy",
    college: "IIT Delhi",
    category: "Books"
  }
];

export const initialChats: ChatConversation[] = [
  {
    id: "c1",
    name: "Rajesh Shinde (Munich PG)",
    role: "Landlord",
    lastMessage: "Sure, you can visit tomorrow at 4 PM to inspect the double sharing room.",
    unreadCount: 2,
    messages: [
      { id: "1", sender: "me", text: "Hello Sir, I wanted to ask about Stanza Living Munich House. Is the double sharing room vacant?", timestamp: "11:20 AM" },
      { id: "2", sender: "them", text: "Hello! Yes, it is vacant. When would you like to visit?", timestamp: "11:25 AM" },
      { id: "3", sender: "me", text: "Would tomorrow afternoon work?", timestamp: "11:30 AM" },
      { id: "4", sender: "them", text: "Sure, you can visit tomorrow at 4 PM to inspect the double sharing room.", timestamp: "11:32 AM" }
    ]
  },
  {
    id: "c2",
    name: "Sneha Iyer (Symbiosis)",
    role: "Student",
    lastMessage: "I prefer neat apartments, let me know if you want to team up.",
    unreadCount: 0,
    messages: [
      { id: "1", sender: "me", text: "Hi Sneha, saw your roommate profile. Match score says 92%. Are you still searching for a PG near Kothrud?", timestamp: "Yesterday" },
      { id: "2", sender: "them", text: "Hey! Yes, I am. I prefer neat apartments, let me know if you want to team up.", timestamp: "Yesterday" }
    ]
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: "n1",
    type: "match",
    title: "New High Match Roommate!",
    message: "Aarav Sharma matched 98% with your lifestyle settings.",
    time: "2 hrs ago",
    unread: true
  },
  {
    id: "n2",
    type: "message",
    title: "New Message from Landlord",
    message: "Rajesh Shinde replied to your Munich House inquiry.",
    time: "3 hrs ago",
    unread: true
  },
  {
    id: "n3",
    type: "approval",
    title: "Listing Verified successfully",
    message: "Admin approved your property Stanza Living Munich House.",
    time: "1 day ago",
    unread: false
  }
];

export const initialReviews: PropertyReview[] = [
  {
    id: "rev1",
    studentName: "Aditya Verma",
    avatar: "",
    rating: 4.8,
    text: "Excellent PG near campus. The food quality is consistent, and the Wi-Fi is super fast. Security is very strict which is great for parents' peace of mind.",
    date: "14 Jun 2026",
    categories: { cleanliness: 5, safety: 5, landlord: 4, value: 5 }
  },
  {
    id: "rev2",
    studentName: "Nisha Patel",
    avatar: "",
    rating: 4.2,
    text: "Decent roommates and very quick maintenance service. The landlord is cooperative. Only issue is parking space is tight.",
    date: "03 May 2026",
    categories: { cleanliness: 4, safety: 4, landlord: 5, value: 4 }
  }
];
