import { Exercise, ExerciseType, Word } from "@/types/lesson";

export const generateExercises = (currentWords: Word[]): Exercise[] => {
  if (!currentWords || currentWords.length === 0) return [];

  const exercises: Exercise[] = [];
  const exerciseTypes: ExerciseType[] = [
    "multiple-choice",
    "fill-blank",
    "word-order",
    "word-definition-matching",
  ];

  currentWords.forEach(word => {
    // Add 2-3 different exercise types per word
    const selectedTypes = [...exerciseTypes]
      .sort(() => Math.random() - 0.5)
      .slice(0, 1);

    selectedTypes.forEach(type => {
      switch (type) {
        case "flashcard":
          exercises.push({ type, word });
          break;
        case "multiple-choice":
          const otherWords = currentWords.filter(w => w.word !== word.word);
          const wrongOptions = otherWords.slice(0, 3).map(w => w.definition);
          const options = [word.definition, ...wrongOptions].sort(
            () => Math.random() - 0.5
          );
          exercises.push({
            type,
            word,
            options,
            correctAnswer: word.definition,
          });
          break;
        case "fill-blank":
          const sentence = word.example;
          const blankedSentence = sentence.replace(
            new RegExp(word.word, "gi"),
            "______"
          );
          const otherWordsForOptions = currentWords.filter(
            w => w.word !== word.word
          );
          const fillOptions = [
            word.word,
            ...otherWordsForOptions.slice(0, 3).map(w => w.word),
          ].sort(() => Math.random() - 0.5);
          exercises.push({
            type,
            word,
            blankedSentence,
            correctAnswer: word.word,
            options: fillOptions,
            ipaHint: word.pronunciation,
          });
          break;
        case "word-order":
          const exampleSentence = word.example;
          const wordsInSentence = exampleSentence.split(" ");
          const shuffledWords = [...wordsInSentence].sort(
            () => Math.random() - 0.5
          );
          exercises.push({
            type,
            word,
            shuffledWords,
            originalSentence: exampleSentence,
            correctAnswer: exampleSentence,
          });
          break;
        case "listening":
          exercises.push({ type, word });
          break;
        case "spelling":
          exercises.push({ type, word, correctAnswer: word.word });
          break;
        case "word-definition-matching":
          // For matching exercise, we need multiple words
          // Get 3 other words to create a set of 4 for matching
          const otherMatchingWords = currentWords
            .filter(w => w.word !== word.word)
            .slice(0, 3);
          
          const matchingPairs = [
            {
              word: word.word,
              definition: word.definition,
              pronunciation: word.pronunciation,
            },
            ...otherMatchingWords.map(w => ({
              word: w.word,
              definition: w.definition,
              pronunciation: w.pronunciation,
            })),
          ];

          exercises.push({
            type,
            word,
            matchingPairs,
            options: matchingPairs.map(pair => pair.definition),
          });
          break;
      }
    });
  });

  return exercises.sort(() => Math.random() - 0.5); // Shuffle exercises
};