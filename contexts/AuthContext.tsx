import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService, AuthUser } from "../services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: {
    fullName?: string;
    avatarUrl?: string;
  }) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy session hiện tại khi app khởi động
    const getInitialSession = async () => {
      try {
        const currentSession = await AuthService.getCurrentSession();
        setSession(currentSession);

        if (currentSession) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Lắng nghe thay đổi auth state
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSession(session);

      if (session && event === "SIGNED_IN") {
        console.log("Loading1");
        const currentUser = await AuthService.getCurrentUser();
        console.log("user", currentUser);
        setUser(currentUser);
      } else if (!session) {
        console.log("Loading2");
        setUser(null);
      }
      setLoading(false);
      console.log("Loading3");
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signUp(email, password, fullName);

      if (result.error) {
        return { error: result.error };
      }

      // Session và user sẽ được cập nhật qua onAuthStateChange
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signIn(email, password);

      if (result.error) {
        return { error: result.error };
      }

      // Session và user sẽ được cập nhật qua onAuthStateChange
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const result = await AuthService.signOut();

      if (!result.error) {
        setUser(null);
        setSession(null);
      }

      return result;
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return AuthService.resetPassword(email);
  };

  const updateProfile = async (updates: {
    fullName?: string;
    avatarUrl?: string;
  }) => {
    setLoading(true); // Đặt loading trước khi cập nhật
    try {
      const result = await AuthService.updateProfile(updates);
      if (!result.error) {
        // Cập nhật user state local
        const updatedUser = await AuthService.getCurrentUser();
        setUser(updatedUser);
      }
      console.log("Result", result);
      return result;
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false); // Đảm bảo loading được đặt lại
    }
  };

    const updatePassword = async (newPassword: string) => {
    return AuthService.updatePassword(newPassword);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};