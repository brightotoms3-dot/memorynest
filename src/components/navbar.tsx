"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, LayoutDashboard, Crown, LogOut, User } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-lg font-headline font-bold text-primary">MemoryNest</span>
        </Link>
        <div className="hidden md:flex gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/premium" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <Crown className="w-4 h-4 text-amber-500" />
            Premium
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link href="/memories/new">Add Memory</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary uppercase">
                  {user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/premium" className="cursor-pointer">
                <Crown className="mr-2 h-4 w-4 text-amber-500" />
                <span>Premium Plans</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
