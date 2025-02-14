"use client";

import { useState } from "react";
import { useMode } from "@/contexts/ModeContext";
import { Nav } from "@/components/navbar";
import { AbilitiesTab } from "@/components/shop/abilities-tab";
import { GiftsTab } from "@/components/shop/gifts-tab";
import { BoostsTab } from "@/components/shop/boosts-tab";

export default function ShopPage() {
  const { activeLighterColor, activeColor } = useMode();
  const [activeTab, setActiveTab] = useState<"abilities" | "gifts" | "boosts">(
    "abilities"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main
        className="flex-1 flex flex-col"
        style={{ backgroundColor: activeLighterColor }}
      >
        <div className="container py-8">
          <h1 className="text-4xl mb-4 text-black font-sans">Maya's Shop</h1>
          <div className="mb-4 flex space-x-4">
            <button
              onClick={() => setActiveTab("gifts")}
              className={`px-4 py-2 rounded-md font-bold transition-colors border-2 border-black
                ${
                  activeTab === "gifts" ? "text-black" : "text-black bg-white"
                }`}
              style={{
                backgroundColor:
                  activeTab === "gifts" ? activeColor : undefined,
              }}
            >
              Gifts
            </button>
            <button
              onClick={() => setActiveTab("abilities")}
              className={`px-4 py-2 rounded-md font-bold transition-colors border-2 border-black
                ${
                  activeTab === "abilities"
                    ? "text-black"
                    : "text-black bg-white"
                }`}
              style={{
                backgroundColor:
                  activeTab === "abilities" ? activeColor : undefined,
              }}
            >
              Abilities
            </button>
            <button
              onClick={() => setActiveTab("boosts")}
              className={`px-4 py-2 rounded-md font-bold transition-colors border-2 border-black
                ${
                  activeTab === "boosts" ? "text-black" : "text-black bg-white"
                }`}
              style={{
                backgroundColor:
                  activeTab === "boosts" ? activeColor : undefined,
              }}
            >
              Boosts
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pt-2">
          <div className="container pb-8">
            {activeTab === "abilities" && <AbilitiesTab />}
            {activeTab === "gifts" && <GiftsTab />}
            {activeTab === "boosts" && <BoostsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
