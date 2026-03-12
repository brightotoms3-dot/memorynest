
"use client"

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EMOJI_OPTIONS = ['🎂', '✈️', '💍', '🎓', '🏖️', '🏠', '🚗', '🎆', '🏀', '🎸', '💻', '💼'];

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const router = useRouter();
  
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();

  const eventRef = useMemo(() => user ? doc(db, 'users', user.uid, 'events', eventId) : null, [db, user, eventId]);
  const { data: event, loading: eventLoading } = useDoc(eventRef);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📅');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDate(event.date);
      setDescription(event.description || '');
      setIcon(event.icon || '📅');
    }
  }, [event]);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !eventRef) return;

    setIsSubmitting(true);
    const updateData = { name, date, description, icon };

    updateDoc(eventRef, updateData)
      .then(() => {
        toast({ title: "Event updated" });
        router.push('/dashboard');
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: eventRef.path,
          operation: 'update',
          requestResourceData: updateData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (userLoading || eventLoading || !user) {
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
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-secondary text-secondary-foreground p-10 text-center">
            <Settings className="w-10 h-10 mx-auto mb-4" />
            <CardTitle className="text-3xl font-headline font-bold">Edit Countdown</CardTitle>
            <CardDescription>Update your special event details.</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-bold">Event Name *</Label>
                <Input 
                  id="name"
                  required
                  className="h-14 rounded-2xl bg-secondary/30 border-none text-lg px-6"
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
                    required
                    className="h-14 rounded-2xl bg-secondary/30 border-none text-lg px-6"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-lg font-bold">Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setIcon(e)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${icon === e ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-bold">Description</Label>
                <Textarea 
                  id="description"
                  className="min-h-[100px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-16 text-xl rounded-2xl btn-hover-effect"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
