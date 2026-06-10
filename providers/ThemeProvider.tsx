import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    card: string;
    text: string;
    textMuted: string;
    primary: string;
    primaryLight: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (systemScheme) {
      setTheme(systemScheme);
    }
  }, [systemScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc', // slate-900 / slate-50
    card: isDark ? '#1e293b' : '#ffffff', // slate-800 / white
    text: isDark ? '#f8fafc' : '#0f172a', // slate-50 / slate-900
    textMuted: isDark ? '#94a3b8' : '#64748b', // slate-400 / slate-505
    primary: '#f97316', // orange-500 (premium pizza vibe!)
    primaryLight: isDark ? '#2c1a0e' : '#ffedd5', // dark orange-shade / orange-100
    border: isDark ? '#334155' : '#e2e8f0', // slate-700 / slate-200
    success: '#22c55e', // green-500
    warning: '#eab308', // yellow-500
    danger: '#ef4444', // red-500
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
