# Infrastrucre as Code

CDK code for provisioning infrastructure using AWS.
    - @see https://docs.aws.amazon.com/cdk/v2/guide/home.html

cdk.json defines the entry point, which is bin/iac.ts, which synthesizes two stacks-- one for production (lib/prod-stack.ts) & one for staging (lib/staging-stack.ts)

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy a stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
