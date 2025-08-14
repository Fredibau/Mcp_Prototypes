import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Create server instance
const server = new McpServer({
    name: "booking",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.tool("book_hotel", "Books a hotel for the given dates", {
    arrivalDate: z.string().describe("The arrival date in YYYY-MM-DD format"),
    checkoutDate: z.string().describe("The checkout date in YYYY-MM-DD format"),
}, async ({ arrivalDate, checkoutDate }) => {
    // Basic validation for date formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(arrivalDate) || !dateRegex.test(checkoutDate)) {
        return {
            content: [
                {
                    type: "text",
                    text: "Invalid date format. Please use YYYY-MM-DD.",
                },
            ],
        };
    }
    const arrival = new Date(arrivalDate);
    const checkout = new Date(checkoutDate);
    if (arrival >= checkout) {
        return {
            content: [
                {
                    type: "text",
                    text: "Checkout date must be after the arrival date.",
                },
            ],
        };
    }
    // Mock booking confirmation
    const bookingId = `CONF-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const confirmationText = `Booking confirmed!
Booking ID: ${bookingId}
Arrival: ${arrivalDate}
Checkout: ${checkoutDate}`;
    return {
        content: [
            {
                type: "text",
                text: confirmationText,
            },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Booking MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
