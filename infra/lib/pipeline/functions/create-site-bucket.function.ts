import { Construct } from 'constructs';
import { Aws } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { PolicyStatement, AnyPrincipal } from 'aws-cdk-lib/aws-iam';

/**
 * Sets up the S3 bucket in which the static React based web site 
 * is hosted
 */
export const createSiteBucket = (scope: Construct): Bucket => {
  const bucket = new Bucket(
    scope, 
    'GlobalReturnsFrontendStore', 
    {
      bucketName: `boohoo-${Aws.ACCOUNT_ID}.global-returns-frontend-store`,
      websiteIndexDocument: 'index.html',
      blockPublicAccess: new BlockPublicAccess({ restrictPublicBuckets: false })
    }
  );
  
  const bucketPolicy = new PolicyStatement({
    actions: ['s3:GetObject'],
    resources: [
      `${bucket.bucketArn}/*`
    ],
    principals: [new AnyPrincipal()]
  });

  bucket.addToResourcePolicy(bucketPolicy);

  return bucket;
}
