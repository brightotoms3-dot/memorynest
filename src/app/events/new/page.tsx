
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar, ArrowLeft, Loader2, PartyPopper } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const EMOJI_OPTIONS = ['🎂', '✈️', '💍', '🎓', '🏖️', '🏠', '🚗', '🎆', '🏀', '🎸', '💻', '💼'];

export default function NewEventPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📅');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name || !date) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const eventData = {
      name,
      date,
      description,
      icon,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    const eventsRef = collection(db, 'users', user.uid, 'events');
    
    addDoc(eventsRef, eventData)
      .then(() => {
        toast({ title: "Countdown created! 🎉" });
        router.push('/dashboard');
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: eventsRef.path,
          operation: 'create',
          requestResourceData: eventData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ title: "Failed to create event", variant: "destructive" });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10 pb-20">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 pt-10">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 hover:text-primary">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
        </Button>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-accent text-accent-foreground p-10 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="w-8 h-8" />
              </div>
              <CardTitle className="text-4xl font-headline font-bold mb-2">New Countdown</CardTitle>
              <CardDescription className="text-accent-foreground/80 text-lg">What exciting moment are you looking forward to?</CardDescription>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-bold">Event Name *</Label>
                <Input 
                  id="name"
                  placeholder="e.g. My Birthday, Summer Trip..."
                  className="h-14 rounded-2xl bg-secondary/30 border-none text-lg px-6 focus-visible:ring-accent"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="date" className="text-lg font-bold">Event Date *</Label>
                  <Input 
                    id="date"
                    type="date"
                    className="h-14 rounded-2xl bg-secondary/30 border-none text-lg px-6 focus-visible:ring-accent"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-lg font-bold">Pick an Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setIcon(e)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${icon === e ? 'bg-accent text-white scale-110 shadow-md' : 'bg-secondary/50 hover:bg-secondary'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-bold">Description (Optional)</Label>
                <Textarea 
                  id="description"
                  placeholder="Tell yourself something about this day..."
                  className="min-h-[100px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6 focus-visible:ring-accent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-16 text-xl rounded-2xl btn-hover-effect shadow-xl bg-accent hover:bg-accent/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-6 h-6 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    Start Countdown
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
