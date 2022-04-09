import { codePipeline } from '@infra/pipeline/codepipeline.function';
import { cicdNotificationTopic } from '@infra/pipeline/cicd-notification-topic.infra';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StackIdentifiers } from './enums/stack-identifiers.enum';
import { coreStack } from './functions/core-stack.function';

/**
 * Defines a stack as a unit of deployment for all the
 * resources defined within it as a single unit.
 *
 * CICD resources should be defined within the stack to
 * enable the service to be built and deployed within AWS.
 */
export const cicdStack = (scope: Construct): Stack => {
  const stack = coreStack(scope, StackIdentifiers.pipelineStack);

  const { cicdNotificationsTopic } = cicdNotificationTopic(stack);

  codePipeline(stack, cicdNotificationsTopic);

  return stack;
};
