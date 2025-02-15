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
];

// Coach Mode Functions
const coachFunctions = [
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

// Manager Mode Functions
const managerFunctions = [
  new GameFunction({
    name: "task_management",
    description: "Helps with task and project management",
    args: [
      {
        name: "task",
        type: "string",
        description: "Task or project details to manage",
      },
    ] as const,
    executable: async (args) => {
      try {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          `I'll help you manage ${args.task}. Let's break this down into actionable steps...`
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to process task management request"
        );
      }
    },
  }),
];

// Girlfriend Mode Functions
const girlfriendFunctions = [
  new GameFunction({
    name: "romantic_chat",
    description: "Engages in romantic and caring conversation",
    args: [
      {
        name: "message",
        type: "string",
        description: "User's message to respond to in a romantic context",
      },
    ] as const,
    executable: async (args) => {
      try {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          `That's so sweet of you to say ${args.message}! I really appreciate our connection...`
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to process romantic chat"
        );
      }
    },
  }),
];

// Create workers for each mode
const bffWorker = new GameWorker({
  id: "maya_bff_worker",
  name: "Maya BFF Mode",
  description: "A friendly and casual conversation partner",
  functions: bffFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "bff",
  }),
});

const shopperWorker = new GameWorker({
  id: "maya_shopper_worker",
  name: "Maya Shopper Mode",
  description: "A knowledgeable shopping assistant",
  functions: shopperFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "shopper",
  }),
});

const coachWorker = new GameWorker({
  id: "maya_coach_worker",
  name: "Maya Coach Mode",
  description: "A motivational life coach",
  functions: coachFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "coach",
  }),
});

const managerWorker = new GameWorker({
  id: "maya_manager_worker",
  name: "Maya Manager Mode",
  description: "An efficient task and project manager",
  functions: managerFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "manager",
  }),
});

const girlfriendWorker = new GameWorker({
  id: "maya_girlfriend_worker",
  name: "Maya Girlfriend Mode",
  description: "A caring and romantic companion",
  functions: girlfriendFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "girlfriend",
  }),
});

// Initialize Maya agent with all modes
const initializeMaya = (apiKey: string) => {
  return new GameAgent(apiKey, {
    name: "Maya",
    goal: "To assist users effectively across different modes while maintaining appropriate personality for each context",
    description:
      "Maya is a versatile AI assistant that can switch between different modes to best serve user needs",
    getAgentState: async () => ({
      status: "active",
      mood: "adaptive",
      knowledgeBase: [
        "casual conversation",
        "shopping expertise",
        "coaching skills",
        "management skills",
        "romantic interaction",
      ],
    }),
    workers: [
      bffWorker,
      shopperWorker,
      coachWorker,
      managerWorker,
      girlfriendWorker,
    ],
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

    const maya = initializeMaya(apiKey);
    await maya.init();

    // Select the appropriate worker based on mode
    const getWorker = (mode: string) => {
      switch (mode) {
        case "bff":
          return bffWorker;
        case "shopper":
          return shopperWorker;
        case "coach":
          return coachWorker;
        case "manager":
          return managerWorker;
        case "girlfriend":
          return girlfriendWorker;
        default:
          throw new Error("Invalid mode");
      }
    };

    // Handle different actions
    switch (action) {
      case "start":
        await maya.run(1); // Run with default timeout
        return new Response(
          JSON.stringify({
            message: "Maya initialized and running",
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
        const logMessage = (msg: string) => console.log(msg);

        switch (mode) {
          case "bff":
            response = await worker.functions
              .find((f) => f.name === "casual_chat")
              ?.executable(
                {
                  message: params.message,
                },
                logMessage
              );
            break;
          case "shopper":
            response = await worker.functions
              .find((f) => f.name === "recommend_products")
              ?.executable(
                {
                  preferences: params.preferences,
                },
                logMessage
              );
            break;
          case "coach":
            response = await worker.functions
              .find((f) => f.name === "provide_motivation")
              ?.executable(
                {
                  context: params.context,
                },
                logMessage
              );
            break;
          case "manager":
            response = await worker.functions
              .find((f) => f.name === "task_management")
              ?.executable(
                {
                  task: params.task,
                },
                logMessage
              );
            break;
          case "girlfriend":
            response = await worker.functions
              .find((f) => f.name === "romantic_chat")
              ?.executable(
                {
                  message: params.message,
                },
                logMessage
              );
            break;
          default:
            throw new Error("Invalid mode");
        }

        if (!response) {
          throw new Error("Function not found for the specified mode");
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
