import { User, Profile, InterestRequest, Connection, Message } from '../types';

export const MOCK_CREDENTIALS = [
  { email: 'candidate@demo.com', password: 'password123', userId: 'user-farhan' },
  { email: 'female@demo.com', password: 'password123', userId: 'user-amna' },
  { email: 'guardian@demo.com', password: 'password123', userId: 'user-guardian' },
  { email: 'admin@demo.com', password: 'password123', userId: 'user-admin' },
];

export const MOCK_USERS: User[] = [
  { id: 'user-farhan', name: 'Farhan Khan', email: 'candidate@demo.com', role: 'candidate', isVerified: true, isActive: true, createdAt: '2025-09-10' },
  { id: 'user-amna', name: 'Amna Malik', email: 'female@demo.com', role: 'candidate', isVerified: true, isActive: true, createdAt: '2025-09-12' },
  { id: 'user-zara', name: 'Zara Ahmed', email: 'zara@demo.com', role: 'candidate', isVerified: false, isActive: true, createdAt: '2025-09-14' },
  { id: 'user-omar', name: 'Omar Siddiqui', email: 'omar@demo.com', role: 'candidate', isVerified: true, isActive: true, createdAt: '2025-09-15' },
  { id: 'user-fatima', name: 'Fatima Raza', email: 'fatima@demo.com', role: 'candidate', isVerified: false, isActive: true, createdAt: '2025-09-16' },
  { id: 'user-ali', name: 'Ali Hassan', email: 'ali@demo.com', role: 'candidate', isVerified: true, isActive: true, createdAt: '2025-09-18' },
  { id: 'user-guardian', name: 'Mrs. Nadia Malik', email: 'guardian@demo.com', role: 'guardian', isVerified: true, isActive: true, createdAt: '2025-09-12' },
  { id: 'user-admin', name: 'Admin Hassan', email: 'admin@demo.com', role: 'admin', isVerified: true, isActive: true, createdAt: '2025-08-01' },
];

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'profile-farhan',
    userId: 'user-farhan',
    name: 'Farhan Khan',
    age: 28,
    gender: 'male',
    city: 'Karachi',
    education: "Bachelor's in Computer Science",
    profession: 'Software Engineer',
    religiousValues: 'Practicing, five daily prayers, values Islamic principles in daily life.',
    aboutMe: "Assalamu Alaikum. I'm a software engineer based in Karachi with a passion for technology and community. I value family, honesty, and continuous learning. Looking for a life partner who shares similar values.",
    photoUrl: 'https://images.unsplash.com/photo-1673830719944-7bf527816dae?w=400&q=80',
    partnerAgeMin: 22,
    partnerAgeMax: 27,
    partnerCity: 'Karachi',
    partnerEducation: "Bachelor's or above",
    profileCompletion: 90,
    isVerified: true,
  },
  {
    id: 'profile-amna',
    userId: 'user-amna',
    name: 'Amna Malik',
    age: 25,
    gender: 'female',
    city: 'Lahore',
    education: "MBBS – Medical Doctor",
    profession: 'Doctor',
    religiousValues: 'Alhamdulillah, practicing. Believes in moderate, balanced Islamic lifestyle.',
    aboutMe: "Wa Alaikum Assalam. I am a junior doctor completing my residency in Lahore. My family is deeply involved in my rishta process. I value respect, kindness, and a partner who supports each other's ambitions.",
    photoUrl: 'https://images.unsplash.com/photo-1569333658927-d62b11428980?w=400&q=80',
    partnerAgeMin: 26,
    partnerAgeMax: 32,
    partnerCity: 'Any',
    partnerEducation: 'Any',
    profileCompletion: 95,
    isVerified: true,
  },
  {
    id: 'profile-zara',
    userId: 'user-zara',
    name: 'Zara Ahmed',
    age: 24,
    gender: 'female',
    city: 'Islamabad',
    education: "Bachelor's in Education",
    profession: 'Teacher',
    religiousValues: 'Strong faith, regular prayers. Values an Islamic household.',
    aboutMe: "As-salamu alaykum. I am a school teacher in Islamabad who loves reading, cooking, and spending time with family. I believe in building a home based on love, respect, and taqwa.",
    photoUrl: 'https://images.unsplash.com/photo-1772714601002-fbb0fea8a911?w=400&q=80',
    partnerAgeMin: 25,
    partnerAgeMax: 32,
    partnerCity: 'Any',
    partnerEducation: 'Any',
    profileCompletion: 80,
    isVerified: false,
  },
  {
    id: 'profile-omar',
    userId: 'user-omar',
    name: 'Omar Siddiqui',
    age: 30,
    gender: 'male',
    city: 'Karachi',
    education: "Bachelor's in Architecture",
    profession: 'Architect',
    religiousValues: 'Alhamdulillah, regular prayers, Jummah attendee.',
    aboutMe: "Architect by profession, creative by nature. I run my own design firm and am ready to settle down with a life partner who values family and growth. Looking for someone caring and ambitious.",
    photoUrl: 'https://images.unsplash.com/photo-1774437790865-76bfb73d7166?w=400&q=80',
    partnerAgeMin: 22,
    partnerAgeMax: 28,
    partnerCity: 'Karachi',
    partnerEducation: "Bachelor's or above",
    profileCompletion: 85,
    isVerified: true,
  },
  {
    id: 'profile-fatima',
    userId: 'user-fatima',
    name: 'Fatima Raza',
    age: 26,
    gender: 'female',
    city: 'Lahore',
    education: "PharmD – Pharmacist",
    profession: 'Pharmacist',
    religiousValues: 'Practicing Muslimah, regularly prays, wears hijab.',
    aboutMe: "Alhamdulillah, I am a licensed pharmacist at a hospital in Lahore. I enjoy baking, calligraphy, and volunteer work. Looking for a pious, kind-hearted partner who values family life.",
    photoUrl: 'https://images.unsplash.com/photo-1710488140888-88896ecafdcd?w=400&q=80',
    partnerAgeMin: 27,
    partnerAgeMax: 34,
    partnerCity: 'Any',
    partnerEducation: 'Any',
    profileCompletion: 88,
    isVerified: false,
  },
  {
    id: 'profile-ali',
    userId: 'user-ali',
    name: 'Ali Hassan',
    age: 27,
    gender: 'male',
    city: 'Islamabad',
    education: "Master's in Business Administration",
    profession: 'Business Analyst',
    religiousValues: 'Alhamdulillah, practicing, values halal lifestyle.',
    aboutMe: "I am a business analyst working with a multinational in Islamabad. Family-oriented, love cricket, traveling, and good food. Looking for a life partner who is warm, understanding, and religious.",
    photoUrl: 'https://images.unsplash.com/photo-1569333658927-d62b11428980?w=400&q=80',
    partnerAgeMin: 22,
    partnerAgeMax: 27,
    partnerCity: 'Any',
    partnerEducation: "Bachelor's or above",
    profileCompletion: 78,
    isVerified: true,
  },
];

