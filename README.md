This Flutter SDK provides integration for the Altibbi services, including video consultation, text consultation, push
notification, and many other features. This guide will walk you through the steps to integrate it into your Flutter
project.

## Installation

```sh
npm install react-native-altibbi
```

```sh
yarn add react-native-altibbi
```

## Usage

### initlizetion

Initialize the Altibbi service with the user token and partner endpoint as follows:
Note: Be sure to replace placeholders "USER_TOKEN" and "PARTNER_ENDPOINT" with your actual values.
language refer for the response language

#### import init function to initialize Altibbi service

```js
import { init } from 'react-native-altibbi';
```

```js
init('PARTNER_ENDPOINT', 'LANGUAGE', 'USER_TOKEN');
```

note that the USER_TOKEN should be retrieved from your backend

### USER API

| APi        | params             |
|------------|--------------------|
| getUser    | USER_ID (required) |
| getUsers   | page , perPage     |
| createUser | user data          |
| updateUser | userId             |
| deleteUser | userId             |

#### getUser

```js
import { getUser } from 'react-native-altibbi';
```

```js
const response = await getUser(user_id)
```

#### getUsers

```js
import { getUsers } from 'react-native-altibbi';
```

```js
const response = await getUsers(page, per_page)
```

#### createUser

```js
import { createUser } from 'react-native-altibbi';
```

```js
const params = {
  name: "Altibbi",
}
const response = await createUser(params)
```

#### updateUser

```js
import { updateUser } from 'react-native-altibbi';
```

```js
const params = {
  name: "Altibbi",
}
const response = await updateUser(params)
```

#### deleteUser

```js
import { deleteUser } from 'react-native-altibbi';
```

```js
const response = await updateUser(user_id)
```

### Consultation API

| APi                 | params                                                                               |
|---------------------|--------------------------------------------------------------------------------------|
| createConsultation  | question (required)  , medium (required) , userId (required) , mediaIds , followUpId |
| getConsultationInfo | consultationId                                                                       |
| getLastConsultation |                                                                                      |
| getConsultationList | userId (required), page, perPage                                                     |
| deleteConsultation  | consultationId                                                                       |
| cancelConsultation  | consultationId                                                                       |

#### createConsultation

```js
import { createConsultation } from 'react-native-altibbi';
```

```js
const params = {
  question,
  medium,
  userId,
}
const response = await createConsultation(params)
```

#### getConsultationInfo

```js
import { getConsultationInfo } from 'react-native-altibbi';
```

```js
const response = await getConsultationInfo(consultation_id)
```

#### deleteUser

```js
import { getLastConsultation } from 'react-native-altibbi';
```

```js
const response = await getLastConsultation()
```

#### getConsultationList

```js
import { getConsultationList } from 'react-native-altibbi';
```

```js
const response = await getConsultationList(user_id, page, per_page)
```

#### deleteConsultation

```js
import { deleteConsultation } from 'react-native-altibbi';
```

```js
const response = await deleteConsultation(consultation_id)
```

#### cancelConsultation

```js
import { cancelConsultation } from 'react-native-altibbi';
```

```js
const response = await cancelConsultation(consultation_id)
```

### TBISocket :

#### After create the consultation you have to use TBISocket to listen to consultation events

#### import TBIScoket

```js
import { TBISocket } from 'react-native-altibbi';
```

```js
const instance = TBISocket.getInstance();
```

#### connect && subscribe to listen to event

```js
await instance.init({
  apiKey: API_KEY, // app key retrived by api
  cluster: 'eu',
  authEndpoint: `${PARTNER_ENDPOINT}/v1/auth/pusher?access-token=${USER_TOKEN}`,
  onConnectionStateChange,
  onError,
  onEvent,
  onSubscriptionSucceeded,
  onSubscriptionError,
  onDecryptionFailure,
  onMemberAdded,
  onMemberRemoved,
  onSubscriptionCount,
});
await instance.subscribe({ channelName: CHANNEL_NAME });
await instance.connect();
```

### Video Consultation

#### import video components

```js
import {
  TBIPublisher,
  TBISession,
  TBISubscriber,
  TBISubscriberView,
} from 'react-native-altibbi';
```

```js
<TBISession
  options={{
    androidZOrder: 'onTop',
    androidOnTop: 'publisher',
  }}
  ref={(ref) => (sessionRef.current = ref)}
  apiKey={API_KEY} //retrived from api
  sessionId={CALL_ID}//retrived from api
  token={TOKEN}//retrived from api
  eventHandlers={{
    streamDestroyed: (event) => {
    },
    error: (event) => {
    },
    otrnError: (event) => {
    },
  }}
>
  <TBISubscriber
    eventHandlers={{
      error: (event) => {
      },
      otrnError: (event) => {
      },
    }}
  >
    {renderSubscribers}
  </TBISubscriber>
  <TBIPublisher
    properties={{
      cameraPosition: 'front',
      publishVideo: true, // false if it voip consultation
      publishAudio: true,
      enableDtx: true,
    }}
    eventHandlers={{
      streamDestroyed: (event) => {
      },
      error: (event) => {
      },
      otrnError: (event) => {
      },
    }}
  />
</TBISession>
```

### Chat Consultation

#### import the components

```js
import {
  AltibbiChat,
} from 'react-native-altibbi';
```

```js
const ref = useRef(null);

const init = () => {
  AltibbiChat.init({
    appId: APP_ID,
    modules: [new GroupChannelModule()],
  });
};

const connect = async () => {
  await ref?.current?.connect(data.chat_user_id, data.chat_user_token);
};

const addHandler = () => {
  let groupChannelHandler = new GroupChannelHandler({
    onUserJoined,
    onUserLeft,
    onTypingStatusUpdated,
    onMessageReceived,
  });

  let connectionHandler = new ConnectionHandler({
    onConnected,
    onReconnectStarted,
    onReconnectSucceeded,
    onReconnectFailed,
    onDisconnected,
  });
  ref?.current?.groupChannel?.addGroupChannelHandler(
    'CHA_HAN',
    groupChannelHandler
  );
  ref?.current?.addConnectionHandler('CHA_CONN', connectionHandler);
};

const loadAllMessage = async (channelURL) => {
  const channel = await getChannel(channelURL);
  const previousMessageList = await channel.createPreviousMessageListQuery();
  let allMessages = [];

  while (previousMessageList.hasNext) {
    let newMsgArr = await previousMessageList.load();
    allMessages = [...allMessages, ...newMsgArr];
  }
  return allMessages;
};

```

```js
useEffect(() => {
  const chatStart = async () => {
    init();
    addHandler();
    connect().then(() => {
      loadAllMessage(`channel_${data.group_id}`).then((res) => {
        setMessageList(res);
        setLoading(false);
      });
    });
  };
  chatStart();
}, []);
```


## Support

If you need support you can contact: [mobile@altibbi.com](mobile@altibbi.com). Please
ensure that you are referencing the latest version of our SDK to access all available features and improvements.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
