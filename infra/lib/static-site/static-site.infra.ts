import { Construct } from 'constructs';
import { siteBucket } from './functions/site-bucket.function';
import { s3Deployment } from './functions/s3-deployment.function';

export const staticSite = (scope: Construct) => {
  const bucket = siteBucket(scope);
  s3Deployment(scope, bucket);
}