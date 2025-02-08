"use client";

import { useState } from "react";
import { Message } from "./message";
import { ChatInput } from "./chat-input";
import { VoiceInterface } from "./voice-interface";
import { useMode } from "@/contexts/ModeContext";

export function ChatInterface() {
  const { activeColor, activeLighterColor } = useMode();
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi! I'm Zoey. How can I help you today?",
      isUser: false,
    },
  ]);
  const [isCallMode, setIsCallMode] = useState(false);

  const handleSendMessage = (content: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), content, isUser: true }]);
    // Here you would typically also handle the AI response
  };

  const toggleCallMode = () => {
    setIsCallMode(!isCallMode);
  };

  return (
    <div
      className="flex-1 flex flex-col h-[calc(100vh-64px)]"
      style={{ backgroundColor: activeLighterColor }}
    >
      {isCallMode ? (
        <VoiceInterface onEndCall={toggleCallMode} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                activeColor={activeColor}
              />
            ))}
          </div>
          <ChatInput onSend={handleSendMessage} onCallStart={toggleCallMode} />
        </>
      )}
    </div>
  );
}
