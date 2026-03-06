"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createMemoryStory } from '@/ai/flows/create-memory-story';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, ArrowLeft, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NewMemoryPage() {
  const [whatHappened, setWhatHappened] = useState('');
  const [whatMadeYouHappy, setWhatMadeYouHappy] = useState('');
  const [didYouLearnSomething, setDidYouLearnSomething] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!whatHappened || !whatMadeYouHappy) {
      toast({ title: "Please fill in the required fields", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await createMemoryStory({
        whatHappened,
        whatMadeYouHappy,
        didYouLearnSomething: didYouLearnSomething || undefined,
      });

      const memoriesRef = collection(db, 'users', user.uid, 'memories');
      const memoryData = {
        date: new Date().toISOString(),
        whatHappened,
        whatMadeYouHappy,
        didYouLearnSomething: didYouLearnSomething || "",
        story: result.story,
        photoUrl: photoUrl || `https://picsum.photos/seed/${Math.random()}/600/400`,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      // Firestore mutation
      addDoc(memoriesRef, memoryData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: memoriesRef.path,
            operation: 'create',
            requestResourceData: memoryData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({ title: "Memory created beautifully!" });
      router.push('/dashboard');
    } catch (error) {
      toast({ title: "Failed to generate story", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
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
      
      <main className="max-w-3xl mx-auto px-6 pt-10">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 hover:text-primary">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Timeline
        </Button>

        <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-10 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <CardTitle className="text-4xl font-headline font-bold mb-2">Capture Today</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">Tell us about your day, and we'll handle the storytelling.</CardDescription>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="happened" className="text-lg font-bold">What happened today? *</Label>
                <Textarea 
                  id="happened"
                  placeholder="e.g. I went for a long hike in the morning and then met an old friend for lunch..."
                  className="min-h-[120px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6 focus-visible:ring-primary"
                  required
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="happy" className="text-lg font-bold">What made you happy today? *</Label>
                <Textarea 
                  id="happy"
                  placeholder="e.g. The warm sun on my face and catching up on old memories."
                  className="min-h-[100px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6 focus-visible:ring-primary"
                  required
                  value={whatMadeYouHappy}
                  onChange={(e) => setWhatMadeYouHappy(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="learned" className="text-lg font-bold">Did you learn something today? (Optional)</Label>
                <Textarea 
                  id="learned"
                  placeholder="e.g. I realized that taking breaks is just as important as working hard."
                  className="min-h-[100px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6 focus-visible:ring-primary"
                  value={didYouLearnSomething}
                  onChange={(e) => setDidYouLearnSomething(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-bold">Add a photo (Optional)</Label>
                <div 
                  className="border-2 border-dashed border-muted rounded-3xl p-10 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => !isGenerating && setPhotoUrl(`https://picsum.photos/seed/${Math.random()}/600/400`)}
                >
                  {photoUrl ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                      <Image src={photoUrl} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold">Change Photo</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Click to upload or drag a photo here</p>
                    </>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-16 text-xl rounded-2xl btn-hover-effect shadow-xl bg-primary"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 w-6 h-6 animate-spin" /> Weaving your story...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-6 h-6" /> Create Memory
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
