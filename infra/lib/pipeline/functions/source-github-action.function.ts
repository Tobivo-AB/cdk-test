import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { Stack } from 'aws-cdk-lib';
import { CodeStarConnectionsSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { PipelineArtifacts } from '../enums/pipeline-artifacts.enum';
import { SourceAction } from '../types/source-action.type';

/**
 * Defines a source action that triggers when receiving a webhook
 * event from GitHub on changes made to the defined branch. Outputs
 * the code from the repository branch as an artifact that can be
 * utilised in further stages in a pipeline (such as build stages).
 */
export const sourceGitHubAction = (scope: Stack): SourceAction => {

  const sourceArtifact = new Artifact(PipelineArtifacts.sourceArtifact);

  const branch = 'main';

  const sourceAction = new CodeStarConnectionsSourceAction({
    actionName: 'SourceGitHubAction',
    connectionArn: 'arn:aws:codestar-connections:eu-north-1:949733501269:connection/e1c319b7-5877-4492-a303-b5dd54c4cc96',
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
