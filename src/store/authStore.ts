import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  groupId: string;
  groupName: string;
}

interface AuthState {
  token: string | null;
  attachmentToken: string | null; // Added field
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, attachmentToken: string, user: User) => void; // Updated signature
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("auth_token"),
  attachmentToken: localStorage.getItem("attachment_token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("auth_token"),

  setAuth: (token, attachmentToken, user) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("attachment_token", attachmentToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, attachmentToken, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("attachment_token");
    localStorage.removeItem("user");
    set({
      token: null,
      attachmentToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
