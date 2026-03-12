
"use client"

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, Edit2, PartyPopper, Calendar, ArrowRight } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

interface Event {
  id: string;
  name: string;
  date: string;
  description?: string;
  icon?: string;
  userId: string;
  createdAt: string;
}

interface CountdownCardProps {
  event: Event;
}

export function CountdownCard({ event }: CountdownCardProps) {
  const db = useFirestore();

  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(event.date));
  const createdAtDate = startOfDay(parseISO(event.createdAt));
  
  const daysRemaining = differenceInDays(eventDate, today);
  const isToday = daysRemaining === 0;
  const isPast = daysRemaining < 0;

  // Calculate progress
  const totalDuration = Math.max(differenceInDays(eventDate, createdAtDate), 1);
  const elapsed = differenceInDays(today, createdAtDate);
  const progress = isPast ? 100 : Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this countdown?')) {
      try {
        await deleteDoc(doc(db, 'users', event.userId, 'events', event.id));
        toast({ title: "Event deleted" });
      } catch (error) {
        toast({ title: "Failed to delete event", variant: "destructive" });
      }
    }
  };

  return (
    <Card className={`p-6 rounded-3xl border-none shadow-md overflow-hidden relative group transition-all hover:shadow-lg ${isToday ? 'bg-primary text-primary-foreground' : 'bg-white'}`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isToday ? 'bg-white/20' : 'bg-secondary'}`}>
              {event.icon || '📅'}
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg leading-tight">{event.name}</h3>
              <p className={`text-xs font-medium uppercase tracking-wider ${isToday ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
              <Link href={`/events/${event.id}/edit`}>
                <Edit2 className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 rounded-full text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="mb-6">
          {isToday ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <PartyPopper className="w-6 h-6 animate-bounce" />
                <span className="text-xl font-bold">Today is your event!</span>
              </div>
              <Button asChild variant="secondary" className="w-full rounded-xl">
                <Link href="/memories/new">
                  Save as Memory <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          ) : isPast ? (
            <div className="text-muted-foreground font-medium">This event has passed.</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{daysRemaining}</span>
                <span className="text-sm font-medium opacity-80">Days Remaining</span>
              </div>
              <Progress value={progress} className={`h-2 ${isToday ? 'bg-white/20' : 'bg-secondary'}`} />
            </div>
          )}
        </div>

        {event.description && !isToday && (
          <p className="text-sm text-muted-foreground line-clamp-2 italic border-t pt-4">
            {event.description}
          </p>
        )}
      </div>
      
      {isToday && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      )}
    </Card>
  );
}
