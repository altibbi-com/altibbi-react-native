import React, { useRef, useState } from 'react';
import {
  TBIPublisher,
  TBISession,
  TBISubscriber,
  TBISubscriberView,
} from 'react-native-altibbi';
import { Dimensions, View, Text } from 'react-native';

const Video = (props) => {
  const data = props.route.params.event;
  const voip = props.route.params.voip;

  const [audio, setAudio] = useState<boolean>(true);
  const [video, setVideo] = useState<boolean>(!voip);
  const [camera, setCamera] = useState<'front' | 'back'>('front');
  const sessionRef = useRef(null);

  const toggleVideo = () => setVideo((prev) => !prev);
  const toggleAudio = () => setAudio((prev) => !prev);
  const switchCamera = () =>
    setCamera((prev) => {
      if (prev === 'front') {
        return 'back';
      } else {
        return 'front';
      }
    });

  const renderSubscribers = (subscribers) => {
    if (subscribers && subscribers.length > 0) {
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get('window');
      return subscribers.map((streamId) => (
        <TBISubscriberView
          streamId={streamId}
          style={{ width: screenWidth, height: screenHeight }}
        />
      ));
    }
  };
  console.log('RRRRRRRR', data);
  return (
    <TBISession
      options={{
        androidZOrder: 'onTop',
        androidOnTop: 'publisher',
      }}
      ref={(ref) => (sessionRef.current = ref)}
      apiKey={data.api_key}
      sessionId={data.call_id}
      token={data.token}
      eventHandlers={{
        streamDestroyed: (event) => {},
        error: (event) => {},
        otrnError: (event) => {},
      }}
    >
      <TBISubscriber
        eventHandlers={{
          error: (event) => {},
          otrnError: (event) => {},
        }}
      >
        {renderSubscribers}
      </TBISubscriber>
      <TBIPublisher
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          top: 0,
          margin: 5,
          right: 0,
        }}
        properties={{
          cameraPosition: camera,
          publishVideo: video,
          publishAudio: audio,
          enableDtx: true,
        }}
        eventHandlers={{
          streamDestroyed: (event) => {},
          error: (event) => {},
          otrnError: (event) => {},
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          position: 'absolute',
          backgroundColor: 'white',
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            marginRight: 10,
            color: video ? 'blue' : 'red',
          }}
          onPress={() => toggleVideo()}
        >
          video ({video ? 'T' : 'F'})
        </Text>
        <Text
          style={{
            fontSize: 20,
            marginRight: 10,
            color: audio ? 'blue' : 'red',
          }}
          onPress={() => toggleAudio()}
        >
          audio ({audio ? 'T' : 'F'})
        </Text>
        <Text
          style={{ fontSize: 20, marginRight: 10 }}
          onPress={() => switchCamera()}
        >
          camera ({camera})
        </Text>
      </View>
    </TBISession>
  );
};

export default Video;
