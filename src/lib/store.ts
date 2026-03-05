"use client"

import { useState, useEffect } from 'react';

export interface Memory {
  id: string;
  date: string;
  whatHappened: string;
  whatMadeYouHappy: string;
  didYouLearnSomething?: string;
  story: string;
  photoUrl?: string;
}

export interface User {
  id: string;
  email: string;
  isPremium: boolean;
  name: string;
}

export const useStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('mn_user');
    const storedMemories = localStorage.getItem('mn_memories');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedMemories) setMemories(JSON.parse(storedMemories));
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      if (user) localStorage.setItem('mn_user', JSON.stringify(user));
      else localStorage.removeItem('mn_user');
      
      localStorage.setItem('mn_memories', JSON.stringify(memories));
    }
  }, [user, memories, isInitialized]);

  const login = (email: string, name: string) => {
    setUser({ id: Math.random().toString(36).substr(2, 9), email, name, isPremium: false });
  };

  const logout = () => {
    setUser(null);
  };

  const addMemory = (memory: Omit<Memory, 'id'>) => {
    const newMemory = { ...memory, id: Math.random().toString(36).substr(2, 9) };
    setMemories(prev => [newMemory, ...prev]);
    return newMemory;
  };

  const setPremium = (status: boolean) => {
    if (user) setUser({ ...user, isPremium: status });
  };

  return { user, memories, login, logout, addMemory, setPremium, isInitialized };
};
