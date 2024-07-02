const crypto = require('crypto')
const { HcmNamespace } = require('hcm-admin')

/** @type {{ [key: string]: HcmNamespace }} */
const HUAWEI_ADMINS = {}
const DEFAULT_KEY = '[DEFAULT]';
const CONFIG_KEYS = {}

const RETRY_CONFIG_KEYS = {}
/**
 * @param {import('hcm-admin').HcmConfig['retryConfig']} retryConfig 
 */
const getRetryConfigKey = (retryConfig) => {
  if (!retryConfig || !Object.keys(retryConfig).length) {
    return null;
  }
  const { backOffFactor, ioErrorCodes, maxDelayInMillis, maxRetries, statusCodes } = retryConfig;
  const values = [backOffFactor, ioErrorCodes, maxDelayInMillis, maxRetries, statusCodes];
  const rawKey = values.map(v => typeof v === 'undefined' || v === null ? null : v).join('-');
  if (!RETRY_CONFIG_KEYS[rawKey]) {
    RETRY_CONFIG_KEYS[rawKey] = crypto.createHash('md5').update(rawKey).digest('hex')
  }
  return RETRY_CONFIG_KEYS[rawKey]
}

/** @param {import('hcm-admin').HcmConfig} config */
const getConfigKey = (config) => {
  if (!config || !Object.keys(config).length) {
    return DEFAULT_KEY;
  }
  const { appId, appSecret, authUrl, pushUrl, topicUrl, retryConfig, authTimeout, messagingTimeout } = config;
  const values = [appId, appSecret, authUrl, pushUrl, topicUrl, authTimeout, messagingTimeout, getRetryConfigKey(retryConfig)];
  const rawKey = values.map(v => typeof v === 'undefined' ? null : v).join('-')
  const isFirstConfig = Object.keys(CONFIG_KEYS).length === 0;
  if (isFirstConfig) {
    CONFIG_KEYS[rawKey] = DEFAULT_KEY;
  } else if (!CONFIG_KEYS[rawKey]) {
    CONFIG_KEYS[rawKey] = crypto.createHash('md5').update(rawKey).digest('hex')
  }
  return CONFIG_KEYS[rawKey]
}

/** @param {import('hcm-admin').HcmConfig} [config] */
const getHuaweiAdmin = (config) => {
  const key = getConfigKey(config)
  if (!HUAWEI_ADMINS[key]) {
    const admin = new HcmNamespace()
    if (config) {
      admin.init(config)
    }
    HUAWEI_ADMINS[key] = admin;
  }
  return HUAWEI_ADMINS[key];
}

module.exports = { getHuaweiAdmin }
