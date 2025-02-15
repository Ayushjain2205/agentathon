import { useState } from "react";

type MayaMode = "bff" | "shopper" | "coach" | "manager" | "girlfriend";

export const useMaya = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<MayaMode>("bff");

  const initializeMaya = async (mode: MayaMode) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/maya", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start",
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize Maya");
      }

      setCurrentMode(mode);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const chat = async (params: Record<string, string>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/maya", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "chat",
          mode: currentMode,
          params,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to chat with Maya");
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializeMaya,
    chat,
    currentMode,
    isLoading,
    error,
  };
};
