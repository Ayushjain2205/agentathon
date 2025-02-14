"use client";

import { useState } from "react";
import Image from "next/image";
import { CoinsIcon } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import { formatUnits, parseUnits } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { client } from "@/lib/thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { Loader2 } from "lucide-react";

const TOKEN_CONTRACT = getContract({
  client,
  address: "0x56467937CF1AC84e0bcfbe5E4Ae012877b1aC5D2",
  chain: avalancheFuji,
});

interface ShopCardProps {
  item: {
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

export function ShopCard({ item }: ShopCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { activeColor } = useMode();
  const { toast } = useToast();
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const { data: balance } = useReadContract({
    contract: TOKEN_CONTRACT,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  const handlePurchase = async () => {
    if (!account?.address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const userBalance = balance ? Number(formatUnits(balance, 18)) : 0;
    if (userBalance < item.price) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough coins to purchase this item",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPurchasing(true);
      // For now, we'll just burn the tokens as a simple purchase mechanism
      const transaction = prepareContractCall({
        contract: TOKEN_CONTRACT,
        method: "function burn(uint256 amount)",
        params: [parseUnits(item.price.toString(), 18)],
      });

      await sendTransaction(transaction);
      // Wait for one block confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "✨ Item Minted Successfully! 🎉",
        description: `Your ${item.name} has been minted to your collection 🌟`,
      });
    } catch (error) {
      console.error("Error purchasing item:", error);
      toast({
        title: "Error",
        description: "Failed to complete the purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div
      className="relative bg-white border-2 border-black rounded-md shadow-brutal overflow-hidden transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? "translateY(-5px)" : "translateY(0)" }}
    >
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        width={300}
        height={300}
        className="w-full h-40 object-contain"
      />
      <div className="p-2">
        <h3 className="text-sm font-bold truncate text-black">{item.name}</h3>
      </div>
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-75 p-4 flex flex-col justify-center transition-opacity duration-300 ease-in-out">
          <p className="text-sm text-white">{item.description}</p>
        </div>
      )}
      <button
        onClick={handlePurchase}
        disabled={isPurchasing}
        className="absolute bottom-2 right-2 flex items-center px-3 py-2 rounded-md font-bold transition-colors text-black border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: activeColor }}
      >
        {isPurchasing ? (
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
        ) : (
          <CoinsIcon className="w-4 h-4 mr-1" />
        )}
        <span>{item.price}</span>
      </button>
    </div>
  );
}
