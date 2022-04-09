import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { SecretValue, Stack } from 'aws-cdk-lib';
import { GitHubSourceAction, GitHubTrigger } from 'aws-cdk-lib/aws-codepipeline-actions';
import { GitHubOAuthTokenSecret } from '../enums/github-oauth-token-secret.enum';
import { PipelineArtifacts } from '../enums/pipeline-artifacts.enum';
import { SourceAction } from '../types/source-action.type';

/**
 * Defines a source action that triggers when receiving a webhook
 * event from GitHub on changes made to the defined branch. Outputs
 * the code from the repository branch as an artifact that can be
 * utilised in further stages in a pipeline (such as build stages).
 */
export const sourceGitHubAction = (scope: Stack): SourceAction => {
  const oauthToken = SecretValue.secretsManager(GitHubOAuthTokenSecret.secretId);

  const sourceArtifact = new Artifact(PipelineArtifacts.sourceArtifact);

  const branch = 'main';

  const sourceAction = new GitHubSourceAction({
    actionName: 'SourceGitHubAction',
    oauthToken,
    branch,
    owner: 'Tobivo-AB ',
    repo: 'cdk-test',
    trigger: GitHubTrigger.POLL,
    output: sourceArtifact
  });

  return {
    sourceArtifact,
    sourceAction
  };
};
