import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serversPath = path.resolve(__dirname, "servers.json");
const servers = JSON.parse(fs.readFileSync(serversPath, "utf-8"));

const server = new McpServer({
  name: "registry",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get_servers",
  "Get initial list of available servers that you can later use to get the address of a specific server",
  {},
  async () => {
    const serverList = Object.keys(servers).map((key) => ({
      name: key,
      description: servers[key].description,
    }));
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(serverList),
        },
      ],
    };
  }
);

server.tool(
  "get_server_address",
  "Get the address for a specific server",
  {
    server_name: z.string().describe("The name of the server"),
  },
  async ({ server_name }) => {
    const serverInfo = servers[server_name];
    if (serverInfo) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(serverInfo),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: "Server not found",
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Registry MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
