const { getHuaweiAdmin } = require('./get-huawei-admin')
const { getFirebaseAdmin } = require('./get-firebase-admin')
const { HuaweiMessage } = require('./huawei-message')

/**
 * @typedef {{
 *  firebase?: import("firebase-admin/app").App;
 *  huawei?: import("hcm-admin").HcmConfig;
 * }} MessagingOptions
 */

/**
 * @typedef {import('firebase-admin/lib/messaging/messaging-api').BaseMessage} BaseMessage
 * @typedef {import('firebase-admin/lib/messaging/messaging-api').TopicMessage} TopicMessage
 * @typedef {import('firebase-admin/lib/messaging/messaging-api').ConditionMessage} ConditionMessage
 * @typedef {import('firebase-admin/lib/messaging/messaging-api').TokenMessage} TokenMessage
 * @typedef {import('firebase-admin/lib/messaging/messaging-api').MulticastMessage} MulticastMessage
 */

class MysignalMessaging {
  /** @param {MessagingOptions} [options] */
  constructor(options) {
    /** @protected */
    this.opts = options || {}
  }

  /**
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async subscribeToTopic(tokenOrTokens, topic) {
    const [firebase, huawei] = await Promise.all([
      this.firebaseSubscribeToTopic(tokenOrTokens, topic),
      this.huaweiSubscribeToTopic(tokenOrTokens, topic),
    ])
    return { firebase, huawei }
  }

  /**
   * @protected
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async firebaseSubscribeToTopic(tokenOrTokens, topic) {
    try {
      const response = await getFirebaseAdmin()
        .messaging(this.opts.firebase)
        .subscribeToTopic(tokenOrTokens, topic)
      return response
    } catch (e) {
      return { originalError: e }
    }
  }

  /**
   * @protected
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async huaweiSubscribeToTopic(tokenOrTokens, topic) {
    try {
      const response = await getHuaweiAdmin(this.opts.huawei)
        .topic()
        .subScribeTopic({
          tokenArray: Array.isArray(tokenOrTokens) ? tokenOrTokens : [tokenOrTokens],
          topic,
        })
      return response
    } catch (e) {
      return { originalError: e }
    }
  }

  /**
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async unsubscribeFromTopic(tokenOrTokens, topic) {
    const [firebase, huawei] = await Promise.all([
      this.firebaseUnsubscribeFromTopic(tokenOrTokens, topic),
      this.huaweiUnsubscribeFromTopic(tokenOrTokens, topic),
    ])
    return { firebase, huawei }
  }

  /**
   * @protected
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async firebaseUnsubscribeFromTopic(tokenOrTokens, topic) {
    try {
      const response = await getFirebaseAdmin()
        .messaging(this.opts.firebase)
        .unsubscribeFromTopic(tokenOrTokens, topic)
      return response
    } catch (e) {
      return { originalError: e }
    }
  }

  /**
   * @protected
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async huaweiUnsubscribeFromTopic(tokenOrTokens, topic) {
    try {
      const response = await getHuaweiAdmin(this.opts.huawei)
        .topic()
        .unSubScribeTopic({
          tokenArray: Array.isArray(tokenOrTokens) ? tokenOrTokens : [tokenOrTokens],
          topic,
        })
      return response
    } catch (e) {
      return { originalError: e }
    }
  }

  /**
   * @param {string} topic
   * @param {BaseMessage} message
   * @param {boolean} [dryRun]
   */
  async sendToTopic(topic, message, dryRun = false) {
    const [firebase, huawei] = await Promise.all([
      this.firebaseSend({ ...message, topic }, dryRun),
      this.huaweiSend({ ...message, topic }, dryRun),
    ])
    return { firebase, huawei }
  }

  /**
   * @protected
   * @param {TopicMessage | ConditionMessage | TokenMessage} message
   * @param {boolean} [dryRun]
   * @returns {Promise<{ messageId?: string; originalError?: Error }>}
   */
  async firebaseSend(message, dryRun = false) {
    try {
      const messageId = await getFirebaseAdmin().messaging(this.opts.firebase).send(message, dryRun)
      return { messageId }
    } catch (e) {
      return { originalError: e }
    }
  }

  /**
   * @protected
   * @param {TopicMessage | ConditionMessage | TokenMessage | MulticastMessage} message
   * @param {boolean} [dryRun]
   */
  async huaweiSend(message, dryRun = false) {
    try {
      const { topic, condition, token, tokens } = message
      const response = await getHuaweiAdmin(this.opts.huawei)
        .messaging()
        .send(
          {
            ...HuaweiMessage.toHuaweiMessage(message),
            topic,
            condition,
            token: token ? [token] : tokens ? tokens : undefined,
          },
          false,
          dryRun
        )
      return response
    } catch (e) {
      return { originalError: e }
    }
  }

  /**
  * @param {TopicMessage | ConditionMessage | TokenMessage} message
  * @param {boolean} [dryRun]
  */
  async send(message, dryRun = false) {
    const [firebase, huawei] = await Promise.all([
      this.firebaseSend(message, dryRun),
      this.huaweiSend(message, dryRun)
    ])
    return { firebase, huawei }
  }

  /**
   * @param {string[]} tokens
   * @param {BaseMessage} message
   * @param {boolean} [dryRun]
   */
  async sendEach(tokens, message, dryRun = false) {
    const [firebase, huawei] = await Promise.all([
      this.firebaseSendEach(tokens, message, dryRun),
      this.huaweiSend({ ...message, tokens, token: null }),
    ])
    return { firebase, huawei }
  }

  /**
   * @protected
   * @param {string | string[]} tokenOrTokens
   * @param {BaseMessage} message
   * @param {boolean} [dryRun]
   */
  async firebaseSendEach(tokenOrTokens, message, dryRun = false) {
    const tokens = Array.isArray(tokenOrTokens) ? tokenOrTokens : [tokenOrTokens]
    try {
      const respnonse = await getFirebaseAdmin()
        .messaging()
        .sendEachForMulticast({ ...message, tokens }, dryRun)
      return respnonse
    } catch (e) {
      return { originalError: e }
    }
  }
}

module.exports = { MysignalMessaging }
