"use client";

import { VirtualPet } from "@/components/virtual-pet";
import { useGameStore } from "@/hooks/use-game-store";
import { HealthBar } from "@/components/health-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function PetPage() {
  const { inventory, health } = useGameStore();

  return (
    <div className="container mx-auto flex h-full flex-col items-center justify-center gap-8 px-4">
      <VirtualPet equippedItems={inventory} />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Lightbulb className="h-6 w-6 text-yellow-400" />
            <span>Pet Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold text-muted-foreground">Pet Health</h3>
            <HealthBar health={health} />
          </div>
          <p className="text-sm text-center text-muted-foreground pt-4">
            Complete a quiz each day to keep your pet healthy and happy!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
