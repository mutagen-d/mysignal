# Firebase and Huawei Cloud Messaging SDK for Nodejs
This the wrapper on [`firebase-admin`](https://github.com/firebase/firebase-admin-node) and [`hcm-admin`](https://github.com/mutagen-d/hcm-admin)

## Contents

- [Install](#install)
- [Usage](#usage)
- [Subscribe/unsubscribe](#subscribeunsubscribe)
- [Sending messages](#sending-messages)

## Install
This package depends on [`firebase-admin`](https://github.com/firebase/firebase-admin-node). Make sure to install it.

```bash
npm install firebase-admin mysignal
```

## Usage 

```js
const { MysignalAdmin } = require('mysignal')
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('./firebase-service-account.json')
const huaweiConfig = require('./huawei-config.json')

const admin = new MysignalAdmin()
// initialize FCM and HCM
admin.initializeApp({
  firebase: {
    credential: firebaseAdmin.credential.cert(serviceAccount),
  },
  huawei: {
    appId: huaweiConfig.appId,
    appSecret: huaweiConfig.appSecret,
  }
})
// or just initialize one service
// firebase
admin.initializeFirebase({
  credential: firebaseAdmin.credential.cert(serviceAccount),
})
// or huawei
admin.initializeHuawei(huaweiConfig)

// send notification
await admin.messaging().send({
  token: '<some push token>',
  notification: {
    title: '<title>',
    body: '<message>',
  },
  data: { hello: 'world' },
})

```

## Subscribe/unsubscribe

```js
await admin.messaging().subscribeToTopic([token1, token2], topicName)
await admin.messaging().unsubscribeFromTopic([token1, token2], topicName)
```

## Sending messages

```js
// to topic
await admin.messaging().sendToTopic(topicName, {
  notification: {
    title: '<title>',
    body: '<body>',
  },
  data: { hello: 'world' },
})

// conditional
await admin.messaging().send({
  condition: "'topicA' in topics || 'topicB' in topics",
  notification: {
    title: '<title>',
    body: '<body>',
  },
  data: { hello: 'world' },
})

// individual
await admin.messaging().send({
  token: '<token>',
  notification: {
    title: '<title>',
    body: '<body>',
  },
  data: { hello: 'world' },
})

// multicast
await admin.messaging().sendEach({
  tokens: ['<token1>', '<token2>'],
  notification: {
    title: '<title>',
    body: '<body>',
  },
  data: { hello: 'world' },
})
```