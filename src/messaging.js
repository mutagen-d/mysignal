const { getHuaweiAdmin } = require('./get-huawei-admin')
const { getFirebaseAdmin } = require('./get-firebase-admin')
const { HuaweiMessage } = require('./huawei-message')

/**
 * @typedef {{
 *  firebase?: import("firebase-admin/app").App;
 *  huawei?: import("hcm-admin").HcmConfig;
 * }} MessagingOptions
 */

function toJSON() {
  return {
    message: this.message,
    code: this.code,
  }
}

class Duration {
  constructor() {
    this.startTime = Date.now();
  }

  ms() {
    return Date.now() - this.startTime;
  }
}

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
    const duration = new Duration()
    try {
      /** @type {import('firebase-admin/lib/messaging/messaging-api').MessagingTopicManagementResponse & { duration: number }} */
      const response = await getFirebaseAdmin()
        .messaging(this.opts.firebase)
        .subscribeToTopic(tokenOrTokens, topic)
      response.duration = duration.ms()
      return response
    } catch (e) {
      e.toJSON = toJSON;
      return { originalError: e, duration: duration.ms() }
    }
  }

  /**
   * @protected
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async huaweiSubscribeToTopic(tokenOrTokens, topic) {
    const duration = new Duration()
    try {
      /** @type {import('hcm-admin/dist/push/modle/topic').TopicResponse & { duration: number }} */
      const response = await getHuaweiAdmin(this.opts.huawei)
        .topic()
        .subScribeTopic({
          tokenArray: Array.isArray(tokenOrTokens) ? tokenOrTokens : [tokenOrTokens],
          topic,
        })
      response.duration = duration.ms()
      return response
    } catch (e) {
      e.toJSON = toJSON;
      return { originalError: e, duration: duration.ms() }
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
    const duration = new Duration()
    try {
      /** @type {import('firebase-admin/lib/messaging/messaging-api').MessagingTopicManagementResponse & { duration: number }} */
      const response = await getFirebaseAdmin()
        .messaging(this.opts.firebase)
        .unsubscribeFromTopic(tokenOrTokens, topic)
      response.duration = duration.ms();
      return response
    } catch (e) {
      e.toJSON = toJSON;
      return { originalError: e, duration: duration.ms() }
    }
  }

  /**
   * @protected
   * @param {string | string[]} tokenOrTokens
   * @param {string} topic
   */
  async huaweiUnsubscribeFromTopic(tokenOrTokens, topic) {
    const duration = new Duration()
    try {
      /** @type {import('hcm-admin/dist/push/modle/topic').TopicResponse & { duration: number }} */
      const response = await getHuaweiAdmin(this.opts.huawei)
        .topic()
        .unSubScribeTopic({
          tokenArray: Array.isArray(tokenOrTokens) ? tokenOrTokens : [tokenOrTokens],
          topic,
        })
      response.duration = duration.ms()
      return response
    } catch (e) {
      e.toJSON = toJSON;
      return { originalError: e, duration: duration.ms() }
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
   * @returns {Promise<{ messageId?: string; originalError?: Error; duration: number }>}
   */
  async firebaseSend(message, dryRun = false) {
    const duration = new Duration()
    try {
      const messageId = await getFirebaseAdmin().messaging(this.opts.firebase).send(message, dryRun)
      return { messageId, duration: duration.ms() }
    } catch (e) {
      e.toJSON = toJSON;
      return { originalError: e, duration: duration.ms() }
    }
  }

  /**
   * @protected
   * @param {TopicMessage | ConditionMessage | TokenMessage | MulticastMessage} message
   * @param {boolean} [dryRun]
   */
  async huaweiSend(message, dryRun = false) {
    const duration = new Duration()
    try {
      const { topic, condition, token, tokens } = message
      /** @type {import('hcm-admin/dist/push/modle/message').MsgResponse & { duration: number }} */
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
      response.duration = duration.ms()
      return response
    } catch (e) {
      e.toJSON = toJSON;
      return { originalError: e, duration: duration.ms() }
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
    const duration = new Duration()
    const tokens = Array.isArray(tokenOrTokens) ? tokenOrTokens : [tokenOrTokens]
    try {
      /** @type {import('firebase-admin/lib/messaging/messaging-api').BatchResponse & { duration: number }} */
      const respnonse = await getFirebaseAdmin()
        .messaging()
        .sendEachForMulticast({ ...message, tokens }, dryRun)
      respnonse.duration = duration.ms();
      return respnonse
    } catch (e) {
      e.toJSON = toJSON;
      return { originalError: e, duration: duration.ms() }
    }
  }
}

module.exports = { MysignalMessaging }