export const MOCK_REQUESTS: InterestRequest[] = [
  {
    id: 'req-1',
    senderId: 'user-farhan',
    receiverId: 'user-amna',
    senderProfile: MOCK_PROFILES.find(p => p.userId === 'user-farhan'),
    receiverProfile: MOCK_PROFILES.find(p => p.userId === 'user-amna'),
    status: 'pending',
    guardianReviewed: false,
    createdAt: '2026-04-10',
  },
  {
    id: 'req-2',
    senderId: 'user-farhan',
    receiverId: 'user-zara',
    senderProfile: MOCK_PROFILES.find(p => p.userId === 'user-farhan'),
    receiverProfile: MOCK_PROFILES.find(p => p.userId === 'user-zara'),
    status: 'accepted',
    guardianReviewed: true,
    createdAt: '2026-03-22',
  },
  {
    id: 'req-3',
    senderId: 'user-ali',
    receiverId: 'user-farhan',
    senderProfile: MOCK_PROFILES.find(p => p.userId === 'user-ali'),
    receiverProfile: MOCK_PROFILES.find(p => p.userId === 'user-farhan'),
    status: 'pending',
    guardianReviewed: true,
    createdAt: '2026-04-12',
  },
  {
    id: 'req-4',
    senderId: 'user-omar',
    receiverId: 'user-amna',
    senderProfile: MOCK_PROFILES.find(p => p.userId === 'user-omar'),
    receiverProfile: MOCK_PROFILES.find(p => p.userId === 'user-amna'),
    status: 'pending',
    guardianReviewed: false,
    createdAt: '2026-04-08',
  },
  {
    id: 'req-5',
    senderId: 'user-ali',
    receiverId: 'user-amna',
    senderProfile: MOCK_PROFILES.find(p => p.userId === 'user-ali'),
    receiverProfile: MOCK_PROFILES.find(p => p.userId === 'user-amna'),
    status: 'pending',
    guardianReviewed: false,
    createdAt: '2026-04-14',
  },
];

