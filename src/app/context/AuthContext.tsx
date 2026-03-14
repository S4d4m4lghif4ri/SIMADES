import React, { createContext, useContext, useState, ReactNode } from "react";
import { users, rolePermissions } from "../data/mockData";

interface User {
  user_id: string;
  nama: string;
  jabatan: string;
  role: string;
  email: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = users.find(u => u.email === email && u.password === password && u.status === "aktif");
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const hasPermission = (module: string): boolean => {
    if (!user) return false;
    const perms = rolePermissions[user.role] || [];
    return perms.includes(module);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
