import { DynamicTool } from "langchain/tools";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const createConektaChargeTool = () => {
  return new DynamicTool({
    name: "create_conekta_charge",
    description: "Crea un cargo en Conekta usando MCP. Input: JSON con customer_info, line_items, currency, payment_method (con type y token_id).",
    func: async (input: string) => {
      try {
        const payload = JSON.parse(input);
        const mcpBaseUrl = process.env.MCP_BASE_URL || "http://localhost:3000";
        
        // First create an order
        const orderResponse = await axios.post(`${mcpBaseUrl}/mcp/orders`, {
          currency: payload.currency || "MXN",
          customer_info: payload.customer_info,
          line_items: payload.line_items || [
            {
              name: "Cargo",
              unit_price: payload.amount || 10000,
              quantity: 1
            }
          ]
        });

        const orderId = orderResponse.data.id;

        // Then create a charge for the order
        const chargeResponse = await axios.post(`${mcpBaseUrl}/mcp/charges/${orderId}/charges`, {
          payment_method: payload.payment_method
        });

        return JSON.stringify({
          success: true,
          order: orderResponse.data,
          charge: chargeResponse.data
        });
      } catch (err: any) {
        return `Error al llamar a MCP: ${err.response?.data?.error || err.message}`;
      }
    }
  });
};
