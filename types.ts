// Définition de l'utilisateur stocké dans Firestore
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  messageCount: number;
  createdAt: any; // Firestore Timestamp
}

// Structure d'un message de chat
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

// Structure pour les données du dashboard parent
export interface SchoolRecommendation {
  id: string;
  name: string;
  matchScore: number;
  type: string;
  location: string;
}

export interface ReportData {
  personalityTraits: { name: string; value: number }[];
  recommendedSchools: SchoolRecommendation[];
  careerPaths: string[];
}