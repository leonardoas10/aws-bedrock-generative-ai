import { BedrockEmbeddings } from '@langchain/aws';
import { Bedrock } from '@langchain/community/llms/bedrock';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const AWS_REGION = 'us-east-1';

const model = new Bedrock({
    model: 'amazon.titan-text-express-v1',
    region: AWS_REGION,
});

const myData = [
    'The weather is nice today.',
    "Last night's game ended in a tie.",
    'Don likes to eat pizza.',
    'Don likes to eat pasta.',
    'Leonardo is a soccer player.',
];

const question = "What are Don's favorite foods and who is Leonardo?";

async function main() {
    const vectorStore = new MemoryVectorStore(
        new BedrockEmbeddings({
            region: AWS_REGION,
        })
    );
    await vectorStore.addDocuments(
        myData.map(
            (content) =>
                new Document({
                    pageContent: content,
                })
        )
    );
    const retriever = vectorStore.asRetriever({
        k: 5,
    });
    const results = await retriever.invoke(question);
    const resultList = results.map((result) => result.pageContent);

    console.log('resultList => ', resultList);

    //build template:
    const template = ChatPromptTemplate.fromMessages([
        [
            'system',
            'Based on the following context: {context}, answer the questions accurately without adding any additional information. ',
        ],
        ['user', '{input}'],
    ]);

    const chain = template.pipe(model);

    const response = await chain.invoke({
        input: question,
        context: resultList,
    });

    console.log(response);
}

main();
