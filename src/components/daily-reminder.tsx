
'use client';

import { useEffect, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export function DailyReminder() {
  const { user } = useUser();
  const db = useFirestore();

  const userProfileRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: userProfile } = useDoc(userProfileRef);

  const eventsQuery = useMemo(() => {
    if (!user) return null;
    return query(collection(db, 'users', user.uid, 'events'));
  }, [db, user]);
  const { data: events } = useCollection(eventsQuery);

  useEffect(() => {
    if (typeof window === 'undefined') return;

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

      // Evening Streak Reminder (7:00 PM)
      if (hours === 19 && minutes === 0) {
        const lastNotifiedDate = localStorage.getItem('last_notified_streak');
        const todayDate = now.toDateString();

        if (lastNotifiedDate !== todayDate) {
          const lastEntryDate = userProfile?.lastEntryDate ? new Date(userProfile.lastEntryDate).toDateString() : null;
          const hasPostedToday = lastEntryDate === todayDate;

          if (!hasPostedToday) {
            const currentStreak = userProfile?.currentStreak || 0;
            const message = currentStreak > 0 
              ? `Your ${currentStreak} day streak is about to break! Write today's memory.` 
              : "How did your day go? It's time to capture your beautiful moments.";

            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('MemoryNest 🦜', { body: message });
            }

            toast({
              title: currentStreak > 0 ? "Keep the flame alive! 🔥" : "How did your day go?",
              description: message,
              duration: 30000,
            });

            localStorage.setItem('last_notified_streak', todayDate);
          }
        }
      }

      // Morning "Never Forget" Event Reminders (9:00 AM)
      if (hours === 9 && minutes === 0) {
        const lastNotifiedDate = localStorage.getItem('last_notified_events');
        const todayDate = now.toDateString();

        if (lastNotifiedDate !== todayDate && events.length > 0) {
          const todayStart = startOfDay(now);
          
          events.forEach((event: any) => {
            const eventDate = startOfDay(parseISO(event.date));
            const daysLeft = differenceInDays(eventDate, todayStart);

            // Never Forget Mode: 30, 7, 3, 1, and 0 days
            if ([0, 1, 3, 7, 30].includes(daysLeft)) {
              let message = "";
              if (daysLeft === 0) message = `Today is ${event.name}! 🥳 Capture this milestone.`;
              else if (daysLeft === 1) message = `${event.name} is tomorrow! 🎈`;
              else if (daysLeft === 30) message = `${event.name} is in 1 month! Time to start planning. 🗓️`;
              else message = `${event.name} is in ${daysLeft} days! ⏳`;

              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('MemoryNest 🦜', { body: message });
              }

              toast({
                title: "Never Forget Reminder 📅",
                description: message,
                duration: 15000,
              });
            }
          });

          localStorage.setItem('last_notified_events', todayDate);
        }
      }
    };

    const interval = setInterval(checkTimeAndNotify, 60000);
    checkTimeAndNotify();
    return () => clearInterval(interval);
  }, [userProfile, events]);

  return null;
}
