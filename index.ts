import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { createConektaChargeTool } from "./tools/conektaChargeTool";

dotenv.config();

const run = async () => {
  const tools = [createConektaChargeTool()];
  const model = new ChatOpenAI({ 
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "chat-zero-shot-react-description"
  });

  const input = `Cobra 150 pesos a Juan con la tarjeta tok_test_visa_4242. Email: juan@example.com, teléfono: 5555555555`;

  const result = await executor.call({ input });
  console.log("🔎 Resultado del agente:", result.output);
};

run().catch(console.error);
