export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Course {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  image_url: string | null;
  level: string | null;
  creator_id: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  title: string;
  status: 'draft' | 'published';
  video_url: string | null;
  course_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error?: string;
  errors?: string[];
}