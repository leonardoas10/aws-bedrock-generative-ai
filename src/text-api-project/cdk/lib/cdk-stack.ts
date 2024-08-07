import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const summaryLambda = new NodejsFunction(this, 'Ts-TextLambda', {
            runtime: Runtime.NODEJS_20_X,
            entry: join(__dirname, '../services/Summary.ts'),
            handler: 'handler',
            timeout: cdk.Duration.seconds(30),
            memorySize: 512,
        });

        summaryLambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['bedrock:InvokeModel'],
                resources: ['*'],
            })
        );

        const api = new RestApi(this, 'Ts-TextApi', {
            restApiName: 'Ts-TextApi',
        });

        const textResource = api.root.addResource('text');

        const summaryIntegration = new LambdaIntegration(summaryLambda);

        textResource.addMethod('POST', summaryIntegration);
    }
}
