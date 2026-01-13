import React, { useState, useRef, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  Image,
} from 'react-native';

import { createSinaSession } from 'react-native-altibbi';

import { AppButton } from '../component/appButton';
import { colors } from '../theme/colors';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FE',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.gray,
    lineHeight: 16,
  },
  disclaimerContainer: {
    padding: 24,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#F8F9FE',
    paddingBottom: 30,
  },
  startButton: {
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  feedbackContainer: {
    marginTop: 8,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconBox1: {
    backgroundColor: '#F3E5F5',
  },
  iconBox2: {
    backgroundColor: '#c9c9df',
  },
  iconBox3: {
    backgroundColor: '#b8e4a8',
  },
  iconBox4: {
    backgroundColor: '#e8ddb8',
  },
  lottie1: {
    width: 40,
    height: 30,
  },
  lottie2: {
    width: 40,
    height: 35,
  },
  lottie3: {
    width: 20,
    height: 30,
  },
  lottie4: {
    width: 40,
    height: 40,
  },
  feedbackSuccess: {
    backgroundColor: colors.success + '15',
    borderColor: colors.success + '30',
  },
  feedbackError: {
    backgroundColor: colors.error + '15',
    borderColor: colors.error + '30',
  },
  textSuccess: {
    color: colors.success,
  },
  textError: {
    color: colors.error,
  },
});

const AskSina = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const isFocused = useIsFocused();

  const lottieRef1 = useRef<LottieView>(null);
  const lottieRef2 = useRef<LottieView>(null);
  const lottieRef3 = useRef<LottieView>(null);
  const lottieRef4 = useRef<LottieView>(null);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        lottieRef1.current?.play();
        lottieRef2.current?.play();
        lottieRef3.current?.play();
        lottieRef4.current?.play();
      }, 100);
    }
  }, [isFocused]);

  const handleStartSession = () => {
    setLoading(true);
    setFeedback(null);
    createSinaSession()
      .then((res) => {
        if (res.data.id) {
          props.navigation.navigate('SinaChatRoom', { sessionId: res.data.id });
        }
      })
      .catch((err) => {
        console.log(err);
        setFeedback({
          text: 'Failed to start a session. Please try again.',
          type: 'error',
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/icon/master_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>Hello, I'm Sina</Text>
          <Text style={styles.heroSubtitle}>
            Your Advanced AI Health Assistant
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.grid}>
            <View style={styles.featureCard}>
              <View style={[styles.iconBox, styles.iconBox1]}>
                <LottieView
                  ref={lottieRef1}
                  source={require('../assets/lottile/health_risk_assessment.json')}
                  autoPlay
                  loop
                  style={styles.lottie1}
                />
              </View>
              <Text style={styles.featureTitle}>Symptom Check</Text>
              <Text style={styles.featureDesc}>
                Analyze your symptoms instantly
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.iconBox, styles.iconBox2]}>
                <LottieView
                  ref={lottieRef2}
                  source={require('../assets/lottile/medicine_tablet.json')}
                  autoPlay
                  loop
                  style={styles.lottie2}
                />
              </View>
              <Text style={styles.featureTitle}>Medication Info</Text>
              <Text style={styles.featureDesc}>Usage, side effects & more</Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.iconBox, styles.iconBox3]}>
                <LottieView
                  ref={lottieRef3}
                  source={require('../assets/lottile/lock_animation.json')}
                  autoPlay
                  loop
                  style={styles.lottie3}
                />
              </View>
              <Text style={styles.featureTitle}>Private & Secure</Text>
              <Text style={styles.featureDesc}>
                Your data is always protected
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.iconBox, styles.iconBox4]}>
                <LottieView
                  ref={lottieRef4}
                  source={require('../assets/lottile/hours.json')}
                  autoPlay
                  loop
                  style={styles.lottie4}
                />
              </View>
              <Text style={styles.featureTitle}>24/7 Availability</Text>
              <Text style={styles.featureDesc}>
                Always here when you need me
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {feedback && (
          <View
            style={[
              styles.feedbackContainer,
              feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError,
            ]}
          >
            <Text
              style={[
                styles.feedbackText,
                feedback.type === 'success' ? styles.textSuccess : styles.textError,
              ]}
            >
              {feedback.text}
            </Text>
          </View>
        )}
        <AppButton
          title="Start New Session"
          onPress={handleStartSession}
          loading={loading}
          containerStyle={styles.startButton}
        />
      </View>
    </View>
  );
};

export default AskSina;
