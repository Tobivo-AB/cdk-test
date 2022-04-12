import { Construct } from 'constructs';
import {
  BuildSpec, ComputeType, LinuxBuildImage, PipelineProject
} from 'aws-cdk-lib/aws-codebuild';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { buildspec } from '../configs/buildspec.config';
import { GitHubOAuthTokenSecret } from '../enums/github-oauth-token-secret.enum';
import { PipelineArtifacts } from '../enums/pipeline-artifacts.enum';
import { BuildAction } from '../types/build-action.type';

/**
 * Defines a CodeBuild action used to test, build
 * and package the code into artifacts that can be
 * passed to further stages in a pipeline (such as
 * deployment stages).
 */
export const codeBuildAction = (scope: Construct, sourceArtifact: Artifact): BuildAction => {
  const buildProject = new PipelineProject(scope, 'BuildProject', {
    projectName: 'CDKTEST-BuildProject',
    environment: {
      buildImage: LinuxBuildImage.STANDARD_5_0,
      computeType: ComputeType.MEDIUM
    },
    buildSpec: BuildSpec.fromObject(buildspec)
  });

  Secret.fromSecretNameV2(
    scope,
    'CodeBuildGitHubOAuthTokenSecret',
    GitHubOAuthTokenSecret.secretId
  ).grantRead(buildProject);

  buildProject.addToRolePolicy(new PolicyStatement({
    actions: ['ec2:DescribeAvailabilityZones'],
    effect: Effect.ALLOW,
    resources: ['*']
  }));

  const buildInfraArtifact = new Artifact(PipelineArtifacts.buildInfraArtifact);
  const buildSrcArtifact = new Artifact(PipelineArtifacts.buildSrcArtifact);

  const buildAction = new CodeBuildAction({
    actionName: 'BuildForDeployment',
    input: sourceArtifact,
    project: buildProject,
    outputs: [
      buildInfraArtifact,
      buildSrcArtifact
    ]
  });

  return {
    buildProject,
    buildAction,
    buildOutputs: {
      buildInfraArtifact,
      buildSrcArtifact
    }
  };
};
