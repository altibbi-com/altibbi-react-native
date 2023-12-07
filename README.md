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

## Support

If you need support you can contact: [mobile@altibbi.com](mobile@altibbi.com). Please
ensure that you are referencing the latest version of our SDK to access all available features and improvements.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
