import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Stack } from 'aws-cdk-lib';
import { CodeStarConnectionsSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { AwsEnvironments } from '@infra/common/enums/aws-environments.enum';
import { PipelineArtifacts } from '../enums/pipeline-artifacts.enum';
import { GithubConnectionArn } from '../enums/github-connection-arn.enum';
import { SourceAction } from '../types/source-action.type';

/**
 * Defines a source action that triggers when receiving a webhook
 * event from GitHub on changes made to the defined branch. Outputs
 * the code from the repository branch as an artifact that can be
 * utilised in further stages in a pipeline (such as build stages).
 */
export const sourceGitHubAction = (scope: Stack): SourceAction => {  

  const sourceArtifact = new Artifact(PipelineArtifacts.sourceArtifact);

  const branch = scope.account === AwsEnvironments.production ? 'main' : 'main';

  const connectionArn = scope.account === AwsEnvironments.production 
    ? GithubConnectionArn.production 
    : GithubConnectionArn.uat;

  const sourceAction =  new CodeStarConnectionsSourceAction({
    actionName: 'SourceGitHubAction',
    connectionArn,
    branch,
    owner: 'Tobivo-AB',
    repo: 'cdk-test',
    output: sourceArtifact
  });

  return {
    sourceArtifact,
    sourceAction
  };
};
