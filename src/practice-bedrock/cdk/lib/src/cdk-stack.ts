import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import { LambdaStack, ApiRestStack } from './infra/stacks';

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        /** ----------- S3 ----------- */

        const imagesBucket = new Bucket(this, 'imagesBucket', {
            bucketName: 'image-bucket-aws',
        });

        /** ----------- END S3 ----------- */

        /** ----------- Lambdas ----------- */

        const textLambda = new LambdaStack(scope, 'TextLambdaStack', {
            entryPoint: 'services/Summary.ts',
            lambdaName: 'TextLambda',
            policyActions: ['bedrock:InvokeModel'],
            runtime: Runtime.NODEJS_20_X,
        });

        const generateImageLambda = new LambdaStack(
            scope,
            'GenerateImageLambdaStack',
            {
                entryPoint: 'services/GenerateImage.ts',
                lambdaName: 'GenerateImageLambda',
                policyActions: ['bedrock:InvokeModel'],
                runtime: Runtime.NODEJS_20_X,
                environment: {
                    BUCKET_NAME: imagesBucket.bucketName,
                },
            }
        );

        imagesBucket.grantWrite(generateImageLambda.lambda);

        /** ----------- END Lambdas ----------- */

        /** ----------- API Gateways ----------- */

        new ApiRestStack(scope, 'BedRockApiRestStack', {
            apiGatewayName: 'BedRockApi',
            resourceConfigs: [
                {
                    path: 'image',
                    methods: ['POST'],
                    lambdaIntegration: generateImageLambda.lambdaIntegration,
                },
                {
                    path: 'text',
                    methods: ['POST'],
                    lambdaIntegration: textLambda.lambdaIntegration,
                },
            ],
        });

        /** ----------- END API Gateways ----------- */
    }
}
