/**
 * ADTreat MCP Server
 * Serves patient profile data for Alzheimer's grounding conversations
 * 
 * Run with: npm start
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getProfile, getValidPatientIds } from "./profiles.js";

// Create the MCP server
const server = new Server(
  {
    name: "adtreat-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_patient_profile",
        description: "Retrieves complete patient profile for Alzheimer's grounding conversation",
        inputSchema: {
          type: "object",
          properties: {
            patient_id: {
              type: "string",
              enum: ["margaret_chen", "robert_williams"],
              description: "Unique identifier for the patient"
            }
          },
          required: ["patient_id"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === "get_patient_profile") {
    const startTime = Date.now();
    const patientId = args?.patient_id;
    
    if (!patientId) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "patient_id is required",
              valid_ids: getValidPatientIds()
            })
          }
        ]
      };
    }
    
    const profile = getProfile(patientId);
    const responseTime = Date.now() - startTime;
    
    if (profile) {
      console.error(`[MCP] Retrieved profile for ${patientId} in ${responseTime}ms`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(profile)
          }
        ]
      };
    } else {
      console.error(`[MCP] Invalid patient_id: ${patientId}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: "Patient not found. Valid IDs: margaret_chen, robert_williams"
            })
          }
        ]
      };
    }
  }
  
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: `Unknown tool: ${name}` })
      }
    ]
  };
});

// Start the server
async function main() {
  const startTime = Date.now();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  
  const startupTime = Date.now() - startTime;
  console.error(`[MCP] ADTreat MCP Server started in ${startupTime}ms`);
  console.error(`[MCP] Available patients: ${getValidPatientIds().join(", ")}`);
}

main().catch((error) => {
  console.error("[MCP] Fatal error:", error);
  process.exit(1);
});
