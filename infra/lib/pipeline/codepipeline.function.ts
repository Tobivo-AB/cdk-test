import { AwsEnvironments } from '@infra/common/enums/aws-environments.enum';
import { StackIdentifiers } from '@infra/stacks/enums/stack-identifiers.enum';
import { Stack } from 'aws-cdk-lib';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { codeBuildAction } from './functions/codebuild-action.function';
import { deployFrontendStack } from './functions/deploy-frontend-stack.function';
import { pipelineSelfUpdateAction } from './functions/pipeline-self-update-action.function';
import { sourceGitHubAction } from './functions/source-github-action.function';
import { siteBucket } from './functions/site-bucket.function';
import { PipelineBucket } from './enums/pipeline-bucket.enum';



/**
 * Defines a self-mutating pipeline with all the stages
 * required to build, test and deploy the SCS project.
 */
export const codePipeline = (scope: Stack, notificationTopic: Topic): Pipeline => {
  const artifactBucket = Bucket.fromBucketName(
    scope,
    'PipelineArtifactBucket',
    `bh-${scope.account}.codepipeline-artifacts.${scope.region}`
  );
  const deployBucket = siteBucket(scope);
  const pipeline = new Pipeline(scope, `${StackIdentifiers.pipelineStack}Pipeline`, {
    pipelineName: `${StackIdentifiers.pipelineStack}-Pipeline`,
    artifactBucket,
    restartExecutionOnUpdate: true
  });

  const source = sourceGitHubAction(scope);
  const sourceStage = pipeline.addStage({
    stageName: 'Source',
    actions: [source.sourceAction]
  });

  const build = codeBuildAction(scope, source.sourceArtifact);
  const buildStage = pipeline.addStage({
    stageName: 'Build',
    actions: [build.buildAction],
    placement: { justAfter: sourceStage }
  });

  const selfMutation = pipelineSelfUpdateAction(build.buildOutputs.buildInfraArtifact);
  const selfUpdateStage = pipeline.addStage({
    stageName: 'PipelineSelfUpdate',
    actions: [selfMutation],
    placement: { justAfter: buildStage }
  });

  
  const frontendStackDeployAction = deployFrontendStack(
    build.buildOutputs.buildSrcArtifact,
    deployBucket,
    (scope.account === AwsEnvironments.production) ? 2 : 1 // changing run order based on env
  );

  const deployStage = pipeline.addStage({
    stageName: 'Deploy',
    actions: [
      frontendStackDeployAction
    ],
    placement: { justAfter: selfUpdateStage }
  });

  if (scope.account === AwsEnvironments.production) { 
    const deploymentManualApproval = new ManualApprovalAction({
      actionName: 'DeploymentApproval',
      runOrder: 1,
      notificationTopic
    });
    deployStage.addAction(deploymentManualApproval); 
  }

  return pipeline;
};
