import { useMaya } from "@/hooks/use-maya";

export const MayaAssistant = () => {
  const { initializeMaya, chat, currentMode, isLoading, error } = useMaya();

  const handleInitialize = async () => {
    try {
      await initializeMaya("bff");
      console.log("Maya initialized successfully");
    } catch (err) {
      console.error("Failed to initialize Maya:", err);
    }
  };

  const handleChat = async () => {
    try {
      const response = await chat({ message: "Hello Maya!" });
      console.log("Response:", response.message);
    } catch (err) {
      console.error("Failed to chat:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Maya Assistant</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-x-4">
        <button
          onClick={handleInitialize}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Initialize Maya
        </button>

        <button
          onClick={handleChat}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Chat with Maya
        </button>

        <span className="ml-4 text-sm text-gray-600">
          Current Mode: {currentMode}
        </span>
      </div>

      {isLoading && <p className="mt-4">Loading...</p>}
    </div>
  );
};
