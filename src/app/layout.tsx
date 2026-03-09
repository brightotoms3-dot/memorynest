
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { DailyReminder } from '@/components/daily-reminder';

export const metadata: Metadata = {
  title: 'MemoryNest | AI Memory Journal',
  description: 'Capture your life\'s moments in seconds and turn them into beautiful stories with AI.',
  // These point to files you would need to add to your public/ folder
  icons: {
    icon: '/favicon.ico',
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
