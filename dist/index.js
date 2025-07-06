"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("@langchain/openai");
const agents_1 = require("langchain/agents");
const conektaChargeTool_1 = require("./tools/conektaChargeTool");
dotenv_1.default.config();
const run = async () => {
    const tools = [(0, conektaChargeTool_1.createConektaChargeTool)()];
    const model = new openai_1.ChatOpenAI({
        temperature: 0,
        openAIApiKey: process.env.OPENAI_API_KEY
    });
    const executor = await (0, agents_1.initializeAgentExecutorWithOptions)(tools, model, {
        agentType: "chat-zero-shot-react-description"
    });
    const input = `Cobra 150 pesos a Juan con la tarjeta tok_test_visa_4242. Email: juan@example.com, teléfono: 5555555555`;
    const result = await executor.call({ input });
    console.log("🔎 Resultado del agente:", result.output);
};
run().catch(console.error);
//# sourceMappingURL=index.js.map