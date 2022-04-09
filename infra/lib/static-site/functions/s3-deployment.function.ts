import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
/**
 * This function Sets up BucketDeployment, we fetch the build folder
 * and provide it as a source for the deployment 
 */
export const s3Deployment = (scope: Construct, bucket: Bucket): BucketDeployment => new BucketDeployment(
  scope, 'DeployStaticSite', 
  {
    sources: [Source.asset('./build')],
    destinationBucket: bucket
  }
);
