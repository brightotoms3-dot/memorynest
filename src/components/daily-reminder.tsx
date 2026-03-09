
'use client';

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export function DailyReminder() {
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
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('MemoryNest Alarm', {
              body: "How did your day go? It's time to capture your beautiful moments.",
            });
          }

          // Show in-app toast notification as a persistent "alarm"
          toast({
            title: "How did your day go?",
            description: "It's 7:00 PM. Take a moment to say how your day went and save a memory.",
            duration: 30000, // 30 seconds for a persistent alarm feel
          });

          // Mark as notified for today
          localStorage.setItem('last_notified_date', todayDate);
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTimeAndNotify, 60000);
    
    // Initial check
    checkTimeAndNotify();

    return () => clearInterval(interval);
  }, []);

  return null;
}
