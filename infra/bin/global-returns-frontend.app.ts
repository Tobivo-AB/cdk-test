import { App } from 'aws-cdk-lib';
import { cicdStack } from '../lib/stacks/cicd.stack';
import { frontendStack } from '../lib/stacks/frontend.stack';

const app = new App();
frontendStack(app);
cicdStack(app);
