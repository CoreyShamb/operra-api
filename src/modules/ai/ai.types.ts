export type AiGenerateRequestBody = {
    prompt: string;
};

export type AiGenerateResponse = {
    success: true;
    data: {
        output: string;
        modelId: string;
    };
};