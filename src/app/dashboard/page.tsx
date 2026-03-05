"use client"

import { useStore } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { MemoryCard } from '@/components/memory-card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon, Filter, Crown, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, memories, isInitialized } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Hello, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground text-lg">You have captured {memories.length} beautiful memories so far.</p>
          </div>
          <Button asChild className="h-14 px-8 text-lg rounded-2xl shadow-lg btn-hover-effect bg-primary">
            <Link href="/memories/new">
              <Plus className="mr-2 w-5 h-5" /> Add Today's Memory
            </Link>
          </Button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                Your Timeline
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
              </div>
            </div>

            {memories.length === 0 ? (
              <Card className="border-dashed border-2 bg-secondary/10 flex flex-col items-center justify-center py-20 px-10 text-center rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-6">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-2">Your nest is empty</h3>
                <p className="text-muted-foreground mb-8 max-w-sm">Start your journey by capturing your first memory today. Our AI will help you tell the story.</p>
                <Button asChild size="lg" className="rounded-2xl px-10">
                  <Link href="/memories/new">Write My First Entry</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid gap-8">
                {memories.map(memory => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Stats / Premium */}
          <div className="space-y-8">
            <Card className="p-6 rounded-3xl border-none shadow-md bg-primary text-primary-foreground relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-headline font-bold">Plan Details</h3>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                    {user.isPremium ? 'Premium' : 'Free'}
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-sm opacity-80">Monthly Limit</span>
                    <span className="text-2xl font-bold">{memories.length} / 30</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-1000" 
                      style={{ width: `${Math.min((memories.length / 30) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                {!user.isPremium && (
                  <Button variant="secondary" asChild className="w-full rounded-2xl h-12 btn-hover-effect">
                    <Link href="/premium">
                      <Crown className="w-4 h-4 mr-2 text-amber-500" /> Upgrade to Premium
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
                  <p className="text-sm text-muted-foreground mb-1">Consistency</p>
                  <p className="text-2xl font-bold">12 Day Streak</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Happy Moments</p>
                  <p className="text-2xl font-bold">24 Captured</p>
                </div>
              </div>
              
              <Button 
                className="w-full rounded-2xl h-12 bg-accent text-accent-foreground btn-hover-effect"
                disabled={!user.isPremium}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Generate Year Recap
              </Button>
              {!user.isPremium && (
                <p className="text-xs text-center text-muted-foreground">Yearly recaps are a premium feature.</p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
