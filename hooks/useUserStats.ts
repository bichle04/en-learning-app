import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  UserActivityService,
  UserStats,
} from "../services/user-activity.service";

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalWords: 0,
    wordsThisWeek: 0,
    studyTime: 0,
    accuracy: 0,
    todayProgress: 0,
    wordsToReview: 0,
  });
  const [weeklyProgress, setWeeklyProgress] = useState<
    {
      day: string;
      words: number;
      minutes: number;
      date: string;
    }[]
  >([]);
  const [monthlyProgress, setMonthlyProgress] = useState<{
    currentMonth: {
      wordsLearned: number;
      goal: number;
      percentage: number;
    };
    streakGoal: {
      currentStreak: number;
      goal: number;
      percentage: number;
    };
  }>({
    currentMonth: { wordsLearned: 0, goal: 200, percentage: 0 },
    streakGoal: { currentStreak: 0, goal: 30, percentage: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    if (!user) {
      setStats({
        currentStreak: 0,
        longestStreak: 0,
        totalWords: 0,
        wordsThisWeek: 0,
        studyTime: 0,
        accuracy: 0,
        todayProgress: 0,
        wordsToReview: 0,
      });
      setWeeklyProgress([]);
      setMonthlyProgress({
        currentMonth: { wordsLearned: 0, goal: 200, percentage: 0 },
        streakGoal: { currentStreak: 0, goal: 30, percentage: 0 },
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [userStats, weeklyData, monthlyData] = await Promise.all([
        UserActivityService.getUserStats(),
        UserActivityService.getWeeklyProgressData(),
        UserActivityService.getMonthlyProgress(),
      ]);

      setStats(userStats);
      setWeeklyProgress(weeklyData);
      setMonthlyProgress(monthlyData);
    } catch (err) {
      console.error("Error fetching user stats:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Helper functions để update stats khi user thực hiện hoạt động
  const trackExerciseCompletion = useCallback(
    async (isCorrect: boolean, timeSpentMinutes: number = 1) => {
      if (!user) return;

      try {
        await UserActivityService.trackExerciseCompletion(
          isCorrect,
          timeSpentMinutes
        );
        // Refresh stats sau khi track
        refreshStats();
      } catch (err) {
        console.error("Error tracking exercise completion:", err);
      }
    },
    [user, refreshStats]
  );

  const trackWordLearned = useCallback(async () => {
    if (!user) return;

    try {
      await UserActivityService.trackWordLearned();
      refreshStats();
    } catch (err) {
      console.error("Error tracking word learned:", err);
    }
  }, [user, refreshStats]);

  const trackWordReviewed = useCallback(async () => {
    if (!user) return;

    try {
      await UserActivityService.trackWordReviewed();
      refreshStats();
    } catch (err) {
      console.error("Error tracking word reviewed:", err);
    }
  }, [user, refreshStats]);

  const trackLessonCompletion = useCallback(
    async (
      accuracyRate: number,
      timeSpentMinutes: number,
      wordsCount: number = 5
    ) => {
      if (!user) return;

      try {
        await UserActivityService.trackLessonCompletion(
          accuracyRate,
          timeSpentMinutes,
          wordsCount
        );
        refreshStats();
      } catch (err) {
        console.error("Error tracking lesson completion:", err);
      }
    },
    [user, refreshStats]
  );

  return {
    stats,
    weeklyProgress,
    monthlyProgress,
    loading,
    error,
    refreshStats,
    trackExerciseCompletion,
    trackWordLearned,
    trackWordReviewed,
    trackLessonCompletion,
  };
};
