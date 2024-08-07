import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
} from 'aws-lambda';
import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

const AWS_REGION = 'us-east-1';

const client = new BedrockRuntimeClient({
    region: AWS_REGION,
});

export async function handler(
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    const { body, queryStringParameters } = event;

    if (body) {
        const parsedBody = JSON.parse(event.body as string);
        const numberOfPoints = queryStringParameters?.points;

        if (parsedBody.text && numberOfPoints) {
            const text = parsedBody.text;
            const titanConfig = getTitanConfig(text, numberOfPoints);

            const response = await client.send(
                new InvokeModelCommand({
                    ...titanConfig,
                })
            );

            const responseBody = JSON.parse(
                new TextDecoder().decode(response.body)
            );
            const firstResult = responseBody.results[0];
            if (firstResult && firstResult.outputText) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        summary: firstResult.outputText,
                    }),
                };
            }
        }
    }
    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Invalid request body or query parameters',
        }),
    };
}

function getTitanConfig(text: string, points: string) {
    const prompt = `Text: ${text}\\n
        From the text above, summarize the story in ${points}.\\n
    `;

    return {
        modelId: 'amazon.titan-text-express-v1',
        body: JSON.stringify({
            inputText: prompt,
            textGenerationConfig: {
                maxTokenCount: 4096,
                stopSequences: [],
                temperature: 0,
                topP: 1,
            },
        }),
        accept: 'application/json',
        ContentType: 'application/json',
    };
}
