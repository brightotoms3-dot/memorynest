"use client"

import { useStore } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Download, Calendar, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function PremiumPage() {
  const { user, setPremium } = useStore();
  const router = useRouter();

  const handleUpgrade = () => {
    setPremium(true);
    toast({ title: "Welcome to Premium!", description: "You now have unlimited access to all features." });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-headline font-bold">Choose Your Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of your memories with our Premium features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-xl flex flex-col">
            <CardHeader className="p-0 mb-8">
              <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Basic</p>
              <CardTitle className="text-4xl font-headline font-bold">Free</CardTitle>
              <p className="text-muted-foreground">Perfect for getting started.</p>
            </CardHeader>
            <CardContent className="p-0 flex-1 space-y-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Up to 30 memories per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>AI Story Generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Basic Timeline View</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-0 pt-10">
              <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold cursor-default opacity-50">
                {user?.isPremium ? 'Active Plan' : 'Your Current Plan'}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-2xl flex flex-col bg-primary text-primary-foreground relative overflow-hidden ring-4 ring-primary/20 scale-105 md:scale-110">
            <div className="absolute top-4 right-8 px-4 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
              Most Popular
            </div>
            <CardHeader className="p-0 mb-8 relative z-10">
              <p className="text-white/80 font-bold uppercase tracking-widest text-sm mb-2">Pro Journal</p>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-5xl font-headline font-bold">$9</CardTitle>
                <span className="opacity-80">/ month</span>
              </div>
              <p className="text-white/80">Everything you need to preserve your legacy.</p>
            </CardHeader>
            <CardContent className="p-0 flex-1 space-y-6 relative z-10">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Unlimited monthly memories</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Premium AI Narrative Models</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Annual AI Story Recap</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Export all memories as PDF/JSON</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-0 pt-10 relative z-10">
              <Button 
                onClick={handleUpgrade}
                variant="secondary" 
                className="w-full h-14 rounded-2xl text-lg font-bold btn-hover-effect shadow-xl"
              >
                {user?.isPremium ? 'Already Premium' : 'Upgrade to Premium'}
              </Button>
            </CardFooter>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32 blur-3xl" />
          </Card>
        </div>

        <section className="mt-32 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold mb-2">Unlimited Captures</h3>
              <p className="text-muted-foreground">Never worry about limits again. Record every small joy and major milestone without hesitation.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold mb-2">Yearly Recaps</h3>
              <p className="text-muted-foreground">Our AI synthesizes an entire year of memories into a cohesive, beautiful story you can share with family.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
