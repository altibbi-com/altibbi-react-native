import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  sendSinaMessage,
  createChat,
  getSinaChatMessages
} from 'react-native-altibbi';

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#10e1d0',
    flex: 1,
    borderRadius: 15,
    marginTop: 20,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewHolder: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  input: {
    marginVertical: 20,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    textAlign: 'auto',
  },
  input2: {
    marginTop: 20,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'auto',
    paddingLeft: 20,
    minHeight: 50,
  },
  input3: {
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    height: 40,
    marginRight: 20,
    width: 40,
  },
});
const AskSina = () => {
  const [text, setText] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>();

  const sendMessage = () => {
    if (sessionId && !text) {
      console.log('sessionId & Text is required');
      return;
    }
    sendSinaMessage(text, sessionId)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ScrollView style={{ backgroundColor: '#F3F3F4' }}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => {
            createChat().then((res) => {
              console.log('create chat', res.data);
              if (res.data.id) {
                console.log('create setSessionId', res.data.id);
                setSessionId(res.data.id);
              }
            });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create Chat</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Sina Chat message"
          value={text}
          onChangeText={(val) => setText(val)}
        />
        <TouchableOpacity
          onPress={() => {
            sendMessage();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
            if (sessionId) {
              getSinaChatMessages(sessionId).then((res) => {
                console.log(res);
              });
            }
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>List Message</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default AskSina;
