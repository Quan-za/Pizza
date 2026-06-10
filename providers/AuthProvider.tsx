import React, { createContext, useContext, useState } from 'react';

type UserRole = 'user' | 'admin';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  address: string;
  phone: string;
  role: UserRole;
};

type AuthContextType = {
  user: UserProfile | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  login: (email: string, role: UserRole) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-782',
  name: 'Amos PizzaLover',
  email: 'amos@pizza.app',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  address: '123 Pepperoni Lane, Mozzarella Valley, CA 90210',
  phone: '+1 (555) 349-9277',
  role: 'user',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_PROFILE);

  const role = user?.role || 'user';

  const setRole = (newRole: UserRole) => {
    setUser((prev) => prev ? { ...prev, role: newRole } : null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  };

  const logout = () => {
    setUser(null);
  };

  const login = (email: string, selectedRole: UserRole) => {
    setUser({
      id: 'usr-' + Math.floor(Math.random() * 1000),
      name: email.split('@')[0],
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      address: '456 Garlic Crust Rd, Tomato Town, FL 33101',
      phone: '+1 (555) 999-8888',
      role: selectedRole,
    });
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, updateProfile, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
