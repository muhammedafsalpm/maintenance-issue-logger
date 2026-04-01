'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? (
        <Moon className="h-6 w-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
      ) : (
        <Sun className="h-6 w-6 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
      )}
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-2 py-1 rounded bg-slate-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
}
