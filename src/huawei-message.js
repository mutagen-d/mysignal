class HuaweiMessage {
  /**
   * @param {import('firebase-admin/lib/messaging/messaging-api').BaseMessage} firebaseMessage
   */
  static toHuaweiMessage(firebaseMessage) {
    /** @type {import('hcm-admin/src/push/modle/message').Message} */
    const huaweiMessage = {}
    huaweiMessage.android = HuaweiMessage.toHuaweiAndroid(firebaseMessage.android);
    huaweiMessage.data = firebaseMessage.data ? JSON.stringify(firebaseMessage.data) : undefined;
    huaweiMessage.notification = firebaseMessage.notification ? {
      title: firebaseMessage.notification.title,
      body: firebaseMessage.notification.body,
      image: firebaseMessage.notification.imageUrl,
    } : undefined;
    huaweiMessage.webpush = HuaweiMessage.toHuaweiWebpush(firebaseMessage.webpush)
    // TODO: apns
    return huaweiMessage;
  }

  /** @param {import('firebase-admin/lib/messaging/messaging-api').WebpushConfig} firebaseWebpush */
  static toHuaweiWebpush(firebaseWebpush) {
    if (!firebaseWebpush) {
      return;
    }
    /** @type {import('hcm-admin/src/push/modle/message-webpush').WebPushConfig} */
    const huaweiWebpush = {}
    huaweiWebpush.hmsOptions = firebaseWebpush.fcmOptions ? { link: firebaseWebpush.fcmOptions.link } : undefined;
    huaweiWebpush.headers = firebaseWebpush.headers ? Object.keys(firebaseWebpush.headers).reduce((acc, key) => ({
      ...acc, [key.toLowerCase()]: firebaseWebpush.headers[key]
    }), {}) : undefined;
    huaweiWebpush.notification = HuaweiMessage.toHuaweiWebpushNotification(firebaseWebpush.notification)
    return huaweiWebpush;
  }

  /** @param {import('firebase-admin/lib/messaging/messaging-api').WebpushNotification} firebaseWebpushNotification */
  static toHuaweiWebpushNotification(firebaseWebpushNotification) {
    if (!firebaseWebpushNotification) {
      return;
    }
    /** @type {import('hcm-admin/src/push/modle/message-webpush').WebPushNotification} */
    const huaweiWebpushNotification = {}
    huaweiWebpushNotification.title = firebaseWebpushNotification.title;
    huaweiWebpushNotification.body = firebaseWebpushNotification.body;

    huaweiWebpushNotification.actions = firebaseWebpushNotification.actions;
    huaweiWebpushNotification.badge = firebaseWebpushNotification.badge;
    huaweiWebpushNotification.dir = firebaseWebpushNotification.dir;
    huaweiWebpushNotification.icon = firebaseWebpushNotification.icon;
    huaweiWebpushNotification.image = firebaseWebpushNotification.image;
    huaweiWebpushNotification.lang = firebaseWebpushNotification.lang;
    huaweiWebpushNotification.renotify = firebaseWebpushNotification.renotify;
    huaweiWebpushNotification.requireInteraction = firebaseWebpushNotification.requireInteraction;
    huaweiWebpushNotification.silent = firebaseWebpushNotification.silent;
    huaweiWebpushNotification.tag = firebaseWebpushNotification.tag;
    huaweiWebpushNotification.timestamp = firebaseWebpushNotification.timestamp;
    huaweiWebpushNotification.vibrate = firebaseWebpushNotification.vibrate
      ? (
        Array.isArray(firebaseWebpushNotification.vibrate)
          ? firebaseWebpushNotification.vibrate.map(v => v.toString())
          : [firebaseWebpushNotification.vibrate.toString()]
        )
      : undefined;
    return huaweiWebpushNotification;
  }

  /**
   * @param {import('firebase-admin/lib/messaging/messaging-api').BaseMessage['android']} [firebaseAndroidConfig]
   */
  static toHuaweiAndroid(firebaseAndroidConfig) {
    if (!firebaseAndroidConfig) {
      return
    }
    /** @type {import('hcm-admin/src/push/modle/message').AndroidConfig} */
    const huaweiAndroidConfig = {}
    if (firebaseAndroidConfig.collapseKey && (+firebaseAndroidConfig.collapseKey).toString() === firebaseAndroidConfig.collapseKey) {
      huaweiAndroidConfig.collapse_key = +firebaseAndroidConfig.collapseKey
    }
    if (typeof firebaseAndroidConfig.ttl === 'number') {
      huaweiAndroidConfig.ttl = firebaseAndroidConfig.ttl.toString()
    }
    if (firebaseAndroidConfig.priority) {
      huaweiAndroidConfig.urgency = firebaseAndroidConfig.priority.toUpperCase()
    }
    if (firebaseAndroidConfig.data) {
      huaweiAndroidConfig.data = JSON.stringify(firebaseAndroidConfig.data)
    }
    if (firebaseAndroidConfig.notification) {
      huaweiAndroidConfig.notification = HuaweiMessage.toHuaweiAndroidNotification(firebaseAndroidConfig.notification)
    }
    return huaweiAndroidConfig;
  }

  /** @param {import('firebase-admin/lib/messaging/messaging-api').AndroidNotification} firebaseAndroidNotification */
  static toHuaweiAndroidNotification(firebaseAndroidNotification) {
    if (!firebaseAndroidNotification) {
      return;
    }
    /** @type {import('hcm-admin/src/push/modle/message').AndroidNotification} */
    const hauweiAndroidNotification = {}
    hauweiAndroidNotification.title = firebaseAndroidNotification.title;
    hauweiAndroidNotification.body = firebaseAndroidNotification.body;

    hauweiAndroidNotification.auto_cancel = undefined;
    hauweiAndroidNotification.auto_clear = undefined;
    hauweiAndroidNotification.badge = firebaseAndroidNotification.notificationCount;
    hauweiAndroidNotification.big_body = undefined;
    hauweiAndroidNotification.big_picture = undefined;
    hauweiAndroidNotification.big_title = undefined;
    hauweiAndroidNotification.body_loc_args = firebaseAndroidNotification.bodyLocArgs;
    hauweiAndroidNotification.body_loc_key = firebaseAndroidNotification.bodyLocKey;
    hauweiAndroidNotification.channel_id = firebaseAndroidNotification.channelId;
    hauweiAndroidNotification.click_action = firebaseAndroidNotification.clickAction ? { type: 1, intent: firebaseAndroidNotification.clickAction } : undefined;
    hauweiAndroidNotification.color = firebaseAndroidNotification.color;
    hauweiAndroidNotification.default_sound = firebaseAndroidNotification.defaultSound;
    hauweiAndroidNotification.foreground_show = undefined;
    hauweiAndroidNotification.group = undefined;
    hauweiAndroidNotification.icon = firebaseAndroidNotification.icon;
    hauweiAndroidNotification.image = firebaseAndroidNotification.imageUrl;
    hauweiAndroidNotification.importance = undefined;
    hauweiAndroidNotification.light_settings = firebaseAndroidNotification.lightSettings ? {
      color: firebaseAndroidNotification.lightSettings.color,
      light_on_duration: firebaseAndroidNotification.lightSettings.lightOnDurationMillis.toString(),
      light_off_duration: firebaseAndroidNotification.lightSettings.lightOffDurationMillis.toString(),
    } : undefined;
    hauweiAndroidNotification.multi_lang_key = undefined;
    hauweiAndroidNotification.notify_id = undefined;
    hauweiAndroidNotification.notify_summary;
    hauweiAndroidNotification.sound = firebaseAndroidNotification.sound;
    hauweiAndroidNotification.style = undefined;
    hauweiAndroidNotification.tag = firebaseAndroidNotification.tag;
    hauweiAndroidNotification.ticker = firebaseAndroidNotification.ticker;
    hauweiAndroidNotification.title_loc_args = firebaseAndroidNotification.titleLocArgs;
    hauweiAndroidNotification.title_loc_key = firebaseAndroidNotification.titleLocKey;
    hauweiAndroidNotification.use_default_light = firebaseAndroidNotification.defaultLightSettings;
    hauweiAndroidNotification.use_default_vibrate = firebaseAndroidNotification.defaultVibrateTimings;
    hauweiAndroidNotification.vibrate_config = firebaseAndroidNotification.vibrateTimingsMillis ? firebaseAndroidNotification.vibrateTimingsMillis.map(v => v.toString()) : undefined;
    hauweiAndroidNotification.visibility = firebaseAndroidNotification.visibility;
    hauweiAndroidNotification.when = undefined;
    return hauweiAndroidNotification;
  }
}

module.exports = { HuaweiMessage }
