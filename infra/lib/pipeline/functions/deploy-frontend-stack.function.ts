import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { S3DeployAction } from 'aws-cdk-lib/aws-codepipeline-actions';

/**
 *  AWS CodePipeline action to deploy frontend to S3
 */

export const deployFrontendStack = (inputSrcArtifact: Artifact, bucket: Bucket, runOrder: number): S3DeployAction =>  new S3DeployAction({
  actionName: 'DeployFrontend',
  input: inputSrcArtifact,
  bucket,
  runOrder
});
