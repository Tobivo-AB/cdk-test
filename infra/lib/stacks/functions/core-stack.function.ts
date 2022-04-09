import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CoreStackTags } from '../enums/core-stack-tags.enum';

/**
 * Defines a core stack that enables
 * termination protection and adds
 * core tags related to the project.
 *
 * This can be built on to define
 * additional stacks within the service.
 */
export const coreStack = (scope?: Construct, id?: string, props?: StackProps): Stack => {
  const stack = new Stack(scope, id, {
    ...props,
    tags: {
      ...props?.tags,
      ...CoreStackTags
    },
    terminationProtection: true,
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION
    }
  });

  return stack;
};
