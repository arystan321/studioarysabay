"use client"
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/app-header';
import { BottomNav } from '@/components/bottom-nav';
import { useGameStore } from '@/hooks/use-game-store';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { checkDailyStatus } = useGameStore();

  useEffect(() => {
    checkDailyStatus();
  }, [checkDailyStatus]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <title>Analysis</title>
        <meta name="description" content="Learn new topics and care for your virtual pet!"/>
      </head>
      <body className="font-body antialiased">
        <div className="relative mx-auto flex h-dvh max-h-[1024px] w-full max-w-[480px] flex-col overflow-hidden bg-background shadow-2xl md:border-4 md:border-gray-800 md:rounded-[40px] md:h-[896px]">
          <AppHeader />
          <main className="flex-1 overflow-y-auto pb-20 pt-4">
            {children}
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
