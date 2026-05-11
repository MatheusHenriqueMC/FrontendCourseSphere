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
  enrollment_count: number;
  is_enrolled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: number;
  name: string;
  position: number;
  course_id: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  status: 'draft' | 'published';
  video_url: string | null;
  course_id: number;
  section_id: number | null;
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