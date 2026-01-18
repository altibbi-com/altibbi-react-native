import React, { useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { init } from 'react-native-altibbi';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { AppHeader } from '../component/appHeader';
import { AppButton } from '../component/appButton';
import { AppCard } from '../component/appCard';

const Home = () => {
  useEffect(() => {
    const USER_JWT =
      ''
    const BASE_URL = '';

    init(USER_JWT, BASE_URL, 'ar', '');
  }, []);
  const navigation = useNavigation();

  const navigate = (page: string) => {
    navigation.navigate(page);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AppHeader title="Altibbi Example" subtitle="SDK Integration Demo" />

        <AppCard>
          <Text style={styles.sectionTitle}>Digital Health Services</Text>
          <Text style={styles.sectionSubtitle}>Access expert consultation and AI assistance</Text>

          <AppButton
            title="New Consultation"
            onPress={() => navigate('Consultation')}
          />

          <AppButton
            title="Ask Sina (AI Chat)"
            onPress={() => navigate('AskSina')}
            variant="secondary"
          />

          <AppButton
            title="My Consultations"
            onPress={() => navigation.navigate('ConsultationList', { userId: 3927 })}
            variant="secondary"
          />
        </AppCard>

        <AppCard>
          <Text style={styles.sectionTitle}>Administration</Text>
          <Text style={styles.sectionSubtitle}>Manage configurations and users</Text>

          <AppButton
            title="User Management"
            onPress={() => navigate('User')}
            variant="secondary"
          />
        </AppCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
});

export default Home;
