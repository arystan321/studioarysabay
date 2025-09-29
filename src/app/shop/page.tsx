"use client";

import { useGameStore } from "@/hooks/use-game-store";
import { SHOP_ACCESSORIES } from "@/lib/accessories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gem } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShopPage() {
  const { points, inventory, buyItem, spendPoints } = useGameStore();
  const { toast } = useToast();

  const handleBuy = (item: (typeof SHOP_ACCESSORIES)[0]) => {
    if (points >= item.price) {
      buyItem(item.id);
      spendPoints(item.price);
      toast({
        title: "Purchase Successful!",
        description: `You've bought the ${item.name}.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Not enough points!",
        description: "Complete more quizzes to earn points.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary-foreground tracking-tight">Accessory Shop</h1>
        <p className="text-muted-foreground">Style your pet with cool accessories!</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {SHOP_ACCESSORIES.map((item) => {
          const isOwned = inventory.includes(item.id);
          const canAfford = points >= item.price;
          const Icon = item.icon;

          return (
            <Card key={item.id} className="flex flex-col text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center gap-2">
                <div className="p-4 bg-secondary rounded-lg">
                  <Icon className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-center gap-1">
                  <Gem className="w-4 h-4 text-yellow-500"/>
                  <span className="font-bold text-lg">{item.price}</span>
                </div>
              </CardContent>
              <CardFooter>
                {isOwned ? (
                  <Badge variant="secondary" className="w-full justify-center">Owned</Badge>
                ) : (
                  <Button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className="w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Buy
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
