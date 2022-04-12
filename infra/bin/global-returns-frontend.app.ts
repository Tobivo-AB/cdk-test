import { App } from 'aws-cdk-lib';
import { cicdStack } from '../lib/stacks/cicd.stack';

const app = new App();
cicdStack(app);
