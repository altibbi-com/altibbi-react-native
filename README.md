This React native SDK provides integration for the Altibbi services, including video consultation, text consultation, push
Welcome to the React Native SDK for Altibbi services, your comprehensive solution for integrating health consultation services into your React Native applications. This SDK enables video and text consultations, push notifications, and many other features to provide a seamless healthcare experience.
project.


## Features
- **Video and VOIP Consultation:** Facilitate live video and VOIP sessions between patients and healthcare professionals.
- **GSM Consultation:** Facilitate GSM(Phone calls) sessions between patients and healthcare professionals.
- **Text Consultation:** Offer real-time text messaging for healthcare inquiries.
- **User Management:** Easily manage user information with our comprehensive API.
- **Real-time Notifications:** Keep users updated with push notifications and server to server real time callbacks.

## Prerequisites
- React Native 0.60 or higher
- Node.js 16 or higher

## Installation
Install the SDK with npm:

```sh
npm install react-native-altibbi
```
Or with yarn:

```sh
yarn add react-native-altibbi
```


## Initialization
Initialize the Altibbi SDK with the following parameters:
- **PARTNER_ENDPOINT:** Your partner endpoint (will be shared with you upon request).
- **token:** Authentication token from your backend.
- **language:** Preferred language for responses either Arabic (default) or English.


```js
import { init } from 'react-native-altibbi';

init('TOKEN', 'PARTNER_ENDPOINT', 'LANGUAGE');
```


## Detailed Usage


### User API
Manage users with functions like `createUser`, `updateUser`,`getUser`, `getUsers`, and `deleteUser`. Below are examples of how to use these functions:


### USER API

| APi        | params             |
|------------|--------------------|
| getUser    | USER_ID (required) |
| getUsers   | page , perPage     |
| createUser | user data          |
| updateUser | userId             |
| deleteUser | userId             |


#### createUser Example

```js
import { createUser } from 'react-native-altibbi';

const params = {
  name: "Altibbi",
}
const response = await createUser(params)
```


#### updateUser Example

```js
import { updateUser } from 'react-native-altibbi';

const params = {
  name: "Altibbi",
}
const response = await updateUser(params)
```


#### getUser Example
```js
import { getUser } from 'react-native-altibbi';

const response = await getUser(user_id)
```


#### getUsers Example

```js
import { getUsers } from 'react-native-altibbi';
const response = await getUsers(page, per_page)
```

#### deleteUser

```js
import { deleteUser } from 'react-native-altibbi';

const response = await updateUser(user_id)
```




### Consultation API
Create and manage consultations using our suite of functions:


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

const response = await getConsultationInfo(consultation_id)
```

#### getConsultationList

```js
import { getConsultationList } from 'react-native-altibbi';

const response = await getConsultationList(user_id, page, per_page)
```

#### deleteConsultation

```js
import { deleteConsultation } from 'react-native-altibbi';

const response = await deleteConsultation(consultation_id)
```

#### cancelConsultation

```js
import { cancelConsultation } from 'react-native-altibbi';

const response = await cancelConsultation(consultation_id)
```

### TBISocket :

#### After creating the consultation you can use TBISocket to listen to consultation status events


```js
import { TBISocket } from 'react-native-altibbi';
```

```js
const instance = TBISocket.getInstance();
```

#### connect && subscribe to listen to event

```js
await instance.init({...socketParams,// socketParams retrived from consultation Object in SDK
...{
  onConnectionStateChange,
  onError,
  onEvent,
  onSubscriptionSucceeded,
  onSubscriptionError,
  onDecryptionFailure,
  onMemberAdded,
  onMemberRemoved,
  onSubscriptionCount,
}});
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
  apiKey={API_KEY} //retrived from consultation Object in SDK
  sessionId={CALL_ID}//retrived from consultation Object in SDK
  token={TOKEN}//retrived from consultation Object in SDK
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
      publishVideo: true, // set to false in voip consultation
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

For support, contact: [mobile@altibbi.com](mobile@altibbi.com). Please
ensure that you are referencing the latest version of the SDK to access all available features and improvements.


## License

This project is licensed under the MIT License.

---
