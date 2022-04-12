import { AwsEnvironments } from '@infra/common/enums/aws-environments.enum';
import { StackIdentifiers } from '@infra/stacks/enums/stack-identifiers.enum';
import { Stack } from 'aws-cdk-lib';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CloudFormationCreateUpdateStackAction, ManualApprovalAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { codeBuildAction } from './functions/codebuild-action.function';
import { deployFrontendStack } from './functions/deploy-frontend-stack.function';
import { pipelineSelfUpdateAction } from './functions/pipeline-self-update-action.function';
import { sourceGitHubAction } from './functions/source-github-action.function';
import { BuildAction } from './types/build-action.type';
import { DeployStack } from './types/deploy-stack.type';
import { SourceAction } from './types/source-action.type';
import { PipelineBucket } from './enums/pipeline-bucket.enum';

type CodePipeline = {
  pipeline: Pipeline,
  source: SourceAction,
  build: BuildAction,
  selfMutation: CloudFormationCreateUpdateStackAction
  deployFrontendStack: DeployStack
}

/**
 * Defines a self-mutating pipeline with all the stages
 * required to build, test and deploy the SCS project.
 */
export const codePipeline = (scope: Stack, notificationTopic: Topic): CodePipeline => {
  const artifactBucket = Bucket.fromBucketName(
    scope,
    'PipelineArtifactBucket',
    PipelineBucket.name
  );

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

  const frontendStackDeployment = deployFrontendStack(
    build.buildOutputs.buildInfraArtifact,
    { createChangeSetRunOrder: 1, executeChangeSetRunOrder: 3 }
  );

  const deployStage = pipeline.addStage({
    stageName: 'Deploy',
    actions: [
      frontendStackDeployment.createStackChangeSet,
      frontendStackDeployment.executeStackChangeSet
    ],
    placement: { justAfter: selfUpdateStage }
  });

  const deploymentManualApproval = new ManualApprovalAction({
    actionName: 'DeploymentApproval',
    runOrder: 2,
    notificationTopic
  });
  
  if (scope.account === AwsEnvironments.production) { deployStage.addAction(deploymentManualApproval); }

  return {
    pipeline,
    source,
    build,
    selfMutation,
    deployFrontendStack: frontendStackDeployment
  };
};
