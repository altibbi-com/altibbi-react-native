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
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2luc3VyYW5jZS5hbHRpYmIuY29tLyIsImF1ZCI6Imh0dHBzOi8vaW5zdXJhbmNlLmFsdGliYi5jb20vIiwiaWF0IjoxNzY4MjIwMjQ1LCJuYmYiOjE3NjgyMjAyNDUsImV4cCI6MTc2ODIyMzg0NSwidWlkIjozOTI3LCJkYXRhIjoiUm9BNFhWOS9iU1VUaXk4UTVrMG9ucTlzYWlBZkcxMFNZZ3lJMUJRM1UrcmZHYTRZVndsbXJyREpWdlUrSTRTRVE4ei8wcUtsSzJTWHZyaHhYSTZZNENFR3ppdURwZUFwQWEvSDgwWGU0dDUrWFFLT24zaXVYaG1vMVFoK1cvV2NYNWk2UTlUWW1WN2pWcllzQjdRU2FxdXM1NWNtalRjK1lmSlR2NktiYzh5YUJhemNibE9zaWZVVTdsalljb3A1NWtUUzB1NGsxRExSYmV1MlBCMjBTSTZsSlRxbGlsYkZFbHJVQm5aOWowaUFTL3QrYkN0Mithd3RlUkFDeWlmTjRqNk5CbGhZQmExdkxHY2FFZjV4QmFvUjJFTUlxcEcwenNsNHlPVDZTdW5FbjJnZ2tyMjQwWFlqenNGam1ySnFPRmxCVWtrU2JCWG9ld3o0d2NWeEZkL1F0U1Vuc01FMUR3eFJXMXc1OHp2bzdsa3Z5SUdFOG83dGVRSDFFVjkwSDBsTGNtMDkwTXRKc2FXeFdRQ0h5WEtzZkt3aDcrSzkzL0xoT3JHNTd0cktwL29EaEdHbk8xc1hVRmdOR2FQc21FNWFyZ0FYZ0s0NVc3MWp2K2NHQmFCUkROMTFRQS9mVTl5QjgxdTF6eFRnTWpxbjNYVCtLYmtKMVloc3VhNW9hQXpCcTU2OU1qVXpVU1VjY3FZWXRoU21MZFRCQklycS9NZmxoTmdROUdlclluanBoK3hWUVFSVjNjZU1kK2RORU9TdVBjSUg4UWY5S3hLblNQM2p0QT09In0.S1ih5gKQWSsY4I8ojCYZcaPCL0hBQHt-9-MnwZLcYSu7SClo0SvUswYRGJq4ukW24eEMfUgl819wTi_5iJp42EyBkW5tCZH2BIr2AI_LA76tplwUdEhn1r5k6H0wwWXzSnMzID-p8_wMnVa-xGmpREuM53Eb0TGDUhLKmfukqA9RBbcfyBJKsYFhO0FVQRhRfiyk1L_tmTOBM0zPRQxChHDnfKDIWIV0JoUfNQ9X38xryMP8S_mpNr0fiA6F8h7lx3kcsphRPZX_05aJCd-uYuze5YasTqCFa6sjh0v9qzcpLTHAgSzpljrbuor6mC3IyTDxitrsDEcC-1Bbmv3HZqWGzXEah-IqMkLknNv38jpYxTTp_v8_FhH93gZUC6QQy8vj8vp-x8iaNzM1uFluuZEHzzpkda7FeOlRZbUEO0Q6YmJqN6BC4MJMWeIK640yJTitzEqaF9B24xpSsrKlN8nO8HFsGac-DKcGZg9NNEHAXYvorPBcGEcpH1lQAG5uX79TOOei_56lUq6IA6ViooIDgMQcOQZE6bqzcmZCiK_pXqZWeR2QuJ6XIiXKTsnJvioeIqIbUeiCJy0F2qauhQ-OTkpgDk6_pmI3UnKDgiUTNnTmGEV4XLmjtIoi34MXdj26HuUg_AjtSWwqHydyiD7H5JS4h4ATfhliegg1K3U'
    const BASE_URL = 'https://insurance.altibb.com';

    init(USER_JWT, BASE_URL, 'ar', 'https://stg.asksina.ai/partners');
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
