import React, { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Modal as RNModal,
  Keyboard,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  BloodType,
  BoolString,
  GenderType,
  MaritalStatus,
  UserType,
  RelationType,
} from 'react-native-altibbi';
import {
  bloodTypeArray,
  boolStringArray,
  updateUser,
  genderTypeArray,
  materialStatusArray,
} from 'react-native-altibbi';
import { Radio } from '../component/radio';
import { relationTypeArray } from '../../../src/data';
import { AppHeader } from '../component/appHeader';
import { AppTextInput } from '../component/appTextInput';
import { AppButton } from '../component/appButton';
import { AppCard } from '../component/appCard';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const EditUser = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userData = route.params?.data || {};
  const scrollRef = useRef<ScrollView>(null);

  const [name, setName] = useState<string>(userData.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(
    userData.phone_number || ''
  );
  const [email, setEmail] = useState<string>(userData.email || '');
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    userData.date_of_birth || ''
  );
  const [gender, setGender] = useState<GenderType | undefined>(
    userData.gender || genderTypeArray[0]
  );
  const [insuranceId, setInsuranceId] = useState<string>(
    userData.insurance_id || ''
  );
  const [policyNumber, setPolicyNumber] = useState<string>(
    userData.policy_number || ''
  );
  const [nationalityNumber, setNationalityNumber] = useState<string>(
    userData.nationality_number || ''
  );
  const [height, setHeight] = useState<string>(
    userData.height?.toString() || ''
  );
  const [weight, setWeight] = useState<string>(
    userData.weight?.toString() || ''
  );
  const [bloodType, setBloodType] = useState<BloodType | undefined>(
    userData.blood_type
  );
  const [smoker, setSmoker] = useState<BoolString | undefined>(userData.smoker);
  const [alcoholic, setAlcoholic] = useState<BoolString | undefined>(
    userData.alcoholic
  );
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | undefined>(
    userData.marital_status
  );
  const [relationType, setRelationType] = useState<RelationType | undefined>(
    userData.relation_type
  );

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    userData.date_of_birth ? new Date(userData.date_of_birth) : new Date()
  );

  const handleUpdate = () => {
    if (!userData.id) {
      setErrorMessage('User ID is missing');
      return;
    }

    setIsSubmitting(true);
    const params: UserType = {
      name,
      phone_number: phoneNumber,
      email,
      date_of_birth: dateOfBirth,
      gender,
      insurance_id: insuranceId,
      policy_number: policyNumber,
      nationality_number: nationalityNumber,
      height,
      weight,
      blood_type: bloodType,
      smoker,
      alcoholic,
      marital_status: maritalStatus,
      relation_type: relationType,
    };

    updateUser(params, userData.id.toString())
      .then((res: any) => {
        console.log('User updated:', res);
        setSuccessMessage('User updated successfully!');
        setErrorMessage(null);
        navigation.goBack();
      })
      .catch((err: any) => {
        console.log('Update error:', err);
        setErrorMessage('Failed to update user. Please check your data.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 70}
      style={styles.mainWrapper}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.formContainerPadding}
      >
        <View style={styles.content}>
          <AppHeader
            title="Edit User"
            subtitle={`Updating ${userData.name || 'User'} (ID: ${userData.id
              })`}
          />

          <AppCard>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <AppTextInput
              label="Name"
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                Keyboard.dismiss();
                setOpen(true);
              }}
            >
              <AppTextInput
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            <RNModal
              visible={open}
              transparent
              animationType="slide"
              onRequestClose={() => setOpen(false)}
            >
              <View style={styles.modalOverlay}>
                <TouchableOpacity
                  style={styles.modalOverlayDismiss}
                  activeOpacity={1}
                  onPress={() => setOpen(false)}
                />
                <View style={styles.bottomSheet}>
                  <View style={styles.bottomSheetHeader}>
                    <TouchableOpacity onPress={() => setOpen(false)}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.bottomSheetTitle}>
                      Select Birth Date
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setOpen(false);
                        const formattedDate = date.toISOString().split('T')[0];
                        setDateOfBirth(formattedDate);
                      }}
                    >
                      <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                  <DatePicker
                    mode="date"
                    date={date}
                    onDateChange={setDate}
                    maximumDate={new Date()}
                    theme="light"
                    style={styles.datePicker}
                  />
                </View>
              </View>
            </RNModal>
            <Radio
              pick={[gender, setGender]}
              array={genderTypeArray}
              title={'Gender'}
            />
            <Radio
              pick={[maritalStatus, setMaritalStatus]}
              array={materialStatusArray}
              title={'Marital Status'}
            />
          </AppCard>

          <AppCard>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <AppTextInput
              label="Email"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AppTextInput
              label="Phone"
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <AppTextInput
              label="Nationality Number"
              placeholder="Nationality Number"
              value={nationalityNumber}
              onChangeText={setNationalityNumber}
            />
          </AppCard>

          <AppCard>
            <Text style={styles.sectionTitle}>Insurance Information</Text>
            <AppTextInput
              label="Insurance ID"
              placeholder="Insurance ID"
              value={insuranceId}
              onChangeText={setInsuranceId}
            />
            <AppTextInput
              label="Policy Number"
              placeholder="Policy Number"
              value={policyNumber}
              onChangeText={setPolicyNumber}
            />
          </AppCard>

          <AppCard>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            <View style={styles.row}>
              <View style={styles.flex1}>
                <AppTextInput
                  label="Height (cm)"
                  placeholder="Height"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.flex1}>
                <AppTextInput
                  label="Weight (kg)"
                  placeholder="Weight"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <Radio
              pick={[bloodType, setBloodType]}
              array={bloodTypeArray}
              title={'Blood Type'}
            />
            <Radio
              pick={[smoker, setSmoker]}
              array={boolStringArray}
              title={'Smoker'}
            />
            <Radio
              pick={[alcoholic, setAlcoholic]}
              array={boolStringArray}
              title={'Alcoholic'}
            />
            <Radio
              pick={[relationType, setRelationType]}
              array={relationTypeArray}
              title={'Relation Type'}
            />
          </AppCard>

          {successMessage && (
            <View style={[styles.feedbackContainer, styles.successFeedback]}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {errorMessage && (
            <View style={[styles.feedbackContainer, styles.errorFeedback]}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <AppButton
            title={isSubmitting ? 'Updating...' : 'Update User'}
            onPress={handleUpdate}
            disabled={isSubmitting}
            containerStyle={styles.updateButtonMargin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  feedbackContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  successFeedback: {
    backgroundColor: colors.success + '15',
    borderColor: colors.success,
  },
  errorFeedback: {
    backgroundColor: colors.error + '15',
    borderColor: colors.error,
  },
  successText: {
    color: colors.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalOverlayDismiss: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
  },
  bottomSheetHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    marginBottom: 10,
  },
  datePicker: {
    backgroundColor: colors.white,
    width: width - 40,
  },
  updateButtonMargin: {
    marginVertical: 16,
  },
  mainWrapper: {
    flex: 1,
  },
  formContainerPadding: {
    paddingBottom: 50,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  confirmText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  cancelText: {
    color: colors.gray,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditUser;
