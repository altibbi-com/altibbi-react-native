import React, { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal as RNModal,
  Dimensions,
  Keyboard,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import type {
  BloodType,
  BoolString,
  GenderType,
  MaritalStatus,
  UserType,
  relationType,
} from 'react-native-altibbi';
import {
  bloodTypeArray,
  boolStringArray,
  createUser,
  deleteUser,
  genderTypeArray,
  getUser,
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  datePicker: {
    backgroundColor: colors.white,
    width: width - 40,
  },
  feedbackBottomMargin: {
    marginBottom: 16,
  },
  feedbackTopMargin: {
    marginTop: 12,
  },
  submitButtonMargin: {
    marginVertical: 16,
  },
  actionBlockDivider: {
    height: 16,
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

const User = () => {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<GenderType | undefined>(
    genderTypeArray[0]
  );
  const [insuranceId, setInsuranceId] = useState<string>('');
  const [policyNumber, setPolicyNumber] = useState<string>('');
  const [nationalityNumber, setNationalityNumber] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bloodType, setBloodType] = useState<BloodType>();
  const [smoker, setSmoker] = useState<BoolString>();
  const [alcoholic, setAlcoholic] = useState<BoolString>();
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>();
  const [id, setID] = useState<string>('');
  const [id2, setID2] = useState<string>('');
  const [relationType, setRelationType] = useState<relationType>();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const [getStatus, setGetStatus] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(
    null
  );

  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    insuranceId: '',
    policyNumber: '',
    id: '',
    id2: '',
  });

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (successMessage) setSuccessMessage(null);
    if (deleteStatus) setDeleteStatus(null);
    if (getStatus) setGetStatus(null);
    if (createErrorMessage) setCreateErrorMessage(null);
  };

  const handleCreateUser = () => {
    const newErrors = {
      name: !name ? 'Name is required' : '',
      phoneNumber: !phoneNumber ? 'Phone number is required' : '',
      email: !email ? 'Email is required' : '',
      dateOfBirth: !dateOfBirth ? 'Date of birth is required' : '',
      insuranceId: !insuranceId ? 'Insurance ID is required' : '',
      policyNumber: !policyNumber ? 'Policy Number is required' : '',
      id: '',
      id2: '',
    };

    if (Object.values(newErrors).some((e) => e)) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      setSuccessMessage(null);
      setCreateErrorMessage(null);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

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
    createUser(params)
      .then((res: any) => {
        console.log(res);
        setSuccessMessage('User created successfully');
        setCreateErrorMessage(null);
        setName('');
        setPhoneNumber('');
        setEmail('');
        setDateOfBirth('');
        setGender(genderTypeArray[0]);
        setInsuranceId('');
        setPolicyNumber('');
        setNationalityNumber('');
        setHeight('');
        setWeight('');
        setBloodType(undefined);
        setSmoker(undefined);
        setAlcoholic(undefined);
        setMaritalStatus(undefined);
        setRelationType(undefined);
        setDate(new Date());
        setErrors({
          name: '',
          phoneNumber: '',
          email: '',
          dateOfBirth: '',
          insuranceId: '',
          policyNumber: '',
          id: '',
          id2: '',
        });
      })
      .catch((err: any) => {
        console.log('something went wrong', err);

        let errorData = err?.data || err?.response?.data;
        let status = err?.status || err?.response?.status;

        if (!errorData && err?.message) {
          try {
            const jsonStart = err.message.indexOf('{');
            if (jsonStart !== -1) {
              const parsed = JSON.parse(err.message.substring(jsonStart));
              errorData = parsed.data;
              status = parsed.status;
            }
          } catch (e) {
            console.log('Failed to parse error message', e);
          }
        }

        if (status === 422 && Array.isArray(errorData)) {
          const backendErrors: any = {};
          errorData.forEach((item: any) => {
            const fieldMap: { [key: string]: string } = {
              name: 'name',
              phone_number: 'phoneNumber',
              email: 'email',
              date_of_birth: 'dateOfBirth',
              insurance_id: 'insuranceId',
              policy_number: 'policyNumber',
            };
            const localField = fieldMap[item.field];
            if (localField) {
              backendErrors[localField] = item.message;
            }
          });
          setErrors((prev) => ({ ...prev, ...backendErrors }));
          if (errorData.length > 0) {
            setCreateErrorMessage(errorData[0].message);
          }
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        } else {
          const fallbackMsg =
            Array.isArray(errorData) && errorData[0]?.message
              ? errorData[0].message
              : 'Failed to create user. Please check your information and try again.';
          setCreateErrorMessage(fallbackMsg);
        }
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 70}
      style={styles.flex}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <AppHeader
            title="User Management"
            subtitle="Create and manage users"
          />

          <AppCard>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.row}>
              <View style={styles.flex1}>
                <AppTextInput
                  label="Name"
                  placeholder="Name"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    clearError('name');
                  }}
                  error={errors.name}
                />
              </View>
              <View style={styles.flex1}>
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
                    error={errors.dateOfBirth}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
                        clearError('dateOfBirth');
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
            <View style={styles.row}>
              <View style={styles.flex1}>
                <AppTextInput
                  label="Email"
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    clearError('email');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
              </View>
              <View style={styles.flex1}>
                <AppTextInput
                  label="Phone"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={(t) => {
                    setPhoneNumber(t);
                    clearError('phoneNumber');
                  }}
                  keyboardType="phone-pad"
                  error={errors.phoneNumber}
                />
              </View>
            </View>
            <AppTextInput
              label="Nationality Number"
              placeholder="Nationality Number"
              value={nationalityNumber}
              onChangeText={setNationalityNumber}
            />
          </AppCard>

          <AppCard>
            <Text style={styles.sectionTitle}>Insurance Information</Text>
            <View style={styles.row}>
              <View style={styles.flex1}>
                <AppTextInput
                  label="Insurance ID"
                  placeholder="Insurance ID"
                  value={insuranceId}
                  onChangeText={(t) => {
                    setInsuranceId(t);
                    clearError('insuranceId');
                  }}
                  error={errors.insuranceId}
                />
              </View>
              <View style={styles.flex1}>
                <AppTextInput
                  label="Policy Number"
                  placeholder="Policy Number"
                  value={policyNumber}
                  onChangeText={(t) => {
                    setPolicyNumber(t);
                    clearError('policyNumber');
                  }}
                  error={errors.policyNumber}
                />
              </View>
            </View>
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
            <View
              style={[
                styles.feedbackContainer,
                styles.feedbackSuccess,
                styles.feedbackBottomMargin,
              ]}
            >
              <Text style={[styles.feedbackText, styles.textSuccess]}>
                {successMessage}
              </Text>
            </View>
          )}

          {createErrorMessage && (
            <View
              style={[
                styles.feedbackContainer,
                styles.feedbackError,
                styles.feedbackBottomMargin,
              ]}
            >
              <Text style={[styles.feedbackText, styles.textError]}>
                {createErrorMessage}
              </Text>
            </View>
          )}

          <AppButton
            title="Create User"
            onPress={handleCreateUser}
            containerStyle={styles.submitButtonMargin}
          />

          <AppCard>
            <Text style={styles.sectionTitle}>User Management Actions</Text>

            <AppTextInput
              placeholder="User ID"
              value={id}
              onChangeText={(t) => {
                setID(t);
                clearError('id');
              }}
              keyboardType="number-pad"
              error={errors.id}
            />
            <AppButton
              title="Get User"
              variant="secondary"
              onPress={() => {
                setGetStatus(null);
                if (!id) {
                  setErrors((prev) => ({ ...prev, id: 'User ID is required' }));
                  return;
                }
                getUser(id)
                  .then((res: any) => {
                    console.log('Example userName: ', res.data.name);
                    navigation.navigate('UserDetails', { data: res.data });
                    setID('');
                  })
                  .catch((err: any) => {
                    console.log('something went wrong', err);
                    setGetStatus({
                      text: 'User not found. Please check the ID.',
                      type: 'error',
                    });
                  });
              }}
            />

            {getStatus && (
              <View
                style={[
                  styles.feedbackContainer,
                  styles.feedbackError,
                  styles.feedbackTopMargin,
                ]}
              >
                <Text style={[styles.feedbackText, styles.textError]}>
                  {getStatus.text}
                </Text>
              </View>
            )}

            <View style={styles.actionBlockDivider} />

            <AppTextInput
              placeholder="User ID"
              value={id2}
              onChangeText={(t) => {
                setID2(t);
                clearError('id2');
              }}
              keyboardType="number-pad"
              error={errors.id2}
            />
            <AppButton
              title="Delete User"
              variant="danger"
              onPress={() => {
                setDeleteStatus(null);
                if (!id2) {
                  setErrors((prev) => ({
                    ...prev,
                    id2: 'Delete ID is required',
                  }));
                  return;
                }
                deleteUser(id2)
                  .then((res: any) => {
                    console.log(res);
                    setDeleteStatus({
                      text: 'User deleted successfully',
                      type: 'success',
                    });
                    setID2('');
                  })
                  .catch((err: any) => {
                    const msg =
                      err?.data?.[0]?.message ||
                      'Failed to delete user. Please check the ID.';
                    setDeleteStatus({ text: msg, type: 'error' });
                  });
              }}
            />

            {deleteStatus && (
              <View
                style={[
                  styles.feedbackContainer,
                  deleteStatus.type === 'success' ? styles.feedbackSuccess : styles.feedbackError,
                  styles.feedbackTopMargin,
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    deleteStatus.type === 'success' ? styles.textSuccess : styles.textError,
                  ]}
                >
                  {deleteStatus.text}
                </Text>
              </View>
            )}

            <View style={styles.actionBlockDivider} />

            <AppButton
              title="Get All Users"
              variant="secondary"
              onPress={() => {
                navigation.navigate('UserList', { showLottie: true });
              }}
            />
          </AppCard>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default User;
