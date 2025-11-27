export type ExerciseType =
  | "flashcard"
  | "multiple-choice"
  | "fill-blank"
  | "word-order"
  | "listening"
  | "spelling"
  | "word-definition-matching";

export interface Word {
  id: number;
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  difficulty: string;
  synonyms?: string[];
  antonyms?: string[];
  audioUrl?: string;
}

export interface Exercise {
  type: ExerciseType;
  word: Word;
  options?: string[];
  correctAnswer?: string;
  blankedSentence?: string;
  shuffledWords?: string[];
  originalSentence?: string;
  ipaHint?: string;
  matchingPairs?: Array<{
    word: string;
    definition: string;
    pronunciation?: string;
  }>;
}