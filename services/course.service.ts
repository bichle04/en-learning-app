import { supabase } from "../lib/supabase";
import { Course, Word } from "../types/database";

export class CourseService {
  // Lấy tất cả courses
  static async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("id");

    if (error) throw error;
    return data || [];
  }

  // Lấy course theo ID
  static async getCourseById(id: number): Promise<Course | null> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Lấy words của course
  static async getWordsByCourseId(courseId: number): Promise<Word[]> {
    const { data, error } = await supabase
      .from("words")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");

    if (error) throw error;
    return data || [];
  }

  // Tạo course mới
  static async createCourse(
    course: Omit<Course, "id" | "created_at" | "updated_at">
  ): Promise<Course> {
    const { data, error } = await supabase
      .from("courses")
      .insert([course])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Tạo word mới
  static async createWord(
    word: Omit<Word, "id" | "created_at">
  ): Promise<Word> {
    const { data, error } = await supabase
      .from("words")
      .insert([word])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
