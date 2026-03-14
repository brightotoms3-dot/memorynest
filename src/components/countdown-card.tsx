"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, Edit2, PartyPopper, ArrowRight, Sparkles, Loader2, Gift } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { suggestGifts, type SuggestGiftsOutput } from '@/ai/flows/suggest-gifts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestGiftsOutput | null>(null);

  const today = startOfDay(new Date());
  const eventDate = startOfDay(parseISO(event.date));
  const createdAtDate = startOfDay(parseISO(event.createdAt));
  
  const daysRemaining = differenceInDays(eventDate, today);
  const isToday = daysRemaining === 0;
  const isPast = daysRemaining < 0;

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

  const handleSuggestGifts = async () => {
    setIsSuggesting(true);
    try {
      const result = await suggestGifts({
        eventName: event.name,
        description: event.description,
      });
      setSuggestions(result);
    } catch (error) {
      toast({ title: "AI couldn't generate ideas", variant: "destructive" });
    } finally {
      setIsSuggesting(false);
    }
  };

  const isGiftApplicable = daysRemaining <= 14 && daysRemaining > 0;

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
                <span className="text-xl font-bold">Today is the day!</span>
              </div>
              <Button asChild variant="secondary" className="w-full rounded-xl">
                <Link href="/memories/new">
                  Capture this Milestone <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          ) : isPast ? (
            <div className="text-muted-foreground font-medium">This event has passed.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{daysRemaining}</span>
                  <span className="text-sm font-medium opacity-80">Days Remaining</span>
                </div>
                {isGiftApplicable && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full h-8 px-3 text-xs bg-accent/10 border-accent text-accent hover:bg-accent hover:text-white"
                        onClick={handleSuggestGifts}
                      >
                        <Sparkles className="w-3 h-3 mr-1.5" /> Gift Ideas
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem] max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-accent" /> AI Gift Suggestions
                        </DialogTitle>
                        <DialogDescription>
                          Thoughtful ideas for {event.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {isSuggesting ? (
                          <div className="flex flex-col items-center justify-center py-8 space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                            <p className="text-sm text-muted-foreground">Asking the AI experts...</p>
                          </div>
                        ) : suggestions ? (
                          <>
                            <ul className="space-y-3">
                              {suggestions.suggestions.map((idea, i) => (
                                <li key={i} className="bg-secondary/30 p-3 rounded-2xl text-sm font-medium">
                                  {idea}
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-muted-foreground italic px-1">
                              {suggestions.reasoning}
                            </p>
                          </>
                        ) : null}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
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
