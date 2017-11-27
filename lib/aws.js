const { addAwsServices } = require('lazy-aws-service');

const debug = require('debug')('express-mechanic:aws');

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

exports.aws = (options = {}) => app => next =>
  initAWS(options, (err, AWS) => {
    if (err) {
      return next(err);
    }

    app.AWS = AWS;
    addAwsServices(app, AWS);

    next();
  });

function initAWS(options, callback) {
  const AWS = require('aws-sdk');

  for (let i = 0; i < CREDENTIAL_CLASSES.length; i++) {
    const key = CREDENTIAL_CLASSES[i];

    const params = options[key];
    if (params) {
      debug('Use credential %s', key);

      const creds = new AWS[key](params);
      AWS.config.credentials = creds;
      break;
    }
  }

  const { http_proxy } = process.env;
  if (http_proxy) {
    const proxy = require('proxy-agent');

    AWS.config.update({
      httpOptions: { agent: proxy(http_proxy) }
    });
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
    debug('Update region %s', region);

    AWS.config.update({
      region,
    });

    return callback(null, AWS);
  }
}
