import { StackIdentifiers } from '@infra/stacks/enums/stack-identifiers.enum';
import { Artifact } from 'aws-cdk-lib/aws-codepipeline';
import { 
  CloudFormationCreateReplaceChangeSetAction,
  CloudFormationExecuteChangeSetAction
} from 'aws-cdk-lib/aws-codepipeline-actions';
import { DeployStack } from '../types/deploy-stack.type';

type RunOrders = {
  createChangeSetRunOrder: number,
  executeChangeSetRunOrder: number
}

/**
 * Defines create and execute change set actions
 * to deploy changes to the Boohoo group CloudFormation
 * stack. Build artifact should be passed as an input.
 * These actions should be defined within a stage in
 * CodePipeline.
 */
export const deployFrontendStack = (inputInfraArtifact: Artifact, runOrders: RunOrders): DeployStack => {
  const changeSetName = `${StackIdentifiers.frontendStack}-change-set`;

  const createStackChangeSet = new CloudFormationCreateReplaceChangeSetAction({
    actionName: `Create${StackIdentifiers.frontendStack}ChangeSet`,
    adminPermissions: true,
    changeSetName,
    stackName: StackIdentifiers.frontendStack,
    templatePath: inputInfraArtifact.atPath(`${StackIdentifiers.frontendStack}.template.json`),
    runOrder: runOrders.createChangeSetRunOrder
  });

  const executeStackChangeSet = new CloudFormationExecuteChangeSetAction({
    actionName: `Execute${StackIdentifiers.frontendStack}ChangeSet`,
    changeSetName,
    stackName: StackIdentifiers.frontendStack,
    runOrder: runOrders.executeChangeSetRunOrder
  });

  return {
    createStackChangeSet,
    executeStackChangeSet
  };
};
