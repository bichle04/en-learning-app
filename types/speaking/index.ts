// Types for Speaking Practice & Test Room

export type SpeakingMode = 'practice' | 'test';

export type SpeakingPart = 1 | 2 | 3;

export interface SpeakingTopic {
  id: string;
  title: string;
  description: string;
  part: SpeakingPart;
}

export interface SpeakingQuestion {
  id: string;
  part: SpeakingPart;
  topicId?: string;
  question: string;
  prepTime: number; // seconds
  speakTime: number; // seconds
  audioUrl?: string;
}

export interface SpeakingResult {
  id: string;
  mode: SpeakingMode;
  date: string;
  duration: number; // seconds
  overallScore: number;
  scores: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  feedback: {
    fluencyCoherence: SpeakingFeedback;
    lexicalResource: SpeakingFeedback;
    grammaticalRange: SpeakingFeedback;
    pronunciation: SpeakingFeedback;
  };
  audioUrl?: string;
}

export interface SpeakingFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  generalComment: string;
}

export interface RecordingState {
  isRecording: boolean;
  isPreparing: boolean;
  prepTimeRemaining: number;
  speakTimeRemaining: number;
  audioUri?: string;
}
