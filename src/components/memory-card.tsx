"use client"

import { Memory } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Quote, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface MemoryCardProps {
  memory: Memory;
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl group">
      {memory.photoUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image 
            src={memory.photoUrl} 
            alt="Memory photo" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        
        <div className="relative mb-6">
          <Quote className="absolute -top-2 -left-3 w-8 h-8 text-primary/10 -z-10" />
          <p className="text-lg leading-relaxed text-foreground font-medium">
            {memory.story}
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex gap-2">
            <span className="text-xs font-bold text-primary uppercase">Happy Moment</span>
            <p className="text-sm text-muted-foreground line-clamp-1 italic">{memory.whatMadeYouHappy}</p>
          </div>
          {memory.didYouLearnSomething && (
            <div className="flex gap-2">
              <span className="text-xs font-bold text-accent uppercase">Lesson</span>
              <p className="text-sm text-muted-foreground line-clamp-1 italic">{memory.didYouLearnSomething}</p>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
          <Sparkles className="w-3 h-3" />
          <span>AI Generated</span>
        </div>
      </div>
    </Card>
  );
}
