"use client";

import { useGameStore } from "@/hooks/use-game-store";
import { Gem, Heart } from "lucide-react";
import { HealthBar } from "./health-bar";
import Link from "next/link";

export function AppHeader() {
  const { points, health } = useGameStore();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm shrink-0 z-10">
      <Link href="/" className="text-2xl font-bold font-headline text-primary-foreground">
        QuizPet
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1">
          <Gem className="h-5 w-5 text-yellow-500" />
          <span className="font-bold text-lg text-secondary-foreground">{points}</span>
        </div>
        <div className="flex items-center gap-2">
           <Heart className="h-5 w-5 text-red-500" />
           <div className="w-20">
             <HealthBar health={health} />
           </div>
        </div>
      </div>
    </header>
  );
}
