import { 
    Stack, 
    StackProps, 
    SecretValue,
    aws_s3_assets as s3assets, 
    aws_elasticbeanstalk as elasticbeanstalk, 
    aws_iam as iam,
    aws_ec2 as ec2,
    aws_rds as rds,
    aws_s3 as s3,
    aws_s3_deployment as s3deploy,
    aws_cloudfront as cloudfront,
    aws_route53 as route53,
    aws_certificatemanager as acm,
    aws_route53_targets as targets,
    RemovalPolicy
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class StagingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Set certificate ARN to use in .env
    // @see https://console.aws.amazon.com/acm/home#/certificates/request to create one
    const cfAcmCertificateArn = process.env.QT_CF_ACM_CERT_ARN
    const ebsAcmCertificateArn = process.env.QT_EBS_ACM_CERT_ARN

    // An SSH key must be created for the SSH Bastion host
    // @see https://console.aws.amazon.com/ec2/v2/home#KeyPairs:
    const bastionSshKey = process.env.BASTION_SSH_KEY

    // An SSH key must be created for the laravel backend API
    // @see https://console.aws.amazon.com/ec2/v2/home#KeyPairs:
    const backendSshKey = process.env.BACKEND_SSH_KEY

    // ----------------------------- VPC Configuration ---------------------------------
    // Create a Virtual Private Cloud (VPC) so we can restrict access to our DB
    // from the public internet while allowing the backend to connect to it
    // Very important to do if you don't want to get hit with randsomware
    const vpc = new ec2.Vpc(this, "Staging-Main-VPC", { 
        cidr: '10.0.0.0/16',
        natGateways: 1,
        vpnGateway: true,
        maxAzs: 2,
        subnetConfiguration: [{
            subnetType: ec2.SubnetType.PUBLIC,
            name: 'Public',
            cidrMask: 20
        }, {
            subnetType: ec2.SubnetType.PRIVATE,
            name: 'Application',
            cidrMask: 20
        }, {
            subnetType: ec2.SubnetType.ISOLATED,
            name: 'Database',
            cidrMask: 24
        }]
    })

    // Allow the VPC to talk to S3
    vpc.addGatewayEndpoint('Staging-s3-gateway', {
        service: ec2.GatewayVpcEndpointAwsService.S3,
        subnets: [{
            subnetType: ec2.SubnetType.PRIVATE
        }]
    })

    // Because the VPC is so restrictive in order to directly connect to our application
    // servers via SSH we'll need a bastion host on the public subnet
    const bastionSecurityGroup = new ec2.SecurityGroup(this, "Staging-bastionSecurityGroup", {
        allowAllOutbound: true,
        securityGroupName: 'Staging-bastion-sg',
        vpc: vpc
    })
    // Locking the bastion host down to a set of known IP addresses is a good idea
    //  ie: bastionSecurityGroup.addIngressRule(ec2.Peer.ipv4('ip_addr_here', ec2.Port.tcp(22)))
    // But if you don't have static IPs that can be cumbersome
    bastionSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22))

    // Security group for the Elastic Load Balancer (ELB) that balances traffic across
    // our backend application servers, must let through any web traffic (ports 80 & 443)
    const elbSecurityGroup = new ec2.SecurityGroup(this, 'Staging-elvSecurityGroup', {
        allowAllOutbound: true,
        securityGroupName: 'Staging-elb-sg',
        vpc: vpc
    })
    elbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80))
    elbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443))
    elbSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(80))
    elbSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.tcp(443))

    // Security group for the Auto-Scaling Group (ASG) of servers spun up/down by the backend Beanstalk
    const asgSecurityGroup = new ec2.SecurityGroup(this, 'Staging-asgSecurityGroup', {
        allowAllOutbound: false,
        securityGroupName: 'Staging-asg-sg',
        vpc: vpc
    })
    asgSecurityGroup.connections.allowFrom(elbSecurityGroup, ec2.Port.tcp(80), 'Staging Application Load Balancer Security Group')
    asgSecurityGroup.connections.allowFrom(elbSecurityGroup, ec2.Port.tcp(443), 'Staging Application Load Balancer Security Group')
    asgSecurityGroup.connections.allowFrom(bastionSecurityGroup, ec2.Port.tcp(22), 'Staging - Allows connections from bastion hosts')

    // Security group for the Database
    const rdsSecurityGroup = new ec2.SecurityGroup(this, 'Staging-rdsSecurityGroup', {
        allowAllOutbound: false,
        securityGroupName: 'Staging-rds-sg',
        vpc: vpc
    })
    rdsSecurityGroup.connections.allowFrom(asgSecurityGroup, ec2.Port.tcp(3306), 'Allow connections from eb Auto Scaling Group Security Group')
    rdsSecurityGroup.connections.allowFrom(bastionSecurityGroup, ec2.Port.tcp(3306), 'Allow connections from bastion hosts')
    // ---------------------------- End VPC Configuration ---------------------------------


    // ----------------------- Elastic Beanstalk Configuration ----------------------------
    /*
    const backendZip = new s3assets.Asset(this, 'backendZip', {
        path: `${__dirname}/../../backend/build.zip`
    })
    */

    // Create the production ElasticBeanstalk applications for the backend
    const ebAppName = "Staging-QualifiedTeachersAPI"
    const ebApp = new elasticbeanstalk.CfnApplication(this, 'Application', {
        applicationName: ebAppName
    })
    /*
    const ebAppVersion = new elasticbeanstalk.CfnApplicationVersion(this, 'AppVersion', {
        applicationName: ebAppName,
        sourceBundle: {
            s3Bucket: backendZip.s3BucketName,
            s3Key: backendZip.s3ObjectKey
        }
    })
    ebAppVersion.addDependsOn(ebApp)
    */

    // Create role & ec2 instance profile for the beanstalk
    const ebRole = new iam.Role(this, `${ebAppName}-aws-elasticbeanstalk-ec2-role`, {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    })
    const ebManagedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    ebRole.addManagedPolicy(ebManagedPolicy)

    const ebProfileName = `${ebAppName}-InstanceProfile`
    const ebInstanceProfile = new iam.CfnInstanceProfile(this, ebProfileName, {
        instanceProfileName: ebProfileName,
        roles: [
            ebRole.roleName
        ]
    })

    // Define the scaling options for the backend
    // Right now we're keeping things free-tier compatible
    // As the application load scales up the following should be adjusted:
    //  - MaxSize
    //  - InstanceSize
    //  - autoscaling triggers 
    // 
    // https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
    const ebScalingOpts = [{
        namespace: 'aws:elasticbeanstalk:environment:proxy',
        optionName: 'ProxyServer',
        value: 'apache'
    }, {
        namespace: 'aws:elasticbeanstalk:environment',
        optionName: 'LoadBalancerType',
        value: 'application'
    }, {
        namespace: 'aws:elbv2:listener:443',
        optionName: 'ListenerEnabled',
        value: 'true'
    }, {
        namespace: 'aws:elbv2:listener:443',
        optionName: 'Protocol',
        value: 'HTTPS'
    }, {
        namespace: 'aws:elbv2:listener:443',
        optionName: 'SSLCertificateArns',
        value: ebsAcmCertificateArn
    }, {
        namespace: 'aws:elbv2:listener:443',
        optionName: 'DefaultProcess',
        value: 'default'
    }, {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MinSize',
        value: '1'
    }, {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MaxSize',
        value: '1'
    }, {    
        namespace: 'aws:ec2:instances',
        optionName: 'InstanceTypes',
        value: 't2.micro'
    },{ 
        namespace: 'aws:autoscaling:trigger',
        optionName: 'MeasureName',
        value: 'CPUUtilization'
    }, {
        namespace: 'aws:autoscaling:trigger',
        optionName: 'Unit',
        value: 'Percent'
    }, {
        namespace: 'aws:autoscaling:trigger',
        optionName: 'BreachDuration',
        value: '10'
    }, {
        namespace: 'aws:autoscaling:trigger',
        optionName: 'UpperBreachScaleIncrement',
        value: '1'
    }, {
        namespace: 'aws:autoscaling:trigger',
        optionName: 'LowerThreshold',
        value: '20'
    }, {
        namespace: 'aws:autoscaling:trigger',
        optionName: 'UpperThreshold',
        value: '80'
    }, {
        namespace: 'aws:elasticbeanstalk:cloudwatch:logs',
        optionName: 'StreamLogs',
        value: 'true'
    }, {
        namespace: 'aws:elasticbeanstalk:cloudwatch:logs',
        optionName: 'DeleteOnTerminate',
        value: 'true'
    }, {
        namespace: 'aws:elasticbeanstalk:cloudwatch:logs',
        optionName: 'RetentionInDays',
        value: '14'
    }, {
        namespace: 'aws:ec2:vpc',
        optionName: 'VPCId',
        value: vpc.vpcId
    }, {
        namespace: 'aws:ec2:vpc',
        optionName: 'Subnets',
        value: vpc.privateSubnets.map(value => value.subnetId).join(',')
    }, {
        namespace: 'aws:ec2:vpc',
        optionName: 'ELBSubnets',
        value: vpc.publicSubnets.map(value => value.subnetId).join(',')
    }, {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: ebInstanceProfile.attrArn
    }, {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'InstanceType',
        value: 't2.micro'
    }, {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'SecurityGroups',
        value: asgSecurityGroup.securityGroupId
    }, {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'SSHSourceRestriction',
        value: `tcp, 22, 22, ${asgSecurityGroup.securityGroupId as string}`
    }, {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'EC2KeyName',
        value: backendSshKey
    }, {
        namespace: 'aws:elasticbeanstalk:container:php:phpini',
        optionName: 'document_root',
        value: '/public'
    }]

    // Create the beanstalk
    const elbEnv = new elasticbeanstalk.CfnEnvironment(this, 'Staging-Environment', {
        environmentName: 'Staging-QualifiedTeachers-API',
        applicationName: ebApp.applicationName || ebAppName,
        solutionStackName: '64bit Amazon Linux 2 v3.3.12 running PHP 8.0',
        optionSettings: ebScalingOpts,
        //versionLabel: ebAppVersion.ref
    }) 
    // --------------------- End Elastic Beanstalk Configuration ---------------------------
   
    // --------------------------- Database Configuration ----------------------------------
    const db = new rds.DatabaseInstance(this, 'Staging-QualifiedTeachers-DB', {
        engine: rds.DatabaseInstanceEngine.MYSQL,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        vpc: vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
        /*storageEncrypted: true,*/ // Free-tier micro instances don't support encryption at rest, but it should be enabled once the instance size is scaled up
        multiAz: false, // When scaling up the application eventually we'll want to flip to multi-az deployments
        autoMinorVersionUpgrade: false,
        allocatedStorage: 20, // 20GB to stay within the free tier, push this up later if necessary
        storageType: rds.StorageType.GP2,
        securityGroups: [rdsSecurityGroup],
        credentials: {
            username: process.env.DATABASE_ROOT_USER || '',
            password: SecretValue.plainText(process.env.DATABASE_ROOT_PASSWORD || '')
        },
        databaseName: process.env.DATABASE_NAME,
        port: 3306
    })
    // -------------------------- End Database Configuration -------------------------------

    // ------------------------------- SSH Bastion Host ------------------------------------
    const bastion = new ec2.Instance(this, 'Staging-bastionHost', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        securityGroup: bastionSecurityGroup,
        vpc: vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        machineImage: ec2.MachineImage.latestAmazonLinux(),
        keyName: bastionSshKey || '' // An SSH key with this name must be created in the AWS EC2 web UI
    })
    // ----------------------------- End SSH Bastion Host ----------------------------------
    
    // ---------------------------- Frontend Configuration ---------------------------------
    const frontendBucket = new s3.Bucket(this, process.env.FRONTEND_BUCKET_NAME || '', {
        bucketName: process.env.FRONTEND_BUCKET_NAME || '',
        websiteIndexDocument: "index.html",
        websiteErrorDocument: "error.html",
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        cors: [{
            allowedMethods: [
                s3.HttpMethods.GET,
                s3.HttpMethods.HEAD
            ],
            allowedOrigins: [
                'http://localhost:3000',  // Dev env frontend
                'http://localhost:45678', // React-snap, used to prerender routes on FE build
                'https://staging.kesso.uk',
                'https://www.kesso.uk',
                'https://kesso.uk',
                'https://staging.qualifiedteachers.co.uk',
                'https://qualifiedteachers.co.uk'
            ],
            allowedHeaders: ['*'],
        },],
    })

    const feOriginIdent = new cloudfront.OriginAccessIdentity(this, "Staging-frontend-oai")
    frontendBucket.grantRead(feOriginIdent)
    const cfDistro = new cloudfront.CloudFrontWebDistribution(this, "Staging-frontend-cdn", {
        originConfigs: [{
            s3OriginSource: {
                s3BucketSource: frontendBucket,
                originAccessIdentity: feOriginIdent
            },
            behaviors: [{ 
                isDefaultBehavior: true,
                compress: true
            }],
        }],
        errorConfigurations: [{
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/'
        }],
        viewerCertificate: {
            props: {
                acmCertificateArn: cfAcmCertificateArn,
                sslSupportMethod: 'sni-only'
            },
            aliases: [
                "staging-qualifiedteachers.bypass.systems"
            ]
        }
    })

    /*
    const feDeployment = new s3deploy.BucketDeployment(this, 'Staging-FrontendBucketDeployment', {
        sources: [
            s3deploy.Source.asset(`${__dirname}/../../frontend/build`)
        ],
        destinationBucket: frontendBucket,
        distribution: cfDistro,
        distributionPaths: ['/*']
    })
    */
  }
}
