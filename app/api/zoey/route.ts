import {
  GameAgent,
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";

// BFF Mode Functions
const bffFunctions = [
  new GameFunction({
    name: "casual_chat",
    description: "Engages in friendly, casual conversation",
    args: [
      {
        name: "message",
        type: "string",
        description: "User's message to respond to",
      },
    ] as const,
    executable: async (args) => {
      try {
        // Implement casual conversation logic
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          `Hey! That's interesting what you said about ${args.message}. Let's chat more!`
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to process casual chat"
        );
      }
    },
  }),
];

// Shopper Mode Functions
const shopperFunctions = [
  new GameFunction({
    name: "recommend_products",
    description: "Recommends products based on user preferences",
    args: [
      {
        name: "preferences",
        type: "string",
        description: "User's shopping preferences and criteria",
      },
    ] as const,
    executable: async (args) => {
      try {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          `Based on your ${args.preferences}, I recommend checking out these items...`
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate recommendations"
        );
      }
    },
  }),
  new GameFunction({
    name: "compare_products",
    description: "Compares different products",
    args: [
      {
        name: "products",
        type: "string",
        description: "List of products to compare",
      },
    ] as const,
    executable: async (args) => {
      try {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          `Here's a detailed comparison of ${args.products}...`
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to compare products"
        );
      }
    },
  }),
];

// Coach Mode Functions
const coachFunctions = [
  new GameFunction({
    name: "set_goals",
    description: "Helps users set and track goals",
    args: [
      {
        name: "goalType",
        type: "string",
        description: "Type of goal to set",
      },
      {
        name: "timeframe",
        type: "string",
        description: "Timeframe for the goal",
      },
    ] as const,
    executable: async (args) => {
      try {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          `Let's set up your ${args.goalType} goal for the next ${args.timeframe}...`
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to set goals"
        );
      }
    },
  }),
  new GameFunction({
    name: "provide_motivation",
    description: "Provides motivational support",
    args: [
      {
        name: "context",
        type: "string",
        description: "Context for motivation",
      },
    ] as const,
    executable: async (args) => {
      try {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          `You've got this! Remember why you started ${args.context}...`
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to provide motivation"
        );
      }
    },
  }),
];

// Create workers for each mode
const bffWorker = new GameWorker({
  id: "zoey_bff_worker",
  name: "Zoey BFF Mode",
  description: "A friendly and casual conversation partner",
  functions: bffFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "bff",
  }),
});

const shopperWorker = new GameWorker({
  id: "zoey_shopper_worker",
  name: "Zoey Shopper Mode",
  description: "A knowledgeable shopping assistant",
  functions: shopperFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "shopper",
  }),
});

const coachWorker = new GameWorker({
  id: "zoey_coach_worker",
  name: "Zoey Coach Mode",
  description: "A motivational life coach",
  functions: coachFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "coach",
  }),
});

// Initialize Zoey agent with all modes
const initializeZoey = (apiKey: string) => {
  return new GameAgent(apiKey, {
    name: "Zoey",
    goal: "To assist users effectively across different modes while maintaining appropriate personality for each context",
    description:
      "Zoey is a versatile AI assistant that can switch between different modes to best serve user needs",
    getAgentState: async () => ({
      status: "active",
      mood: "adaptive",
      knowledgeBase: [
        "casual conversation",
        "shopping expertise",
        "coaching skills",
      ],
    }),
    workers: [bffWorker, shopperWorker, coachWorker],
  });
};

export async function POST(req: Request) {
  try {
    const { action, mode, params } = await req.json();
    const apiKey = process.env.GAME_API_KEY as string;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key is not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const zoey = initializeZoey(apiKey);
    await zoey.init();

    // Select the appropriate worker based on mode
    const getWorker = (mode: string) => {
      switch (mode) {
        case "bff":
          return bffWorker;
        case "shopper":
          return shopperWorker;
        case "coach":
          return coachWorker;
        default:
          throw new Error("Invalid mode");
      }
    };

    // Handle different actions
    switch (action) {
      case "start":
        await zoey.run();
        return new Response(
          JSON.stringify({
            message: "Zoey initialized and running",
            mode: mode || "default",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

      case "chat":
        const worker = getWorker(mode);
        let response;

        switch (mode) {
          case "bff":
            response = await worker.execute("casual_chat", {
              message: params.message,
            });
            break;
          case "shopper":
            response = await worker.execute("recommend_products", {
              preferences: params.preferences,
            });
            break;
          case "coach":
            response = await worker.execute("provide_motivation", {
              context: params.context,
            });
            break;
          default:
            throw new Error("Invalid mode");
        }

        return new Response(JSON.stringify({ message: response.feedback }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
