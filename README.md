# MCP Server Prototypes

This directory contains several Model-Context-Protocol (MCP) server prototypes. Each subdirectory is a separate Node.js project.

## Prerequisites

- [Cursor](https://cursor.sh/) must be installed to use these MCP servers with full functionality.

## Servers

- **`booking/`**: An MCP server for managing hotel bookings.
- **`registry/`**: An MCP server that acts as a registry for other MCP servers.
- **`weather/`**: An MCP server that provides weather information.

## Setup and Usage

Each server is a separate Node.js project with its own `package.json` file. To build each server, navigate to its directory and run `npm install` followed by `npm run build`.

### Registry Server

The `registry` server acts as a central registry for other MCP servers. It reads a `servers.json` file to know which servers are available and provides their addresses upon request.

### Booking Server

The `booking` server provides tools for managing hotel bookings.

### Weather Server

The `weather` server provides weather information for a given location.

### MCP Configuration

To use the MCP servers, you need to configure your `mcp.json` file. An example configuration is provided below:

```json
{
  "mcpServers": {
    "registry": {
      "command": "node",
      "args": ["<path-to-repository>/Mcp_Prototypes/registry/build/index.js"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "<path-to-user-directory>/.cursor"
      ]
    }
  }
}
```

Replace `<path-to-repository>` and `<path-to-user-directory>` with the actual paths on your system.

### Adding Servers Dynamically

Once you have the `registry` and `filesystem` servers configured, you can dynamically add other servers to your `mcp.json` file.

For example, to add the booking server, you would give a prompt like the following to your AI assistant:

```
Using the mcp server registry, find all the servers. Then, find the one which lets me book hotels. Finally, use the file server mcp to add it to my mcp.json file.
```

Once the server is installed, you can make a request like the following to book a hotel:

```
Book me a hotel from 13.08.2025 to 16.08.2025.
```
