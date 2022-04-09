import { Construct } from 'constructs';
import { StackIdentifiers } from './enums/stack-identifiers.enum';
import { coreStack } from './functions/core-stack.function';
import { staticSite } from '@infra/static-site/static-site.infra';
import { Stack } from 'aws-cdk-lib';

export const frontendStack = (scope: Construct): Stack => {
  const stack = coreStack(scope, StackIdentifiers.frontendStack);
  staticSite(stack);
  return stack;
}
