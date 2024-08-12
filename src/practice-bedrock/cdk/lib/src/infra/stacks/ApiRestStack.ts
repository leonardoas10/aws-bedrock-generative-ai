import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

type THttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'OPTIONS'
    | 'HEAD';

interface IResourceMethodConfig {
    path: string;
    methods: THttpMethod[];
    lambdaIntegration: LambdaIntegration;
}

interface IApiRestStackProps extends StackProps {
    readonly apiGatewayName: string;
    readonly resourceConfigs: IResourceMethodConfig[];
    readonly apiGatewayDescription?: string;
}

export class ApiRestStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        {
            apiGatewayName,
            apiGatewayDescription = '<insert a properly description>',
            resourceConfigs,
            ...props
        }: IApiRestStackProps
    ) {
        super(scope, id, props);

        const api = new RestApi(this, apiGatewayName, {
            restApiName: apiGatewayName,
            description: apiGatewayDescription,
        });

        resourceConfigs.forEach((config) => {
            const resource = api.root.addResource(config.path);
            config.methods.forEach((method) => {
                resource.addMethod(method, config.lambdaIntegration);
            });
        });
    }
}
