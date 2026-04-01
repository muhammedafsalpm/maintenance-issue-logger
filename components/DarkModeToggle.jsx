'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';

export default function DarkModeToggle() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme('system');
    }
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const setThemeValue = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        <button
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
          aria-label="Theme selector"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : theme === 'light' ? (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Laptop className="h-5 w-5 text-blue-500" />
          )}
        </button>
        
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={() => setThemeValue('light')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full ${theme === 'light' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              onClick={() => setThemeValue('dark')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full ${theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
            <button
              onClick={() => setThemeValue('system')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full ${theme === 'system' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Laptop className="h-4 w-4" />
              System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
