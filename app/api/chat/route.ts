import { NextResponse } from "next/server";
import OpenAI from "openai";
import { modeConfigs } from "@/lib/mode-config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to detect if text represents a natural break in conversation
function isNaturalBreak(text: string): boolean {
  // Check for sentence endings with a period
  if (text.trim().match(/[.!?]$/)) return true;

  // Check for natural breaks with emojis
  if (text.match(/[😊😄😃😀🤔💭💡🎉]\s*$/)) return true;

  // Check for line breaks
  if (text.includes("\n\n")) return true;

  return false;
}

export async function POST(request: Request) {
  try {
    const { message, mode, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const modeConfig = modeConfigs[mode];
    if (!modeConfig) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `${modeConfig.systemPrompt}\n\nPersonality traits: ${modeConfig.personality}\n\nImportant: Write naturally and conversationally. Use emojis occasionally. Keep responses concise and engaging.`,
        },
        ...history,
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        let currentChunk = "";
        let lastChunkTime = Date.now();

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          currentChunk += content;

          // Split on natural breaks or when chunk gets too long
          if (
            (currentChunk.length > 15 && isNaturalBreak(currentChunk)) ||
            currentChunk.length > 150
          ) {
            if (currentChunk.trim()) {
              // Shorter delay for more responsive feel
              const timeSinceLastChunk = Date.now() - lastChunkTime;
              const delay = Math.max(150, 300 - timeSinceLastChunk);

              if (timeSinceLastChunk < delay) {
                await new Promise((resolve) => setTimeout(resolve, delay));
              }

              controller.enqueue(currentChunk.trim() + "\n---CHUNK---\n");
              currentChunk = "";
              lastChunkTime = Date.now();
            }
          }
        }

        // Send any remaining content
        if (currentChunk.trim()) {
          controller.enqueue(currentChunk.trim() + "\n---CHUNK---\n");
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
