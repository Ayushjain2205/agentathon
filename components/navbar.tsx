"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Rubik_Doodle_Shadow } from "next/font/google";
import { useMode } from "@/contexts/ModeContext";
import { User, CoinsIcon as Coin, Copy } from "lucide-react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb";
import {
  useActiveAccount,
  useActiveWallet,
  useSendTransaction,
  useReadContract,
  useConnect,
} from "thirdweb/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { avalancheFuji } from "thirdweb/chains";
import { getContract, prepareContractCall } from "thirdweb";
import { formatUnits, parseUnits } from "ethers";
import { useToast } from "@/hooks/use-toast";

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  weight: "400",
  subsets: ["latin"],
});

const navItems = [
  { name: "Shop", href: "/shop" },
  { name: "Memory", href: "/memory" },
];

const wallets = [
  inAppWallet({
    smartAccount: {
      chain: avalancheFuji,
      sponsorGas: true,
    },
  }),
];

const modeIcons = {
  bff: "https://img.icons8.com/wired/64/friends.png",
  manager: "https://img.icons8.com/wired/64/briefcase.png",
  coach: "https://img.icons8.com/wired/64/dumbbell.png",
  shopper: "https://img.icons8.com/wired/64/shopping-cart.png",
  girlfriend: "https://img.icons8.com/wired/64/like--v1.png",
};

const TOKEN_CONTRACT = getContract({
  client,
  address: "0x56467937CF1AC84e0bcfbe5E4Ae012877b1aC5D2",
  chain: avalancheFuji,
});

// Separate client component for wallet functionality
function WalletButton() {
  const router = useRouter();
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { mutate: sendTransaction } = useSendTransaction();
  const { connect } = useConnect({ client });
  const { toast } = useToast();

  const mintTokens = async (isInitial = false) => {
    if (!account?.address) return;

    if (isInitial) {
      const lastMintDate = localStorage.getItem("lastMintDate");
      const today = new Date().toDateString();

      if (lastMintDate === today) {
        return; // Already minted today
      }
    }

    try {
      const transaction = prepareContractCall({
        contract: TOKEN_CONTRACT,
        method: "function mintTo(address to, uint256 amount)",
        params: [account.address, parseUnits("1000", 18)],
      });

      const tx = await sendTransaction(transaction);
      // Wait for one block confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (isInitial) {
        localStorage.setItem("lastMintDate", new Date().toDateString());
      }

      toast({
        title: "Success! 🎉",
        description: "1000 tokens have been minted to your wallet",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error minting tokens:", error);
      toast({
        title: "Error",
        description: "Failed to mint tokens. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (account?.address) {
      mintTokens(true); // Pass true for initial mint check
    }
  }, [account?.address]);

  const handleLogout = async () => {
    try {
      if (activeWallet) {
        await activeWallet.disconnect();
      }
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
    }
  };

  if (account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 bg-white border-2 border-black rounded-full shadow-brutal hover:bg-gray-50 focus:outline-none">
          <User className="w-6 h-6 text-black" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border-2 border-black rounded-lg shadow-brutal">
          <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer">
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer flex items-center justify-between"
            onClick={copyAddress}
          >
            <span className="text-sm font-mono">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
            <Copy className="h-4 w-4 ml-2" />
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-black" />
          <DropdownMenuItem
            className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer"
            onClick={() => mintTokens(false)}
          >
            Get 1000 Tokens
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-black" />
          <div className="p-2">
            <ConnectButton client={client} />
          </div>
          <DropdownMenuSeparator className="bg-black" />
          <DropdownMenuItem
            className="hover:bg-gray-100 focus:bg-gray-100 focus:outline-none cursor-pointer"
            onClick={handleLogout}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="h-[48px] bg-white hover:bg-gray-50 border-2 border-black rounded-md shadow-brutal overflow-hidden">
      <ConnectButton client={client} />
    </div>
  );
}

function CoinsDisplay() {
  const account = useActiveAccount();
  const { data: balance } = useReadContract({
    contract: TOKEN_CONTRACT,
    method: "function balanceOf(address account) view returns (uint256)",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  if (!account) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full shadow-brutal">
      <Coin className="w-6 h-6 text-black" />
      <span className="text-lg font-bold">
        {balance && account?.address
          ? Number(formatUnits(balance, 18)).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : "..."}
      </span>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { activeMode, activeColor, activeLightColor } = useMode();

  return (
    <nav
      className="w-full h-16 border-b-2 border-black transition-colors duration-300 ease-in-out"
      style={{ backgroundColor: activeLightColor }}
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span
              className={`text-4xl font-bold ${rubikDoodleShadow.className} text-black`}
            >
              MAYA
            </span>
            <img
              className="w-8 h-8"
              src={modeIcons[activeMode] || "/placeholder.svg"}
              alt={`${activeMode} mode icon`}
            />
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-lg font-display font-bold transition-colors border-2 border-black rounded-md hover:bg-opacity-80",
                  pathname === item.href
                    ? "text-black shadow-brutal"
                    : "bg-white text-foreground hover:bg-gray-50"
                )}
                style={{
                  backgroundColor:
                    pathname === item.href ? activeColor : undefined,
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <CoinsDisplay />
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
