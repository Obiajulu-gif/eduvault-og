"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient, isSupabaseAuthEnabled } from "@/lib/supabase/client";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "eduvault-users";
const SESSION_KEY = "eduvault-session";

interface StoredUser extends AuthUser {
  password: string;
}

function mapSupabaseUser(user: SupabaseUser | null): AuthUser | null {
  if (!user?.email) return null;

  const fullName = typeof user.user_metadata?.full_name === "string"
    ? user.user_metadata.full_name.trim()
    : "";

  return {
    name: fullName || user.email.split("@")[0] || "User",
    email: user.email,
  };
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as StoredUser[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (supabase && isSupabaseAuthEnabled()) {
      let active = true;

      const loadSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;

        if (error) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(mapSupabaseUser(data.session?.user ?? null));
        setLoading(false);
      };

      void loadSession();

      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(mapSupabaseUser(session?.user ?? null));
        setLoading(false);
      });

      return () => {
        active = false;
        subscription.subscription.unsubscribe();
      };
    }

    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as AuthUser;
        if (parsed?.email) setUser(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }

    setLoading(false);
    return undefined;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (supabase && isSupabaseAuthEnabled()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };

      setUser(mapSupabaseUser(data.user ?? null));
      return { ok: true };
    }

    const users = readUsers();
    const match = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

    if (!match || match.password !== password) {
      return { ok: false, error: "Invalid email or password" };
    }

    const sessionUser: AuthUser = { name: match.name, email: match.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { ok: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const supabase = getSupabaseBrowserClient();
    if (supabase && isSupabaseAuthEnabled()) {
      const redirectTo = typeof window !== "undefined"
        ? `${window.location.origin}/verify-email?state=success`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: redirectTo,
        },
      });

      if (error) return { ok: false, error: error.message };

      if (data.session?.user) {
        setUser(mapSupabaseUser(data.session.user));
      }

      return { ok: true };
    }

    const users = readUsers();
    const existing = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { ok: false, error: "Account already exists" };
    }

    const newUser: StoredUser = { name, email, password };
    const next = [...users, newUser];
    writeUsers(next);

    const sessionUser: AuthUser = { name, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    const supabase = getSupabaseBrowserClient();
    if (supabase && isSupabaseAuthEnabled()) {
      void supabase.auth.signOut();
      setUser(null);
      return;
    }

    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
    }),
    [loading, login, logout, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
