
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { DailyReminder } from '@/components/daily-reminder';

export const metadata: Metadata = {
  title: 'MemoryNest | AI Memory Journal',
  description: 'Capture your life\'s moments in seconds and turn them into beautiful stories with AI.',
  // Using an inline SVG for the favicon to ensure the Bird icon shows up in browser tabs immediately
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236366f1%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M16 7a3.5 3.5 0 0 0-3.5 3.5c1 .5 2 2.5 2 4.5.5 0 1.5-.5 1.5-2.5a3.5 3.5 0 0 0-3.5-3.5z%22/><path d=%22M9 7a3.5 3.5 0 0 1 3.5 3.5c-1 .5-2 2.5-2 4.5-.5 0-1.5-.5-1.5-2.5A3.5 3.5 0 0 1 9 7z%22/><path d=%22M12 12s1.5 0 2 1%22/><path d=%22M12 12s-1.5 0-2 1%22/><path d=%22M9 8c.5-1.5 1.5-2.5 3-2.5s2.5 1 3 2.5%22/><path d=%22M12 17.5c0 1.5 1 2 1 2%22/><path d=%22M12 17.5c0 1.5-1 2-1 2%22/><path d=%22M12 22s2-1 2-2.5%22/><path d=%22M12 22s-2-1-2-2.5%22/></svg>',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        {/* Theme color for mobile browser bars and splash screens */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          <DailyReminder />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
