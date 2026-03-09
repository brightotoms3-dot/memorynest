
'use client';

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

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
            new Notification('MemoryNest Reminder', {
              body: "It's 7 PM! Time to capture your beautiful moments for today.",
              icon: '/favicon.ico', // Fallback
            });
          }

          // Show in-app toast notification as an "alarm"
          toast({
            title: "Daily Memory Reminder",
            description: "It's 7:00 PM. Don't forget to nest your memories today!",
            duration: 10000, // Longer duration for the "alarm" feel
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
