import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, InteractionManager } from 'react-native';
import LottieView from 'lottie-react-native';
import { AppHeader } from '../component/appHeader';
import { AppButton } from '../component/appButton';
import { colors } from '../theme/colors';
import {
  TBISocketEvent,
  TBISocket,
  cancelConsultation,
  getLastConsultation,
} from 'react-native-altibbi';

const WaitingRoom = (props) => {
  const { channel, socketParams } = props?.route?.params;
  const [consultationId, setConsultationId] = useState<number | undefined>(
    props?.route?.params?.consultationId
  );
  const lottieRef = useRef<LottieView>(null);
  const instance: TBISocket = TBISocket.getInstance();
  const redirecting = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      lottieRef.current?.play();
    }, 100);
  }, []);

  const disconnect = () => instance?.disconnect();


  const onEvent = (eventData: TBISocketEvent) => {

    try {
      const data = JSON.parse(eventData.data);
      if (eventData.eventName === 'call-status') {
        if (data.status === 'in_progress' || data.status === 'accepted') {
          getCurrentConsultationInfo();
        }
      } else if (
        eventData.eventName === 'video-conference-ready' ||
        eventData.eventName === 'voip-conference-ready'
      ) {
        const cid =
          data.consultation_id || data.id || consultationId;
        if (cid) setConsultationId(cid);

        redirectToNext({
          status: 'in_progress',
          videoConfig:
            eventData.eventName === 'video-conference-ready' ? data : undefined,
          voipConfig:
            eventData.eventName === 'voip-conference-ready' ? data : undefined,
          id: cid,
        });
      } else if (eventData.eventName === 'chat-conference-ready') {
        const cid =
          data.consultation_id || data.id || consultationId;
        if (cid) setConsultationId(cid);
      }
    } catch (e) {
      // Error parsing event data
    }
  };

  const getCurrentConsultationInfo = () => {
    if (redirecting.current) return;

    getLastConsultation()
      .then((res) => {
        const consultation = res.data && res.data[0];
        if (consultation) {
          if (consultation.id) setConsultationId(consultation.id);
          redirectToNext(consultation);
        }
      })
      .catch((err) => {
        // Error polling consultation
      });
  };

  const onConnectionStateChange = (
    previousState: string
  ) => {
    // Connection state change
  };

  const onError = (message: string, code: Number, error: any) => {
    // Socket Error
  };

  const connect = async () => {
    try {
      await instance.init({
        ...socketParams,
        ...{
          onConnectionStateChange,
          onError,
          onEvent,
          onSubscriptionSucceeded: () => { },
          onSubscriptionError: () => { },
          onMemberAdded: () => { },
          onMemberRemoved: () => { },
        },
      });
      await instance.subscribe({ channelName: channel });
      await instance.connect();
    } catch (e) {
      // Socket connect attempt failed
    }
  };

  const redirectToNext = (params) => {
    if (!params || redirecting.current) return;

    const hasChat = !!params.chatConfig;
    const hasVideo = !!params.videoConfig;
    const hasVoip = !!params.voipConfig;
    const cid = params.id || params.consultationId || consultationId;
    const isDoctorJoined = params.status === 'in_progress';

    if (isDoctorJoined && (hasChat || hasVideo || hasVoip)) {
      redirecting.current = true;

      InteractionManager.runAfterInteractions(() => {
        if (hasChat) {
          props.navigation.replace('ChatRoom', {
            event: {
              ...params.chatConfig,
              doctor_name: params.doctor_name || params.chatConfig.doctor_name,
              doctor_avatar:
                params.doctor_avatar || params.chatConfig.doctor_avatar,
              consultationId: cid,
            },
          });
        } else {
          props.navigation.replace('Video', {
            event: params.videoConfig || params.voipConfig,
            voip: hasVoip,
            consultationId: cid,
          });
        }
      });
      return;
    }

    if (hasChat || hasVideo || hasVoip) {
      // Waiting for doctor to join
    }
  };

  useEffect(() => {
    redirectToNext(props?.route?.params);
    connect();

    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    let interval: any;

    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (!redirecting.current) {
          getCurrentConsultationInfo();
        }
      }, 4000);
    };

    const stopPolling = () => {
      if (interval) clearInterval(interval);
    };

    const unsubscribeFocus = props.navigation.addListener('focus', startPolling);
    const unsubscribeBlur = props.navigation.addListener('blur', stopPolling);

    // Start polling on mount
    startPolling();

    return () => {
      stopPolling();
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      <AppHeader
        title="Waiting Room"
        subtitle="Connecting you with a doctor..."
      />

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <LottieView
            ref={lottieRef}
            source={require('../assets/lottile/doctor.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.title}>Waiting for Doctor</Text>
          <Text style={styles.subtitle}>
            Please stay on this screen. A doctor will join the consultation
            shortly.
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <AppButton
            title="Cancel Consultation"
            variant="danger"
            onPress={() => {
              const cid = consultationId;
              if (cid) {
                cancelConsultation(cid)
                  .then(() => {
                    props.navigation.goBack();
                  })
                  .catch((err) => {
                    props.navigation.goBack();
                  });
              } else {
                props.navigation.goBack();
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '80%',
  },
  actionContainer: {
    width: '100%',
  },
});
export default WaitingRoom;
