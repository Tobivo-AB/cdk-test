import { PipelineProject } from 'aws-cdk-lib/aws-codebuild';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export type BuildAction = {
  buildProject: PipelineProject,
  buildAction: CodeBuildAction,
  buildOutputs: {
    buildInfraArtifact: Artifact
  }
}
