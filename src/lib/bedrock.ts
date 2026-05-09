import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

import { fromIni } from "@aws-sdk/credential-providers";

const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentials: fromIni({ profile: "ventryx" }), // 🔑 uses your SSO login
});

export async function callClaude(prompt: string) {
    try {
        const command = new InvokeModelCommand({
            modelId: "us.anthropic.claude-sonnet-4-6",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            }),
        });

        const response = await client.send(command);

        const decoded = new TextDecoder().decode(response.body);
        const parsed = JSON.parse(decoded);

        return parsed?.content?.[0]?.text || parsed;
    } catch (error) {
        console.error("Bedrock Error:", error);
        throw new Error("Failed to call Claude");
    }
}