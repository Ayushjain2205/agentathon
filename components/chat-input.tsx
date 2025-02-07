"use client";

import { Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useMode } from "@/contexts/ModeContext";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { activeColor, activeLightColor } = useMode();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div
      className="border-t-2 border-black p-4"
      style={{ backgroundColor: activeLightColor }}
    >
      <form onSubmit={handleSubmit} className="container mx-auto max-w-4xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          />
          <button
            type="submit"
            className="p-3 text-black border-2 border-black rounded-lg shadow-brutal hover:shadow-brutal-lg transition-shadow"
            style={{ backgroundColor: activeColor }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
