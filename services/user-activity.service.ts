import { supabase } from "../lib/supabase";

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

export interface UserStreakData {
  currentStreak: number;
  longestStreak: number;
  todayActivity: UserActivity | null;
  weeklyActivity: UserActivity[];
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
  wordsThisWeek: number;
  studyTime: number; // total minutes
  accuracy: number;
  todayProgress: number; // percentage
  wordsToReview: number;
}

export class UserActivityService {
  // Cập nhật hoạt động của user
  static async updateActivity(params: {
    wordsLearned?: number;
    wordsReviewed?: number;
    exercisesCompleted?: number;
    studyTimeMinutes?: number;
    accuracyRate?: number;
    lessonCompleted?: boolean;
  }): Promise<UserActivity | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("upsert_user_activity", {
        target_user_id: user.user.id,
        target_date: new Date().toISOString().split("T")[0],
        new_words_learned: params.wordsLearned || 0,
        new_words_reviewed: params.wordsReviewed || 0,
        new_exercises_completed: params.exercisesCompleted || 0,
        new_study_time_minutes: params.studyTimeMinutes || 0,
        new_accuracy_rate: params.accuracyRate,
        new_lesson_completed: params.lessonCompleted || false,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating user activity:", error);
      throw error;
    }
  }

  // Lấy streak hiện tại của user
  static async getCurrentStreak(): Promise<number> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return 0;

      const { data, error } = await supabase.rpc("calculate_user_streak", {
        target_user_id: user.user.id,
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error("Error getting current streak:", error);
      return 0;
    }
  }

