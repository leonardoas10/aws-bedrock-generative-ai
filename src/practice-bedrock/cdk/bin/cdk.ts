#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import {
    LambdaStack,
    ApiRestStack,
    S3BucketStack,
} from '../lib/src/infra/stacks';

const app = new cdk.App();

/** ----------- Lambdas ----------- */

const textLambda = new LambdaStack(app, 'TextLambdaStack', {
    entryPoint: 'services/Summary.ts',
    lambdaName: 'TextLambda',
    policyActions: ['bedrock:InvokeModel'],
    runtime: Runtime.NODEJS_20_X,
});

const generateImageLambda = new LambdaStack(app, 'GenerateImageLambdaStack', {
    entryPoint: 'services/GenerateImage.ts',
    lambdaName: 'GenerateImageLambda',
    policyActions: ['bedrock:InvokeModel'],
    runtime: Runtime.NODEJS_20_X,
});

/** ----------- S3 ----------- */

const imagesBucket = new S3BucketStack(app, 'ImagesBucketStack', {
    bucketName: 'image-bucket-aws',
    lambda: generateImageLambda.lambda,
});

// After creating the bucket, update the Lambda environment
generateImageLambda.lambda.addEnvironment(
    'BUCKET_NAME',
    imagesBucket.bucketName
);

/** ----------- END S3 ----------- */

/** ----------- API Gateways ----------- */

new ApiRestStack(app, 'BedRockApiRestStack', {
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
