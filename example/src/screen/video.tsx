import React, { useRef, useState } from 'react';
import {
  TBIPublisher,
  TBISession,
  TBISubscriber,
  TBISubscriberView,
  cancelConsultation,
  getLastConsultation,
} from 'react-native-altibbi';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';

const Video = (props) => {
  const data = props.route.params.event;
  const voip = props.route.params.voip;
  const consultationId = props.route.params.consultationId;

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

  const handleEndCall = () => {
    if (consultationId) {
      cancelConsultation(consultationId)
        .then(() => {
          props.navigation.navigate('Consultation');
        })
        .catch((err) => {
          props.navigation.navigate('Consultation');
        });
    } else {
      props.navigation.navigate('Consultation');
    }
  };

  const handleSessionDisconnected = () => {
    getLastConsultation()
      .then((res) => {
        const consultation = res.data && res.data[0];
        if (consultation) {
          if (consultation.status === 'closed') {
            props.navigation.navigate('Consultation');
          } else if (consultation.chatConfig) {
            props.navigation.navigate('ChatRoom', {
              event: {
                ...consultation.chatConfig,
                doctor_name: consultation.doctor_name,
                doctor_avatar: consultation.doctor_avatar,
                consultationId: consultation.id,
              },
            });
          } else {
            props.navigation.navigate('Consultation');
          }
        } else {
          props.navigation.navigate('Consultation');
        }
      })
      .catch((err) => {
        props.navigation.navigate('Consultation');
      });
  };

  const renderSubscribers = (subscribers) => {
    if (subscribers && subscribers.length > 0) {
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get('window');
      return subscribers.map((streamId) => (
        <TBISubscriberView
          key={streamId}
          streamId={streamId}
          style={styles.subscriberView}
        />
      ));
    }
    return (
      <View style={styles.waitingContainer}>
        <Text style={styles.waitingText}>Waiting for doctor to join...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TBISession
        eventHandlers={{
          sessionDisconnected: handleSessionDisconnected,
        }}
        apiKey={data.api_key}
        sessionId={data.call_id}
        token={data.token}
      >
        <View style={styles.subscriberContainer}>
          <TBISubscriber
            eventHandlers={{
              error: (event) => { },
              otrnError: (event) => { },
            }}
          >
            {renderSubscribers}
          </TBISubscriber>
        </View>

        <View style={styles.publisherWrapper}>
          <TBIPublisher
            style={styles.publisher}
            properties={{
              cameraPosition: camera,
              publishVideo: video,
              publishAudio: audio,
              enableDtx: true,
            }}
            eventHandlers={{
              streamDestroyed: (event) => {
                console.log('eventHandlers streamDestroyed 1', event);
              },
              error: (event) => {
                console.log('eventHandlers error 1', event);
              },
              otrnError: (event) => {
                console.log('eventHandlers otrnError 1', event);
              },
              onError: (event) => {
                console.log('eventHandlers onError 1', event);
              },
            }}
          />
        </View>

        <SafeAreaView style={styles.overlayContainer}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.circularButton, !audio && styles.inactiveButton]}
              onPress={toggleAudio}
            >
              {!audio && <View style={styles.crossLine} />}
              <Text style={[styles.buttonText, !audio && styles.inactiveText]}>
                {audio ? 'Audio' : 'Muted'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circularButton, styles.endCallButton]}
              onPress={handleEndCall}
            >
              <Text style={styles.buttonText}>End</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circularButton, !video && styles.inactiveButton]}
              onPress={toggleVideo}
            >
              {!video && <View style={styles.crossLine} />}
              <Text style={[styles.buttonText, !video && styles.inactiveText]}>
                {video ? 'Video' : 'Off'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circularButton}
              onPress={switchCamera}
            >
              <Text style={styles.buttonText}>Flip</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TBISession>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  subscriberContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '500',
  },
  publisherWrapper: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: 'rgba(255,255,255,0.33)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#000',
  },
  publisher: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  circularButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(44,43,43,0.36)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inactiveButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.error || 'red',
  },
  endCallButton: {
    backgroundColor: colors.error,
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  buttonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    zIndex: 1,
  },
  inactiveText: {
    color: colors.error || 'red',
  },
  crossLine: {
    position: 'absolute',
    width: '120%',
    height: 2,
    backgroundColor: colors.error || 'red',
    transform: [{ rotate: '-45deg' }],
  },
  subscriberView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default Video;
