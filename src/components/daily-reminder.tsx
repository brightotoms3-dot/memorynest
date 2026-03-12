
'use client';

import { useEffect, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';

export function DailyReminder() {
  const { user } = useUser();
  const db = useFirestore();
  const userProfileRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: userProfile } = useDoc(userProfileRef);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Request notification permissions on mount
    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };
    requestPermission();

    const checkTimeAndNotify = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Check if it's 7:00 PM (19:00)
      if (hours === 19 && minutes === 0) {
        const lastNotifiedDate = localStorage.getItem('last_notified_date');
        const todayDate = now.toDateString();

        if (lastNotifiedDate !== todayDate) {
          // Check if user already posted today
          const lastEntryDate = userProfile?.lastEntryDate ? new Date(userProfile.lastEntryDate).toDateString() : null;
          const hasPostedToday = lastEntryDate === todayDate;

          if (!hasPostedToday) {
            const currentStreak = userProfile?.currentStreak || 0;
            const streakWarning = currentStreak > 0 
              ? `Your ${currentStreak} day streak is about to break! Write today's memory.` 
              : "How did your day go? It's time to capture your beautiful moments.";

            // Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('MemoryNest Reminder 🦜', {
                body: streakWarning,
              });
            }

            // Show in-app toast notification as a persistent "alarm"
            toast({
              title: currentStreak > 0 ? "Keep the flame alive! 🔥" : "How did your day go?",
              description: streakWarning,
              duration: 30000,
            });

            // Mark as notified for today
            localStorage.setItem('last_notified_date', todayDate);
          }
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeAndNotify, 60000);
    
    // Initial check
    checkTimeAndNotify();

    return () => clearInterval(interval);
  }, [userProfile]);

  return null;
}
