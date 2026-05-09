import { callClaude } from "./src/lib/bedrock";

(async () => {
    try {
        const res = await callClaude("Say hello from AWS Bedrock");
        console.log("Response:", res);
    } catch (err) {
        console.error("Error:", err);
    }
})();