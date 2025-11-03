
export enum UserRole {
  PUBLIC = 'PUBLIC',
  DIRECTIVO = 'DIRECTIVO',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface Modification {
  modifyingNormId: string;
  modifyingNormTitle: string;
  summary: string;
  appliedBy: string; // User ID
  appliedAt: string; // ISO Date string
}

export interface Version {
  version: number;
  content: string;
  date: string; // ISO Date string
  modification: Modification | null;
}

export interface Norm {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  tags: string[];
  isConfidential: boolean;
  versions: Version[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}
