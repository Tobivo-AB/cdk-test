import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CodeStarConnectionsSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export type SourceAction = {
  sourceArtifact: Artifact,
  sourceAction: CodeStarConnectionsSourceAction
}
