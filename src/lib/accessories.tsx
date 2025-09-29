import type { Accessory } from "./definitions";
import { Glasses, GraduationCap, PartyHat, Heart, VenetianMask } from "lucide-react";

// --- Accessory Components ---
const TopHatComponent = () => (
  <g transform="translate(65 20) scale(0.4)">
    <path d="M60,80 L60,30 Q60,10 80,10 L120,10 Q140,10 140,30 L140,80 Z" fill="black" />
    <path d="M40,80 L160,80 Q170,80 170,90 L30,90 Q30,80 40,80 Z" fill="black" />
  </g>
);

const SunglassesComponent = () => (
    <g transform="translate(68 85)">
      <path d="M0 0 H22 L20 15 H2 Z" fill="black" />
      <path d="M42 0 H64 L62 15 H44 Z" fill="black" />
      <path d="M22 5 H42" stroke="black" strokeWidth="2" />
    </g>
);

const BowTieComponent = () => (
    <g transform="translate(85 140) scale(0.3)">
        <path d="M0 0 L50 25 L0 50 Z" fill="hsl(var(--destructive))" stroke="black" strokeWidth="3" />
        <path d="M100 0 L50 25 L100 50 Z" fill="hsl(var(--destructive))" stroke="black" strokeWidth="3" />
        <circle cx="50" cy="25" r="10" fill="hsl(var(--destructive))" stroke="black" strokeWidth="3"/>
    </g>
)

// --- Shop List ---
export const SHOP_ACCESSORIES: Accessory[] = [
  {
    id: "top-hat",
    name: "Top Hat",
    price: 100,
    slot: "hat",
    component: TopHatComponent,
    icon: GraduationCap,
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    price: 75,
    slot: "face",
    component: SunglassesComponent,
    icon: Glasses,
  },
    {
    id: "bow-tie",
    name: "Bow Tie",
    price: 50,
    slot: "face",
    component: BowTieComponent,
    icon: VenetianMask,
  },
];

// --- Accessory Map for fast lookup ---
export const ACCESSORIES_MAP: { [key: string]: Accessory } = 
  SHOP_ACCESSORIES.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as { [key: string]: Accessory });
