"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createMemoryStory } from '@/ai/flows/create-memory-story';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Bird, Loader2, ArrowLeft, Camera, Upload, X, Mic, MicOff, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NewMemoryPage() {
  const [whatHappened, setWhatHappened] = useState('');
  const [whatMadeYouHappy, setWhatMadeYouHappy] = useState('');
  const [didYouLearnSomething, setDidYouLearnSomething] = useState('');
  const [photoDataUri, setPhotoDataUri] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMic, setActiveMic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 2MB.", variant: "destructive" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startListening = (field: 'happened' | 'happy' | 'learned') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({ 
        title: "Voice Not Supported", 
        description: "Your browser doesn't support voice dictation. Try using Chrome or Safari.", 
        variant: "destructive" 
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setActiveMic(field);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'happened') setWhatHappened(prev => prev + (prev ? ' ' : '') + transcript);
      if (field === 'happy') setWhatMadeYouHappy(prev => prev + (prev ? ' ' : '') + transcript);
      if (field === 'learned') setDidYouLearnSomething(prev => prev + (prev ? ' ' : '') + transcript);
      toast({ title: "Captured your voice!" });
    };

    recognition.onerror = (event: any) => {
      setActiveMic(null);
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        toast({ title: "Microphone error", description: event.error, variant: "destructive" });
      }
    };

    recognition.onend = () => {
      setActiveMic(null);
    };

    recognition.start();
  };

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
        photoDataUri: photoDataUri || undefined,
      });

      const memoriesRef = collection(db, 'users', user.uid, 'memories');
      const memoryData = {
        date: new Date().toISOString(),
        whatHappened,
        whatMadeYouHappy,
        didYouLearnSomething: didYouLearnSomething || "",
        story: result.story,
        photoUrl: photoDataUri || `https://picsum.photos/seed/${Math.random()}/600/400`,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

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
                <Bird className="w-8 h-8" />
              </div>
              <CardTitle className="text-4xl font-headline font-bold mb-2">Capture Today</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">Speak or type your day. We'll tell the story.</CardDescription>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="happened" className="text-lg font-bold">What happened today? *</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-full h-10 w-10 p-0 ${activeMic === 'happened' ? 'bg-red-100 text-red-500 animate-pulse' : 'text-primary'}`}
                    onClick={() => startListening('happened')}
                  >
                    {activeMic === 'happened' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                </div>
                <Textarea 
                  id="happened"
                  placeholder="Tell me what you did today..."
                  className="min-h-[100px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6 focus-visible:ring-primary"
                  required
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="happy" className="text-lg font-bold">What made you happy? *</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-full h-10 w-10 p-0 ${activeMic === 'happy' ? 'bg-red-100 text-red-500 animate-pulse' : 'text-primary'}`}
                    onClick={() => startListening('happy')}
                  >
                    {activeMic === 'happy' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                </div>
                <Textarea 
                  id="happy"
                  placeholder="What was the best part?"
                  className="min-h-[80px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6 focus-visible:ring-primary"
                  required
                  value={whatMadeYouHappy}
                  onChange={(e) => setWhatMadeYouHappy(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="learned" className="text-lg font-bold">Any quick lessons? (Optional)</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-full h-10 w-10 p-0 ${activeMic === 'learned' ? 'bg-red-100 text-red-500 animate-pulse' : 'text-primary'}`}
                    onClick={() => startListening('learned')}
                  >
                    {activeMic === 'learned' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                </div>
                <Textarea 
                  id="learned"
                  placeholder="Did you learn something new?"
                  className="min-h-[80px] rounded-2xl bg-secondary/30 border-none text-lg resize-none p-6 focus-visible:ring-primary"
                  value={didYouLearnSomething}
                  onChange={(e) => setDidYouLearnSomething(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-bold">Add a photo (Optional)</Label>
                  {photoDataUri && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setPhotoDataUri('')}
                      className="text-destructive hover:text-destructive h-8 px-2"
                    >
                      <X className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  className="border-2 border-dashed border-muted rounded-3xl p-6 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => !isGenerating && fileInputRef.current?.click()}
                >
                  {photoDataUri ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <img src={photoDataUri} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="text-white w-8 h-8" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground font-medium">Add a photo from your phone</p>
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
                    <Loader2 className="mr-2 w-6 h-6 animate-spin" /> Writing your story...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-6 h-6" /> Save Memory
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
