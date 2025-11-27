import { supabase } from "../lib/supabase";
import {
  CreateUserVocabulary,
  UpdateUserVocabulary,
  UserVocabulary,
} from "../types/database";

export class VocabularyService {
  // Lấy tất cả vocabulary của user
  static async getUserVocabularies(): Promise<UserVocabulary[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_vocabularies")
        .select("*")
        .eq("user_id", user.user.id)
        .order("date_added", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user vocabularies:", error);
      throw error;
    }
  }

  // Lấy vocabulary theo topic
  static async getVocabulariesByTopic(
    topic: string
  ): Promise<UserVocabulary[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_vocabularies")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("topic", topic)
        .order("date_added", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching vocabularies by topic:", error);
      throw error;
    }
  }

  // Lấy favorite vocabularies
  static async getFavoriteVocabularies(): Promise<UserVocabulary[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_vocabularies")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("is_favorite", true)
        .order("date_added", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching favorite vocabularies:", error);
      throw error;
    }
  }

  // Lấy vocabulary gần đây
  static async getRecentVocabularies(
    limit: number = 10
  ): Promise<UserVocabulary[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_vocabularies")
        .select("*")
        .eq("user_id", user.user.id)
        .order("date_added", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching recent vocabularies:", error);
      throw error;
    }
  }

  // Thêm vocabulary mới
  static async createVocabulary(
    vocabulary: CreateUserVocabulary
  ): Promise<UserVocabulary> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_vocabularies")
        .insert([
          {
            ...vocabulary,
            user_id: user.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating vocabulary:", error);
      throw error;
    }
  }

  // Cập nhật vocabulary
  static async updateVocabulary(
    id: string,
    updates: UpdateUserVocabulary
  ): Promise<UserVocabulary> {
    try {
      const { data, error } = await supabase
        .from("user_vocabularies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating vocabulary:", error);
      throw error;
    }
  }

  // Xóa vocabulary
  static async deleteVocabulary(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("user_vocabularies")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting vocabulary:", error);
      throw error;
    }
  }

  // Toggle favorite status
  static async toggleFavorite(
    id: string,
    isFavorite: boolean
  ): Promise<UserVocabulary> {
    try {
      const { data, error } = await supabase
        .from("user_vocabularies")
        .update({ is_favorite: isFavorite })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }

  // Cập nhật review stats
  static async updateReviewStats(id: string): Promise<UserVocabulary> {
    try {
      // First get the current review count
      const { data: currentData, error: fetchError } = await supabase
        .from("user_vocabularies")
        .select("review_count")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const newReviewCount = (currentData?.review_count || 0) + 1;

      const { data, error } = await supabase
        .from("user_vocabularies")
        .update({
          review_count: newReviewCount,
          last_reviewed: new Date().toISOString().split("T")[0],
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating review stats:", error);
      throw error;
    }
  }

  // Tìm kiếm vocabulary
  static async searchVocabularies(query: string): Promise<UserVocabulary[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_vocabularies")
        .select("*")
        .eq("user_id", user.user.id)
        .or(`word.ilike.%${query}%, definition.ilike.%${query}%`)
        .order("date_added", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching vocabularies:", error);
      throw error;
    }
  }

  // Lấy vocabulary cần review (chưa review nhiều)
  static async getVocabulariesForReview(): Promise<UserVocabulary[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_vocabularies")
        .select("*")
        .eq("user_id", user.user.id)
        .or("is_favorite.eq.true,review_count.lt.3")
        .order("last_reviewed", { ascending: true, nullsFirst: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching vocabularies for review:", error);
      throw error;
    }
  }

  // Lấy thống kê vocabulary của user
  static async getVocabularyStats(): Promise<{
    total: number;
    favorites: number;
    byTopic: { [topic: string]: number };
    recentlyAdded: number; // Trong 7 ngày qua
  }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      // Lấy tất cả vocabulary của user
      const { data: allVocabs, error } = await supabase
        .from("user_vocabularies")
        .select("topic, is_favorite, date_added")
        .eq("user_id", user.user.id);

      if (error) throw error;

      const stats = {
        total: allVocabs?.length || 0,
        favorites: 0,
        byTopic: {} as { [topic: string]: number },
        recentlyAdded: 0,
      };

      if (allVocabs) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        allVocabs.forEach(vocab => {
          // Count favorites
          if (vocab.is_favorite) {
            stats.favorites++;
          }

          // Count by topic
          const topic = vocab.topic || "Uncategorized";
          stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;

          // Count recently added
          if (new Date(vocab.date_added) >= sevenDaysAgo) {
            stats.recentlyAdded++;
          }
        });
      }

      return stats;
    } catch (error) {
      console.error("Error fetching vocabulary stats:", error);
      throw error;
    }
  }
}
