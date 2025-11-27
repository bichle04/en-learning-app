import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: Session | null;
  error: Error | null;
}

export class AuthService {
  // Đăng ký tài khoản mới
  static async signUp(
    email: string,
    password: string,
    fullName?: string
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      const user = data.user
        ? {
            id: data.user.id,
            email: data.user.email!,
            fullName: data.user.user_metadata?.full_name,
            avatarUrl: data.user.user_metadata?.avatar_url,
            createdAt: data.user.created_at,
          }
        : null;

      return { user, session: data.session, error: null };
    } catch (error) {
      return { user: null, session: null, error: error as Error };
    }
  }

  // Đăng nhập
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error };
      }

      const user = data.user
        ? {
            id: data.user.id,
            email: data.user.email!,
            fullName: data.user.user_metadata?.full_name,
            avatarUrl: data.user.user_metadata?.avatar_url,
            createdAt: data.user.created_at,
          }
        : null;

      return { user, session: data.session, error: null };
    } catch (error) {
      return { user: null, session: null, error: error as Error };
    }
  }

  // Đăng xuất
  static async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Lấy session hiện tại
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error("Error getting current session:", error);
      return null;
    }
  }

  // Lấy user hiện tại
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const user = data.user
        ? {
            id: data.user.id,
            email: data.user.email!,
            fullName: data.user.user_metadata?.full_name,
            avatarUrl: data.user.user_metadata?.avatar_url,
            createdAt: data.user.created_at,
          }
        : null;

      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Reset mật khẩu
  static async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "englearn://reset-password", // Sử dụng scheme của app
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Cập nhật mật khẩu
  static async updatePassword(
    newPassword: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Cập nhật thông tin user
  static async updateProfile(updates: {
    fullName?: string;
    avatarUrl?: string;
  }): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Lắng nghe thay đổi auth state
  static onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
