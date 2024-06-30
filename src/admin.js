const { getFirebaseAdmin } = require('./get-firebase-admin');
const { getHuaweiAdmin } = require('./get-huawei-admin');
const { MysignalMessaging } = require('./messaging');

/**
 * @typedef {{
 *  firebase?: import('firebase-admin').AppOptions;
 *  huawei?: import('hcm-admin').HcmConfig;
 * }} AppConfig
 */

class MysignalAdmin {
  /** @param {AppConfig} [config] */
  constructor(config) {
    /** @protected */
    this.config = config;
    /** @protected */
    this._initialized = false;
    if (config) {
      this.initializeApp(config)
    }
  }

  /** @param {AppConfig} [config] */
  initializeApp(config) {
    if (this._initialized) {
      return this;
    }
    config = config || this.config;
    if (config && config.firebase) {
      getFirebaseAdmin().initializeApp(config.firebase)
    }
    if (config && config.huawei) {
      getHuaweiAdmin().init(config.huawei)
    }
    this._initialized = true;
    return this;
  }

  /** @param {import('./messaging').MessagingOptions} [options] */
  messaging(options) {
    return new MysignalMessaging(options)
  }
}

module.exports = { MysignalAdmin }
