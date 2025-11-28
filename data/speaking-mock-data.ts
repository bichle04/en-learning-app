// Mock data for Speaking Practice

import { SpeakingQuestion, SpeakingTopic } from "@/types/speaking";

export const SPEAKING_TOPICS: SpeakingTopic[] = [
  // Part 1 Topics - Audio only, no text questions
  {
    id: "p1-general",
    title: "Introduction & Interview",
    description: "General questions about yourself",
    part: 1,
  },
  
  // Part 2 Topics - Text questions provided
  {
    id: "p2-person",
    title: "A Person You Admire",
    description: "Describe someone you look up to",
    part: 2,
  },
  {
    id: "p2-place",
    title: "A Memorable Place",
    description: "Talk about a place you remember well",
    part: 2,
  },
  {
    id: "p2-experience",
    title: "An Important Experience",
    description: "Describe a significant life event",
    part: 2,
  },
  
  // Part 3 Topics - Audio only, no text questions
  {
    id: "p3-discussion",
    title: "Two-way Discussion",
    description: "Discuss abstract topics",
    part: 3,
  },
];

export const SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  // Part 1 - Introduction (4-5 minutes) - AUDIO ONLY
  {
    id: "q1-general",
    part: 1,
    topicId: "p1-general",
    question: "", // No text question - examiner will ask via audio
    prepTime: 0,
    speakTime: 3, // 5 minutes total
    audioUrl: "correct.mp3", // BACKEND: Replace with actual Part 1 audio file
  },
  
  // Part 2 - Long Turn (1 min prep + 2 min speak) - TEXT PROVIDED
  {
    id: "q2-person",
    part: 2,
    topicId: "p2-person",
    question: "Describe a person you admire.\n\nYou should say:\n• Who this person is\n• How you know them\n• What they are like\n• And explain why you admire them",
    prepTime: 60,
    speakTime: 120,
    audioUrl: "correct.mp3", // BACKEND: Optional intro audio
  },
  {
    id: "q2-place",
    part: 2,
    topicId: "p2-place",
    question: "Describe a place you remember well.\n\nYou should say:\n• Where it is\n• When you went there\n• What you did there\n• And explain why you remember it well",
    prepTime: 60,
    speakTime: 120,
    audioUrl: "correct.mp3",
  },
  {
    id: "q2-experience",
    part: 2,
    topicId: "p2-experience",
    question: "Describe an important experience in your life.\n\nYou should say:\n• What happened\n• When it happened\n• Who was involved\n• And explain why it was important",
    prepTime: 60,
    speakTime: 120,
    audioUrl: "correct.mp3",
  },
  
  // Part 3 - Discussion (4-5 minutes) - AUDIO ONLY
  {
    id: "q3-discussion",
    part: 3,
    topicId: "p3-discussion",
    question: "", // No text question - examiner will ask via audio
    prepTime: 0,
    speakTime: 300, // 5 minutes total
    audioUrl: "correct.mp3", // BACKEND: Replace with actual Part 3 audio file
  },
];

// Mock full test with all 3 parts
export const FULL_TEST_QUESTIONS: SpeakingQuestion[] = [
  // Part 1 - Introduction (4-5 minutes) - AUDIO ONLY
  {
    id: "test-p1",
    part: 1,
    question: "", // Examiner asks via audio
    prepTime: 0,
    speakTime: 300,
    audioUrl: "correct.mp3", // BACKEND: Replace with actual exam audio
  },
  
  // Part 2 - Long turn (1 min prep + 2 min speak) - TEXT PROVIDED
  {
    id: "test-p2",
    part: 2,
    question: "Describe a book you have recently read.\n\nYou should say:\n• What the book was about\n• When you read it\n• Why you chose to read it\n• And explain what you learned from it",
    prepTime: 60,
    speakTime: 120,
    audioUrl: "correct.mp3",
  },
  
  // Part 3 - Discussion (4-5 minutes) - AUDIO ONLY
  {
    id: "test-p3",
    part: 3,
    question: "", // Examiner asks via audio
    prepTime: 0,
    speakTime: 300,
    audioUrl: "correct.mp3", // BACKEND: Replace with actual exam audio
  },
];

// Break time between parts (in seconds)
export const BREAK_TIME = 10;
