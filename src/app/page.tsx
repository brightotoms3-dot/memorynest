"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Clock, ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  // If user is already logged in, we can optionally redirect them
  // or just change the CTA buttons. Let's update the CTAs for a better UX.

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-headline font-bold text-primary">MemoryNest</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/premium" className="hover:text-primary transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <Button asChild className="bg-primary text-primary-foreground btn-hover-effect">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground btn-hover-effect">
                <Link href="/signup">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 lg:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Memory Journaling</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-headline font-bold mb-6 text-foreground leading-tight">
            Capture Your Life’s <span className="text-primary italic">Moments</span> in Seconds
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Save your daily memories and let our AI turn raw thoughts into beautiful, emotional stories you'll cherish forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {user ? (
              <Button size="lg" asChild className="h-14 px-8 text-lg btn-hover-effect">
                <Link href="/dashboard">Welcome Back, {user.displayName?.split(' ')[0] || 'User'}</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="h-14 px-8 text-lg btn-hover-effect">
                  <Link href="/signup">Start Journaling Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg btn-hover-effect">
                  <Link href="/login">View My Timeline</Link>
                </Button>
              </>
            )}
          </div>

          <div className="mt-20 w-full relative aspect-video max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            {heroImage && (
              <Image 
                src={heroImage.imageUrl} 
                alt={heroImage.description} 
                fill 
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-secondary/30 py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-8 glass-card rounded-3xl">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Quick Capture</h3>
              <p className="text-muted-foreground">Log what happened, how you felt, and what you learned in under 60 seconds.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 glass-card rounded-3xl">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">AI Storytelling</h3>
              <p className="text-muted-foreground">Our AI rewrites your raw notes into elegant, emotional narratives automatically.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 glass-card rounded-3xl">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4">Beautiful Timeline</h3>
              <p className="text-muted-foreground">Relive your life through a stunning chronological view of your personal stories.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 lg:p-20 text-primary-foreground relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-headline font-bold mb-6">Ready to preserve your legacy?</h2>
              <p className="text-xl opacity-90 mb-10 max-w-xl mx-auto">Join thousands of users who are turning simple days into lasting memories.</p>
              <Button size="lg" variant="secondary" asChild className="h-14 px-10 text-lg btn-hover-effect">
                <Link href={user ? "/dashboard" : "/signup"}>
                  {user ? "Back to Dashboard" : "Get Started for Free"} <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-headline font-bold text-lg">MemoryNest</span>
        </div>
        <div className="flex gap-8 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-primary">Terms</Link>
          <Link href="/privacy" className="hover:text-primary">Privacy</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </div>
        <p className="text-sm text-muted-foreground">© 2024 MemoryNest. All rights reserved.</p>
      </footer>
    </div>
  );
}
