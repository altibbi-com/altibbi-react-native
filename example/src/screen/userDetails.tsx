import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getUser } from 'react-native-altibbi';
import { AppHeader } from '../component/appHeader';
import { AppCard } from '../component/appCard';
import { AppButton } from '../component/appButton';
import { colors } from '../theme/colors';

const UserDetails = (props) => {
  const { data: initialData } = props.route.params;
  const [userData, setUserData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const fetchUserDetails = async () => {
    if (!userData.id) return;
    try {
      setLoading(true);
      const res = await getUser(userData.id.toString());
      setUserData(res.data);
    } catch (error) {
      console.error('Error refreshing user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserDetails();
    }
  }, [isFocused]);

  const DetailItem = ({ label, value, color = colors.text }) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="User Details" subtitle={`ID: ${userData.id}`} />
      {loading && !userData.name ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AppCard>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              {loading && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </View>
            <DetailItem label="Name" value={userData.name} />
            <DetailItem label="Phone Number" value={userData.phone_number} />
            <DetailItem label="Email" value={userData.email} />
            <DetailItem label="Date of Birth" value={userData.date_of_birth} />
            <DetailItem label="Gender" value={userData.gender?.toUpperCase()} />
            <DetailItem
              label="Nationality Number"
              value={userData.nationality_number}
            />
          </AppCard>

          <AppCard>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            <DetailItem label="Insurance ID" value={userData.insurance_id} />
            <DetailItem label="Policy Number" value={userData.policy_number} />
            <DetailItem
              label="Height"
              value={userData.height ? `${userData.height} cm` : 'N/A'}
            />
            <DetailItem
              label="Weight"
              value={userData.weight ? `${userData.weight} kg` : 'N/A'}
            />
            <DetailItem
              label="Blood Type"
              value={userData.blood_type?.toUpperCase()}
            />
            <DetailItem
              label="Smoker"
              value={userData.smoker === 'yes' ? 'Yes' : 'No'}
            />
            <DetailItem
              label="Alcoholic"
              value={userData.alcoholic === 'yes' ? 'Yes' : 'No'}
            />
            <DetailItem
              label="Marital Status"
              value={userData.marital_status?.toUpperCase()}
            />
            <DetailItem
              label="Relation Type"
              value={userData.relation_type?.toUpperCase()}
            />
          </AppCard>

          <AppButton
            title="Edit Profile"
            onPress={() =>
              props.navigation.navigate('EditUser', { data: userData })
            }
            containerStyle={styles.editButtonMargin}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 0,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  editButtonMargin: {
    marginTop: 8,
    marginBottom: 24,
  },
});

export default UserDetails;
