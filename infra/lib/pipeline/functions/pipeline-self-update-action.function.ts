import { StackIdentifiers } from '@infra/stacks/enums/stack-identifiers.enum';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { CloudFormationCreateUpdateStackAction } from 'aws-cdk-lib/aws-codepipeline-actions';

/**
 * A CloudFormation update action that can added to a
 * CodePipeline stage, enabling the pipeline to self-mutate
 * when there are updates to the pipeline resources themselves.
 *
 * Requires a passed input artifact containing the pipeline
 * stack synthesised CloudFormation template.
 */
export const pipelineSelfUpdateAction = (inputArtifact: Artifact): CloudFormationCreateUpdateStackAction =>
  new CloudFormationCreateUpdateStackAction({
    actionName: 'PipelineSelfUpdate',
    adminPermissions: true,
    stackName: StackIdentifiers.pipelineStack,
    templatePath: inputArtifact.atPath(`${StackIdentifiers.pipelineStack}.template.json`)
  });
