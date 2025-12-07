
export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  QNA = 'QNA',
  SUMMARY = 'SUMMARY',
  DOCS = 'DOCS',
  EDIT_PROFILE = 'EDIT_PROFILE'
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  institution?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  status: 'Ready' | 'Processing';
  type: 'pdf' | 'docx' | 'txt';
  uploadDate: string;
}
