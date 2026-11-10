export interface User {
  id: number;
  email: string;
  displayName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresUtc: string;
  user: User;
}

export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
  /** Honeypot — must stay empty for real users. */
  website?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company?: string;
  message: string;
  createdUtc: string;
  isHandled: boolean;
}