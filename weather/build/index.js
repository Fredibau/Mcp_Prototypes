import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const OWM_API_BASE = "http://api.openweathermap.org/data/2.5/weather";
const API_KEY = "a38fb160740b821773491afcd8852e3d";
// Create server instance
const server = new McpServer({
    name: "weather",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// Helper function for making OpenWeatherMap API requests
async function makeOWMRequest(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json());
    }
    catch (error) {
        console.error("Error making OpenWeatherMap request:", error);
        return null;
    }
}
server.tool("get_current_weather", "Get the current weather for a city", {
    city: z.string().describe("The name of the city (e.g., London, Paris)"),
}, async ({ city }) => {
    const weatherUrl = `${OWM_API_BASE}?q=${city}&appid=${API_KEY}&units=metric`;
    const weatherData = await makeOWMRequest(weatherUrl);
    if (!weatherData) {
        return {
            content: [
                {
                    type: "text",
                    text: "Failed to retrieve weather data.",
                },
            ],
        };
    }
    if (!weatherData.weather || weatherData.weather.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `Could not find weather data for ${city}. Please check the city name.`,
                },
            ],
        };
    }
    const { weather, main, wind, name } = weatherData;
    const weatherDescription = weather[0].description;
    const formattedWeather = [
        `Current weather in ${name}:`,
        `Description: ${weatherDescription}`,
        `Temperature: ${main.temp}°C`,
        `Feels like: ${main.feels_like}°C`,
        `Humidity: ${main.humidity}%`,
        `Wind speed: ${wind.speed} m/s`,
    ].join("\n");
    return {
        content: [
            {
                type: "text",
                text: formattedWeather,
            },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
