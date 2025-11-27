export interface Course {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  level: string;
  category: string;
  color_start: string;
  color_end: string;
  icon: string;
  estimated_time: number;
  total_words: number;
  created_at: string;
  updated_at: string;
}

export interface Word {
  id: number;
  course_id: number;
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  difficulty: string;
  synonyms: string[];
  antonyms: string[];
  audio_url?: string;
  order_index: number;
  created_at: string;
}

export interface UserVocabulary {
  id: string;
  user_id: string;
  word: string;
  pronunciation?: string;
  definition: string;
  example?: string;
  topic?: string;
  audio_url?: string; // URL for pronunciation audio
  date_added: string;
  is_favorite: boolean;
  review_count: number;
  last_reviewed?: string;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_date: string;
  words_learned: number;
  words_reviewed: number;
  exercises_completed: number;
  study_time_minutes: number;
  accuracy_rate: number;
  lesson_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Helper type for creating/updating vocabulary
export interface CreateUserVocabulary {
  word: string;
  pronunciation?: string;
  definition: string;
  example?: string;
  topic?: string;
  audio_url?: string; // URL for pronunciation audio
  is_favorite?: boolean;
}

export interface UpdateUserVocabulary extends Partial<CreateUserVocabulary> {
  review_count?: number;
  last_reviewed?: string;
}
