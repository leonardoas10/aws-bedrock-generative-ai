import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface LambdaStackProps extends StackProps {
    readonly lambdaName: string;
    readonly entryPoint: string;
    readonly policyActions?: Array<string>;
    readonly policiyResources?: Array<string>;
    readonly environment?: { [key: string]: string };
    readonly runtime?: Runtime;
}

export class LambdaStack extends Stack {
    public readonly lambdaIntegration: LambdaIntegration;
    public readonly lambda: NodejsFunction;

    constructor(
        scope: Construct,
        id: string,
        {
            lambdaName,
            entryPoint = '/',
            environment = {},
            runtime = Runtime.NODEJS_20_X,
            policyActions = ['*'],
            policiyResources = ['*'],
            ...props
        }: LambdaStackProps
    ) {
        super(scope, id, props);

        const lambda = new NodejsFunction(this, lambdaName, {
            runtime: runtime,
            entry: join(__dirname, `../../${entryPoint}`),
            handler: 'handler',
            environment,
            timeout: Duration.seconds(30),
        });

        lambda.addToRolePolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: policyActions,
                resources: policiyResources,
            })
        );

        this.lambdaIntegration = new LambdaIntegration(lambda);
        this.lambda = lambda;
    }
}
