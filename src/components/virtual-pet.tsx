"use client";

import { ACCESSORIES_MAP } from "@/lib/accessories";

type VirtualPetProps = {
  equippedItems: string[];
};

export function VirtualPet({ equippedItems }: VirtualPetProps) {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 select-none">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .pet-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full pet-float"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="180" rx="60" ry="10" fill="rgba(0,0,0,0.1)" />

        {/* Body */}
        <path
          d="M162.9,103.3c0,42.4-28.2,76.7-62.9,76.7S37.1,145.6,37.1,103.3S65.3,26.6,100,26.6S162.9,60.9,162.9,103.3Z"
          fill="hsl(var(--primary))"
        />

        {/* Eyes */}
        <circle cx="80" cy="95" r="8" fill="white" />
        <circle cx="120" cy="95" r="8" fill="white" />
        <circle cx="82" cy="97" r="4" fill="black" />
        <circle cx="122" cy="97" r="4" fill="black" />

        {/* Blush */}
        <ellipse cx="65" cy="115" rx="10" ry="6" fill="hsl(var(--primary) / 0.5)" opacity="0.6" />
        <ellipse cx="135" cy="115" rx="10" ry="6" fill="hsl(var(--primary) / 0.5)" opacity="0.6" />

        {/* Mouth */}
        <path
          d="M90,130 Q100,140 110,130"
          stroke="black"
          strokeWidth="2"
          fill="transparent"
          strokeLinecap="round"
        />

        {/* Accessory Slots */}
        <g id="hat-slot" transform="translate(0, 0)">
          {equippedItems
            .map(id => ACCESSORIES_MAP[id])
            .filter(item => item && item.slot === "hat")
            .map(item => {
              const AccessoryComponent = item.component;
              return <AccessoryComponent key={item.id} />;
            })}
        </g>
        <g id="face-slot" transform="translate(0, 0)">
          {equippedItems
            .map(id => ACCESSORIES_MAP[id])
            .filter(item => item && item.slot === "face")
            .map(item => {
              const AccessoryComponent = item.component;
              return <AccessoryComponent key={item.id} />;
            })}
        </g>
      </svg>
    </div>
  );
}
