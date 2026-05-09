import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "us-east-1",
});

const MODEL_ID =
    process.env.AWS_BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

export async function generateAiResponse(prompt: string) {
    if (!prompt || prompt.trim().length === 0) {
        throw new Error("Prompt is required");
    }

    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 500,
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    };

    const command = new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
    });

    const response = await bedrock.send(command);

    const decodedResponse = new TextDecoder().decode(response.body);
    const parsed = JSON.parse(decodedResponse);

    const output =
        parsed?.content?.[0]?.text || "No AI response was generated.";

    return {
        output,
        modelId: MODEL_ID,
    };
}