export const MOCK_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    user1Id: 'user-farhan',
    user2Id: 'user-zara',
    connectedProfile: MOCK_PROFILES.find(p => p.userId === 'user-zara'),
    createdAt: '2026-03-25',
  },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'msg-1', connectionId: 'conn-1', senderId: 'user-farhan', text: 'Assalamu Alaikum! I am so happy we connected. How are you doing?', createdAt: '2026-03-25T10:00:00' },
  { id: 'msg-2', connectionId: 'conn-1', senderId: 'user-zara', text: 'Wa Alaikum Assalam! Alhamdulillah, I am doing well. Thank you for reaching out. 😊', createdAt: '2026-03-25T10:05:00' },
  { id: 'msg-3', connectionId: 'conn-1', senderId: 'user-farhan', text: "That's great to hear! I read your profile and you seem like a wonderful person. Would you be open to knowing each other better, with our families involved?", createdAt: '2026-03-25T10:10:00' },
  { id: 'msg-4', connectionId: 'conn-1', senderId: 'user-zara', text: 'Of course, I appreciate the proper approach! My family is also supportive. Maybe we can arrange a family meeting soon?', createdAt: '2026-03-25T10:15:00' },
  { id: 'msg-5', connectionId: 'conn-1', senderId: 'user-farhan', text: 'Absolutely! I will speak with my parents about this. JazakAllah Khair for being so understanding.', createdAt: '2026-03-25T10:20:00' },
  { id: 'msg-6', connectionId: 'conn-1', senderId: 'user-zara', text: 'JazakAllah Khair to you too! Looking forward to it inshallah. 🤲', createdAt: '2026-03-25T11:00:00' },
];

export const ADMIN_STATS = {
  totalUsers: 847,
  totalRequests: 1243,
  activeConnections: 312,
  verifiedUsers: 589,
};

export function getProfileByUserId(userId: string): Profile | undefined {
  return MOCK_PROFILES.find(p => p.userId === userId);
}

export function getUserById(userId: string): User | undefined {
  return MOCK_USERS.find(u => u.id === userId);
}

export function getConnectionsForUser(userId: string): Connection[] {
  return MOCK_CONNECTIONS.filter(c => c.user1Id === userId || c.user2Id === userId).map(c => ({
    ...c,
    connectedProfile: MOCK_PROFILES.find(p => p.userId === (c.user1Id === userId ? c.user2Id : c.user1Id)),
  }));
}

export function isConnected(userId1: string, userId2: string): boolean {
  return MOCK_CONNECTIONS.some(
    c => (c.user1Id === userId1 && c.user2Id === userId2) || (c.user1Id === userId2 && c.user2Id === userId1)
  );
}

export function getSentRequests(userId: string): InterestRequest[] {
  return MOCK_REQUESTS.filter(r => r.senderId === userId);
}

export function getReceivedRequests(userId: string): InterestRequest[] {
  return MOCK_REQUESTS.filter(r => r.receiverId === userId && r.guardianReviewed);
}

export function getGuardianPendingRequests(candidateUserId: string): InterestRequest[] {
  return MOCK_REQUESTS.filter(r => r.receiverId === candidateUserId && !r.guardianReviewed && r.status === 'pending');
}

export function getMessagesForConnection(connectionId: string): Message[] {
  return MOCK_MESSAGES.filter(m => m.connectionId === connectionId);
}

// Guardian link - guardian manages amna's profile
export const GUARDIAN_LINKS: { guardianUserId: string; candidateUserId: string }[] = [
  { guardianUserId: 'user-guardian', candidateUserId: 'user-amna' },
];

export function getCandidateForGuardian(guardianUserId: string): string | undefined {
  return GUARDIAN_LINKS.find(g => g.guardianUserId === guardianUserId)?.candidateUserId;
}
