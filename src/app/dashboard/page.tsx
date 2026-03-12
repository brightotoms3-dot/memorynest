
"use client"

import { Navbar } from '@/components/navbar';
import { MemoryCard } from '@/components/memory-card';
import { CountdownCard } from '@/components/countdown-card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon, Filter, Crown, Bird, TrendingUp, Loader2, Sparkles, Flame, Trophy, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useUser, useCollection, useDoc, useFirestore } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  // Fetch user profile
  const userProfileRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: userProfile } = useDoc(userProfileRef);

  // Fetch memories
  const memoriesQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'memories'),
      orderBy('date', 'desc')
    );
  }, [db, user]);
  const { data: memories, loading: memoriesLoading } = useCollection(memoriesQuery);

  // Fetch countdown events
  const eventsQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(db, 'users', user.uid, 'events'),
      orderBy('date', 'asc')
    );
  }, [db, user]);
  const { data: events, loading: eventsLoading } = useCollection(eventsQuery);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const isPremium = userProfile?.isPremium || false;
  const displayName = userProfile?.name || user.displayName || 'User';
  const currentStreak = userProfile?.currentStreak || 0;
  const longestStreak = userProfile?.longestStreak || 0;

  const milestoneInfo = (streak: number) => {
    if (streak < 3) return { next: 3, label: "Next: Habit Starter 🌱", progress: (streak / 3) * 100 };
    if (streak < 7) return { next: 7, label: "Next: Consistency Badge 🏅", progress: (streak / 7) * 100 };
    if (streak < 30) return { next: 30, label: "Next: Memory Master 📖", progress: (streak / 30) * 100 };
    return { next: 100, label: "Next: Legendary Streak 🔥", progress: (streak / 100) * 100 };
  };
  const milestone = milestoneInfo(currentStreak);

  const hasEnteredToday = () => {
    if (!userProfile?.lastEntryDate) return false;
    return new Date(userProfile.lastEntryDate).toDateString() === new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Welcome back, {displayName.split(' ')[0]}!</h1>
            <p className="text-muted-foreground text-lg">Your diary has {memories.length} entries and {events.length} countdowns.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="h-14 px-6 rounded-2xl shadow-sm bg-white">
              <Link href="/events/new">
                <Clock className="mr-2 w-5 h-5 text-accent" /> New Countdown
              </Link>
            </Button>
            <Button asChild className="h-14 px-8 text-lg rounded-2xl shadow-lg btn-hover-effect bg-primary">
              <Link href="/memories/new">
                <Plus className="mr-2 w-5 h-5" /> New Diary Entry
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            {/* Streak Hero Section */}
            <Card className="p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-red-600 text-white border-none shadow-xl overflow-hidden relative">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
                    <Flame className={`w-12 h-12 ${currentStreak > 0 ? 'text-yellow-300 fill-yellow-300 animate-pulse' : 'text-white/40'}`} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold font-headline">{currentStreak} Day Streak</h2>
                    <p className="text-orange-100 font-medium mt-1">
                      {hasEnteredToday() ? "Streak safe for today! ✨" : "Write today's memory to keep your streak alive."}
                    </p>
                  </div>
                </div>
                <div className="bg-black/10 p-4 rounded-2xl backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Longest Streak</p>
                  <p className="text-2xl font-bold">{longestStreak} Days</p>
                </div>
              </div>
              <div className="mt-8 space-y-2 relative z-10">
                <div className="flex justify-between text-sm font-bold">
                  <span>{milestone.label}</span>
                  <span>{currentStreak} / {milestone.next}</span>
                </div>
                <Progress value={milestone.progress} className="h-3 bg-white/20" />
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            </Card>

            {/* Countdown Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                  <Clock className="w-6 h-6 text-accent" />
                  Your Countdowns
                </h2>
                {events.length > 0 && (
                  <Button asChild variant="ghost" size="sm" className="rounded-full">
                    <Link href="/events/new">Add Event</Link>
                  </Button>
                )}
              </div>

              {eventsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : events.length === 0 ? (
                <Card className="border-dashed border-2 bg-accent/5 flex flex-col items-center justify-center py-12 px-10 text-center rounded-3xl">
                  <h3 className="text-xl font-headline font-bold mb-2">No countdowns yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">Track birthdays, trips, or special days you're looking forward to.</p>
                  <Button asChild variant="outline" className="rounded-2xl border-accent text-accent hover:bg-accent hover:text-white">
                    <Link href="/events/new">Create Your First Countdown</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {events.map((event: any) => (
                    <CountdownCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>

            {/* Timeline Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  Your Timeline
                </h2>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
              </div>

              {memoriesLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : memories.length === 0 ? (
                <Card className="border-dashed border-2 bg-secondary/10 flex flex-col items-center justify-center py-20 px-10 text-center rounded-3xl">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-6">
                    <Bird className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-headline font-bold mb-2">Your diary is empty</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm">Start your journey by writing your first entry. I'll help you reflect on your day.</p>
                  <Button asChild size="lg" className="rounded-2xl px-10">
                    <Link href="/memories/new">Write My First Entry</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-8">
                  {memories.map((memory: any) => (
                    <MemoryCard key={memory.id} memory={memory} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <Card className="p-6 rounded-3xl border-none shadow-md bg-white space-y-6">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Achievements
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" /> Milestones
                  </p>
                  <ul className="text-sm space-y-2 font-medium">
                    <li className={`flex items-center gap-2 ${currentStreak >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-2 h-2 rounded-full ${currentStreak >= 3 ? 'bg-primary' : 'bg-muted'}`} /> 3 Days: Habit Starter 🌱
                    </li>
                    <li className={`flex items-center gap-2 ${currentStreak >= 7 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-2 h-2 rounded-full ${currentStreak >= 7 ? 'bg-primary' : 'bg-muted'}`} /> 7 Days: Consistency Badge 🏅
                    </li>
                    <li className={`flex items-center gap-2 ${currentStreak >= 30 ? 'text-primary' : 'text-muted-foreground'}`}>
                      <div className={`w-2 h-2 rounded-full ${currentStreak >= 30 ? 'bg-primary' : 'bg-muted'}`} /> 30 Days: Memory Master 📖
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-none shadow-md bg-primary text-primary-foreground relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-headline font-bold">Plan Status</h3>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                    {isPremium ? 'Premium' : 'Free'}
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-80">Monthly Entries</span>
                    <span className="text-2xl font-bold">{memories.length} / 30</span>
                  </div>
                  <Progress value={Math.min((memories.length / 30) * 100, 100)} className="h-2 bg-white/20" />
                </div>
                {!isPremium && (
                  <Button variant="secondary" asChild className="w-full rounded-2xl h-12 btn-hover-effect">
                    <Link href="/premium">
                      <Crown className="w-4 h-4 mr-2 text-amber-500" /> Upgrade to Pro
                    </Link>
                  </Button>
                )}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            </Card>

            <Card className="p-6 rounded-3xl border-none shadow-md space-y-6">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Total Memories</p>
                  <p className="text-2xl font-bold">{memories.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Active Countdowns</p>
                  <p className="text-2xl font-bold">{events.filter((e: any) => new Date(e.date) >= new Date()).length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
