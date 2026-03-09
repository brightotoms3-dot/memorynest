"use client"

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Check, Crown, Sparkles, Download, Calendar, Bird, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useMemo } from 'react';

export default function PremiumPage() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userProfileRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: userProfile, loading: profileLoading } = useDoc(userProfileRef);

  const handleUpgrade = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    window.open("https://paystack.shop/pay/0gzglif70o", "_blank");
    
    toast({ 
      title: "Opening Payment Page", 
      description: "Complete your payment at Paystack to unlock premium features." 
    });
  };

  const simulateUpgrade = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { isPremium: true });
      toast({ title: "Welcome to Premium!", description: "You now have unlimited access to all features." });
      router.push('/dashboard');
    } catch (error) {
      toast({ variant: 'destructive', title: "Upgrade failed", description: "Please try again later." });
    }
  };

  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const isPremium = userProfile?.isPremium || false;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-20">
        <div className="text-center mb-16 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
            <Bird className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-headline font-bold">Choose Your Journey</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Unlock the full potential of your memories with our Premium features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 rounded-[2.5rem] border-none shadow-xl flex flex-col hover:shadow-2xl transition-shadow">
            <CardHeader className="p-0 mb-8">
              <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Basic</p>
              <CardTitle className="text-4xl font-headline font-bold">Free</CardTitle>
              <p className="text-muted-foreground">Perfect for getting started.</p>
            </CardHeader>
            <CardContent className="p-0 flex-1 space-y-6">
              <ul className="space-y-4 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Up to 30 memories per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>AI Story Generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Basic Timeline View</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-0 pt-10">
              <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold cursor-default opacity-50" disabled>
                {isPremium ? 'Basic Plan' : 'Your Current Plan'}
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
              <p className="text-white/80 font-medium">Everything you need to preserve your legacy.</p>
            </CardHeader>
            <CardContent className="p-0 flex-1 space-y-6 relative z-10 font-medium">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>Unlimited monthly memories</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Premium AI Narrative Models</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Annual AI Story Recap</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <span>Export all memories</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-0 pt-10 relative z-10 flex flex-col gap-4">
              <Button 
                onClick={handleUpgrade}
                variant="secondary" 
                className="w-full h-14 rounded-2xl text-lg font-bold btn-hover-effect shadow-xl"
                disabled={isPremium}
              >
                {isPremium ? 'Already Premium' : (
                  <>
                    Pay with Paystack <ExternalLink className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
              {!isPremium && (
                <Button 
                  onClick={simulateUpgrade}
                  variant="ghost" 
                  className="w-full text-xs text-white/60 hover:text-white hover:bg-white/10"
                >
                  (Dev) Simulate Success
                </Button>
              )}
            </CardFooter>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32 blur-3xl" />
          </Card>
        </div>
      </main>
    </div>
  );
}
