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
    if (config) {
      this.initializeApp(config)
    }
  }

  /** @param {AppConfig} [config] */
  initializeApp(config) {
    config = config || this.config;
    if (config && config.firebase) {
      this.initializeFirebase(config.firebase)
    }
    if (config && config.huawei) {
      this.initializeHuawei(config.huawei)
    }
    return this;
  }

  /**
   * @param {AppConfig['firebase']} firebaseConfig 
   * @param {string} [name]
   */
  initializeFirebase(firebaseConfig, name) {
    return getFirebaseAdmin().initializeApp(firebaseConfig, name)
  }

  /**
   * @param {AppConfig['huawei']} huaweiConfig 
   */
  initializeHuawei(huaweiConfig) {
    return getHuaweiAdmin(huaweiConfig)
  }

  /** @param {import('./messaging').MessagingOptions} [options] */
  messaging(options) {
    return new MysignalMessaging(options)
  }
}

module.exports = { MysignalAdmin }
