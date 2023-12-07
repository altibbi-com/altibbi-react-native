import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TBIConstants } from 'react-native-altibbi';
import { cancelConsultation } from 'react-native-altibbi';
import { getLastConsultation } from 'react-native-altibbi';
import { TBISocket } from 'react-native-altibbi';

const WaitingRoom = (props) => {
  const { channel, socketKey, consultationId } = props?.route?.params;
  const instance = TBISocket.getInstance();

  const disconnect = () => instance?.disconnect();

  const log = (line) => {
    console.log(line);
  };

  const onConnectionStateChange = (currentState, previousState) => {
    log(
      `onConnectionStateChange. previousState=${previousState} newState=${currentState}`
    );
  };

  const onError = (message, code, error) => {
    log(`onError: ${message} code: ${code} exception: ${error}`);
  };

  const onEvent = (eventData) => {
    if (eventData != null && eventData.eventName === 'call-status') {
      let event = JSON.parse(eventData.data);
      if (event.status === 'in_progress') {
        getCurrentConsultationInfo();
      }
    }
  };
  const getCurrentConsultationInfo = () => {
    getLastConsultation().then((res) => {
      console.log(res);
      redirectToNext(res.data[0]);
    });
  };

  const onSubscriptionSucceeded = (channelName, data) => {
    log(
      `onSubscriptionSucceeded: ${channelName} data: ${JSON.stringify(data)}`
    );
  };

  const onSubscriptionCount = (channelName, subscriptionCount) => {
    log(
      `onSubscriptionCount: ${subscriptionCount}, channelName: ${channelName}`
    );
  };

  const onSubscriptionError = (channelName, message, e) => {
    log(`onSubscriptionError: ${message}, channelName: ${channelName} e: ${e}`);
  };

  const onDecryptionFailure = (eventName, reason) => {
    log(`onDecryptionFailure: ${eventName} reason: ${reason}`);
  };

  const onMemberAdded = (channelName, member) => {
    log(`onMemberAdded: ${channelName} user: ${member}`);
  };

  const onMemberRemoved = (channelName, member) => {
    log(`onMemberRemoved: ${channelName} user: ${member}`);
  };

  const connect = async () => {
    // try {
    //   connect({
    //     cluster: 'eu',
    //     key: pusherKey,
    //     token: TBIConstants.token,
    //     onError,
    //     onEvent,
    //     channelName: channel,
    //     onConnectionStateChange,
    //     onSubscriptionSucceeded,
    //     onSubscriptionError,
    //     onDecryptionFailure,
    //     onMemberAdded,
    //     onMemberRemoved,
    //     onSubscriptionCount,
    //   });
    // } catch (e) {
    //   log('ERROR: ' + e);
    // }
    try {
      await instance.init({
        apiKey: socketKey,
        cluster: 'eu',
        authEndpoint: `${TBIConstants.domain}/v1/auth/pusher?access-token=${TBIConstants.token}`,
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
      await instance.subscribe({ channelName: channel });
      await instance.connect();
    } catch (e) {
      throw new Error(`${e}`);
    }
  };

  const redirectToNext = (parmas) => {
    if (parmas.status === 'in_progress') {
      if (parmas.chatConfig) {
        props.navigation.navigate('ChatRoom', {
          event: parmas.chatConfig,
        });
      } else if (parmas.videoConfig) {
        props.navigation.navigate('Video', {
          event: parmas.videoConfig,
        });
      } else if (parmas.voipConfig) {
        props.navigation.navigate('Video', {
          event: parmas.voipConfig,
          voip: true,
        });
      }
    }
  };

  useEffect(() => {
    redirectToNext(props?.route?.params);
    connect().then();
  }, []);

  return (
    <View>
      <Text style={{ marginVertical: 20, fontSize: 20 }}>
        Waiting For Doctor
      </Text>
      <ActivityIndicator size={'large'} />

      <Text
        onPress={() => {
          cancelConsultation(consultationId).then((res) => {
            props.navigation.goBack();
          });
        }}
        style={{ color: 'blue', fontSize: 20 }}
      >
        Cancel current consultation
      </Text>
    </View>
  );
};

export default WaitingRoom;
