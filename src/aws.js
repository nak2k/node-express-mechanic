import lazyProperty from 'lazy-property';

const CREDENTIAL_CLASSES = [
  'CognitoIdentityCredentials',
  'CredentialProviderChain',
  'EC2MetadataCredentials',
  'ECSCredentials',
  'EnvironmentCredentials',
  'FileSystemCredentials',
  'SAMLCredentials',
  'SharedIniCredentials',
  'TemporaryCredentials',
  'WebIdentityCredentials',
];

const SERVICE_CLASSES = [
  'ACM',
  'APIGateway',
  'ApplicationAutoScaling',
  'AutoScaling',
  'Batch',
  'Budgets',
  'CloudDirectory',
  'CloudFormation',
  'CloudFront',
  'CloudHSM',
  'CloudSearch',
  'CloudSearchDomain',
  'CloudTrail',
  'CloudWatch',
  'CloudWatchEvents',
  'CloudWatchLogs',
  'CodeBuild',
  'CodeCommit',
  'CodeDeploy',
  'CodePipeline',
  'CognitoIdentity',
  'CognitoIdentityServiceProvider',
  'CognitoSync',
  'ConfigService',
  'CUR',
  'DataPipeline',
  'DeviceFarm',
  'DirectConnect',
  'DirectoryService',
  'Discovery',
  'DMS',
  'DynamoDB',
  'DynamoDBStreams',
  'EC2',
  'ECR',
  'ECS',
  'EFS',
  'ElastiCache',
  'ElasticBeanstalk',
  'ElasticTranscoder',
  'ELB',
  'ELBv2',
  'EMR',
  'ES',
  'Firehose',
  'GameLift',
  'Glacier',
  'Health',
  'IAM',
  'ImportExport',
  'Inspector',
  'Iot',
  'IotData',
  'Kinesis',
  'KinesisAnalytics',
  'KMS',
  'Lambda',
  'LexRuntime',
  'Lightsail',
  'MachineLearning',
  'MarketplaceCommerceAnalytics',
  'MarketplaceMetering',
  'MobileAnalytics',
  'MTurk',
  'OpsWorks',
  'OpsWorksCM',
  'Organizations',
  'Pinpoint',
  'Polly',
  'RDS',
  'Redshift',
  'Rekognition',
  'Route53',
  'Route53Domains',
  'S3',
  'ServiceCatalog',
  'SES',
  'Shield',
  'SimpleDB',
  'SMS',
  'Snowball',
  'SNS',
  'SQS',
  'SSM',
  'StepFunctions',
  'StorageGateway',
  'STS',
  'Support',
  'SWF',
  'WAF',
  'WAFRegional',
  'WorkDocs',
  'WorkSpaces',
  'XRay',
];

export const aws = (options = {}) => app => next =>
  initAWS(options, (err, AWS) => {
    if (err) {
      return next(err);
    }

    app.AWS = AWS;

    /*
     * Lazy initialize AWS services.
     */
    for(const key of SERVICE_CLASSES) {
      lazyProperty(app, key, () => new AWS[key]());
    }

    lazyProperty(app, 'DocumentClient', () => new AWS.DynamoDB.DocumentClient());

    next();
  });

function initAWS(options, callback) {
  const AWS = require('aws-sdk');

  for(const key of CREDENTIAL_CLASSES) {
    const params = options[key];
    if (params) {
      const creds = new AWS[key](params);
      AWS.config.credentials = creds;
      break;
    }
  }

  const { region = process.env.AWS_REGION } = options;

  if (region) {
    return updateRegion(region);
  }

  const metadataService = new AWS.MetadataService();
  metadataService.request('/latest/meta-data/placement/availability-zone', (err, data) => {
    if (err) {
      return callback(new Error('AWS_REGION must be specified'));
    }

    const zone = data;
    const region = zone.replace(/[a-z]$/, '');
    
    return updateRegion(region);
  });

  function updateRegion(region) {
    AWS.config.update({
      region,
    });

    return callback(null, AWS);
  }
}
