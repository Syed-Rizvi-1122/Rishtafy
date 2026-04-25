export type Role = 'candidate' | 'guardian' | 'admin';
export type RequestStatus = 'pending' | 'approved_by_guardian' | 'accepted' | 'declined';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  education: string;
  profession: string;
  religiousValues: string;
  aboutMe: string;
  photoUrl: string | null;
  partnerAgeMin: number;
  partnerAgeMax: number;
  partnerCity: string;
  partnerEducation: string;
  profileCompletion: number;
  isVerified: boolean;
}

export interface InterestRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderProfile?: Profile;
  receiverProfile?: Profile;
  status: RequestStatus;
  guardianReviewed: boolean;
  createdAt: string;
}

export interface Connection {
  id: string;
  user1Id: string;
  user2Id: string;
  connectedProfile?: Profile;
  createdAt: string;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isActive: boolean;
}
