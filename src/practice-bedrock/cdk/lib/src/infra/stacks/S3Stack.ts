import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

interface IS3BucketStackProps extends StackProps {
    readonly bucketName: string;
    readonly lambda?: NodejsFunction;
}

export class S3BucketStack extends Stack {
    public readonly bucketName: string;
    constructor(
        scope: Construct,
        id: string,
        { bucketName, lambda, ...props }: IS3BucketStackProps
    ) {
        super(scope, id, props);

        const bucket = new Bucket(this, bucketName, {
            bucketName,
        });

        lambda && bucket.grantWrite(lambda);

        bucketName = bucket.bucketName;
    }
}
