import type { Role } from "@/config/roles";

export interface User {
  userId: string;
  userName: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterData {
  userName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}
