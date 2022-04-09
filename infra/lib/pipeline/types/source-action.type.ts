import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { GitHubSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export type SourceAction = {
  sourceArtifact: Artifact,
  sourceAction: GitHubSourceAction
}