  // Lấy hoạt động hôm nay
  static async getTodayActivity(): Promise<UserActivity | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("user_activity")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("activity_date", today)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error("Error getting today activity:", error);
      return null;
    }
  }

  // Lấy hoạt động trong tuần
  static async getWeeklyActivity(): Promise<UserActivity[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Chủ nhật

      const { data, error } = await supabase
        .from("user_activity")
        .select("*")
        .eq("user_id", user.user.id)
        .gte("activity_date", startOfWeek.toISOString().split("T")[0])
        .order("activity_date", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting weekly activity:", error);
      return [];
    }
  }

  // Lấy longest streak
  static async getLongestStreak(): Promise<number> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return 0;

      // Lấy tất cả activity và tính longest streak
      const { data, error } = await supabase
        .from("user_activity")
        .select(
          "activity_date, words_learned, words_reviewed, exercises_completed"
        )
        .eq("user_id", user.user.id)
        .order("activity_date", { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return 0;

      let longestStreak = 0;
      let currentStreak = 0;
      let previousDate: Date | null = null;

      for (const activity of data) {
        const activityDate = new Date(activity.activity_date);
        const hasActivity =
          activity.words_learned > 0 ||
          activity.words_reviewed > 0 ||
          activity.exercises_completed > 0;

        if (hasActivity) {
          if (previousDate) {
            const dayDiff = Math.floor(
              (activityDate.getTime() - previousDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (dayDiff === 1) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }
          } else {
            currentStreak = 1;
          }

          longestStreak = Math.max(longestStreak, currentStreak);
          previousDate = activityDate;
        } else {
          currentStreak = 0;
        }
      }

      return longestStreak;
    } catch (error) {
      console.error("Error calculating longest streak:", error);
      return 0;
    }
  }

  // Lấy tổng số từ đã học
  static async getTotalWordsLearned(): Promise<number> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return 0;

      // Từ user_vocabularies
      const { count: vocabCount, error: vocabError } = await supabase
        .from("user_vocabularies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.user.id);

      if (vocabError) throw vocabError;

      // Từ activity (words_learned)
      const { data: activityData, error: activityError } = await supabase
        .from("user_activity")
        .select("words_learned")
        .eq("user_id", user.user.id);

      if (activityError) throw activityError;

      const activityWordsLearned =
        activityData?.reduce(
          (sum, activity) => sum + activity.words_learned,
          0
        ) || 0;

      // Lấy số lớn hơn (có thể từ vocabulary sẽ chính xác hơn)
      return Math.max(vocabCount || 0, activityWordsLearned);
    } catch (error) {
      console.error("Error getting total words learned:", error);
      return 0;
    }
  }

  // Lấy tất cả thống kê user
  static async getUserStats(): Promise<UserStats> {
    try {
      const [
        currentStreak,
        longestStreak,
        todayActivity,
        weeklyActivity,
        totalWords,
      ] = await Promise.all([
        this.getCurrentStreak(),
        this.getLongestStreak(),
        this.getTodayActivity(),
        this.getWeeklyActivity(),
        this.getTotalWordsLearned(),
      ]);

      // Tính words this week
      const wordsThisWeek = weeklyActivity.reduce(
        (sum, activity) => sum + activity.words_learned,
        0
      );

      // Tính total study time
      const { data: user } = await supabase.auth.getUser();
      const { data: allActivity } = await supabase
        .from("user_activity")
        .select("study_time_minutes")
        .eq("user_id", user?.user?.id || "");

      const studyTime =
        allActivity?.reduce(
          (sum, activity) => sum + activity.study_time_minutes,
          0
        ) || 0;

      // Tính accuracy trung bình
      const activitiesWithAccuracy =
        allActivity?.filter(a => a.study_time_minutes > 0) || [];
      const avgAccuracy =
        activitiesWithAccuracy.length > 0
          ? activitiesWithAccuracy.reduce(
              (sum, a) => sum + (a.study_time_minutes || 0),
              0
            ) / activitiesWithAccuracy.length
          : 0;

      // Tính today's progress (giả sử mục tiêu hàng ngày là 10 từ)
      const dailyGoal = 10;
      const todayProgress = todayActivity
        ? Math.min((todayActivity.words_learned / dailyGoal) * 100, 100)
        : 0;

      // Lấy số từ cần review (từ có last_reviewed cũ hơn 1 ngày)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { count: wordsToReview } = await supabase
        .from("user_vocabularies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.user?.id || "")
        .or(
          `last_reviewed.is.null,last_reviewed.lt.${
            yesterday.toISOString().split("T")[0]
          }`
        );

      return {
        currentStreak,
        longestStreak,
        totalWords,
        wordsThisWeek,
        studyTime,
        accuracy: Math.round(avgAccuracy),
        todayProgress: Math.round(todayProgress),
        wordsToReview: wordsToReview || 0,
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalWords: 0,
        wordsThisWeek: 0,
        studyTime: 0,
        accuracy: 0,
        todayProgress: 0,
        wordsToReview: 0,
      };
    }
  }

  // Lấy dữ liệu weekly progress cho chart
  static async getWeeklyProgressData(): Promise<
    {
      day: string;
      words: number;
      minutes: number;
      date: string;
    }[]
  > {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Chủ nhật

      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weeklyData = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        const dateString = currentDate.toISOString().split("T")[0];

        const { data: dayActivity } = await supabase
          .from("user_activity")
          .select("words_learned, study_time_minutes")
          .eq("user_id", user.user.id)
          .eq("activity_date", dateString)
          .single();

        weeklyData.push({
          day: weekDays[i],
          words: dayActivity?.words_learned || 0,
          minutes: dayActivity?.study_time_minutes || 0,
          date: dateString,
        });
      }

      return weeklyData;
    } catch (error) {
      console.error("Error getting weekly progress data:", error);
      return [
        { day: "Sun", words: 0, minutes: 0, date: "" },
        { day: "Mon", words: 0, minutes: 0, date: "" },
        { day: "Tue", words: 0, minutes: 0, date: "" },
        { day: "Wed", words: 0, minutes: 0, date: "" },
        { day: "Thu", words: 0, minutes: 0, date: "" },
        { day: "Fri", words: 0, minutes: 0, date: "" },
        { day: "Sat", words: 0, minutes: 0, date: "" },
      ];
    }
  }

  // Hook để track khi user hoàn thành một exercise
  static async trackExerciseCompletion(
    isCorrect: boolean,
    timeSpentMinutes: number = 1
  ) {
    try {
      await this.updateActivity({
        exercisesCompleted: 1,
        studyTimeMinutes: timeSpentMinutes,
        accuracyRate: isCorrect ? 100 : 0,
      });
    } catch (error) {
      console.error("Error tracking exercise completion:", error);
    }
  }

  // Hook để track khi user học từ mới
  static async trackWordLearned() {
    try {
      await this.updateActivity({
        wordsLearned: 1,
      });
    } catch (error) {
      console.error("Error tracking word learned:", error);
    }
  }

  // Hook để track khi user review từ
  static async trackWordReviewed() {
    try {
      await this.updateActivity({
        wordsReviewed: 1,
      });
    } catch (error) {
      console.error("Error tracking word reviewed:", error);
    }
  }

  // Hook để track khi user hoàn thành lesson
  static async trackLessonCompletion(
    accuracyRate: number,
    timeSpentMinutes: number,
    wordsCount: number = 5
  ) {
    try {
      await this.updateActivity({
        wordsLearned: wordsCount, // Sử dụng số từ thực tế
        lessonCompleted: true,
        accuracyRate,
        studyTimeMinutes: timeSpentMinutes,
      });
    } catch (error) {
      console.error("Error tracking lesson completion:", error);
    }
  }

  // Lấy monthly progress cho goals
  static async getMonthlyProgress(): Promise<{
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
  }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return {
          currentMonth: { wordsLearned: 0, goal: 200, percentage: 0 },
          streakGoal: { currentStreak: 0, goal: 30, percentage: 0 },
        };
      }

      // Lấy đầu tháng hiện tại
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Lấy words learned trong tháng này
      const { data: monthlyActivity } = await supabase
        .from("user_activity")
        .select("words_learned")
        .eq("user_id", user.user.id)
        .gte("activity_date", startOfMonth.toISOString().split("T")[0]);

      const wordsThisMonth =
        monthlyActivity?.reduce(
          (sum, activity) => sum + activity.words_learned,
          0
        ) || 0;

      // Lấy current streak
      const currentStreak = await this.getCurrentStreak();

      // Goals
      const monthlyGoal = 200; // words per month
      const streakGoal = 30; // days

      return {
        currentMonth: {
          wordsLearned: wordsThisMonth,
          goal: monthlyGoal,
          percentage: Math.round((wordsThisMonth / monthlyGoal) * 100),
        },
        streakGoal: {
          currentStreak,
          goal: streakGoal,
          percentage: Math.round((currentStreak / streakGoal) * 100),
        },
      };
    } catch (error) {
      console.error("Error getting monthly progress:", error);
      return {
        currentMonth: { wordsLearned: 0, goal: 200, percentage: 0 },
        streakGoal: { currentStreak: 0, goal: 30, percentage: 0 },
      };
    }
  }
}
