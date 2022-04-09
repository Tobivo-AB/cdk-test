/**
 * A collection of build commands and related settings used
 * in AWS CodeBuild to orchestrate the build process.
 *
 * Must match strict build specification as referenced in
 * AWS documentation.
 */
export const buildspec = {
  version: 0.2,
  env: {
    
  },
  phases: {
    install: {
      'runtime-versions': {
        nodejs: 14
      }
    },
    pre_build: {
      'on-failure': 'ABORT',
      commands: [
        'npm install'
      ]
    },
    build: {
      'on-failure': 'ABORT',
      commands: [
        'npm run build',
        'npm run cdk:synth'
      ]
    }
  },
  artifacts: {
    'base-directory': 'cdk.out',
    files: '**/*',
    'secondary-artifacts': {
      buildInfraArtifact: {
        'base-directory': 'cdk.out',
        files: [
          '**/*'
        ]
      }
    }
  }
};
