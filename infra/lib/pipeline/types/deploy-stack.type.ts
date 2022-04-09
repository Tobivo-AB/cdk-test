import { CloudFormationCreateReplaceChangeSetAction, CloudFormationExecuteChangeSetAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export type DeployStack = {
  createStackChangeSet: CloudFormationCreateReplaceChangeSetAction,
  executeStackChangeSet: CloudFormationExecuteChangeSetAction
}
