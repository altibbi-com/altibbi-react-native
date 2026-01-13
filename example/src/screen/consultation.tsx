import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
} from 'react-native';
import {
  createConsultation,
  getLastConsultation,
  MediumArray,
  MediumType,
  uploadMedia,
  getMediaList,
} from 'react-native-altibbi';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import { DocumentDirectoryPath, writeFile } from 'react-native-fs';
import { json2csv } from 'json-2-csv';

import { Radio } from '../component/radio';

import { AppHeader } from '../component/appHeader';
import { AppTextInput } from '../component/appTextInput';
import { AppButton } from '../component/appButton';
import { AppCard } from '../component/appCard';
import { colors } from '../theme/colors';

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
    alignItems: 'center',
    gap: 10,
  },
  fileButton: {
    marginTop: 24,
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileButtonText: {
    color: colors.white,
    fontWeight: '600',
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
  previewContainer: {
    marginTop: 10,
    position: 'relative',
    width: 100,
    height: 100,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  removeMediaBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  removeMediaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  modalImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  mediaContainer: {
    marginBottom: 20,
  },
  fileButtonDisabled: {
    width: '100%',
    backgroundColor: colors.lightGray,
  },
  fileButtonTextDisabled: {
    color: colors.primary,
    marginLeft: 10,
  },
  feedbackSuccess: {
    backgroundColor: colors.success + '15',
  },
  feedbackError: {
    backgroundColor: colors.error + '15',
  },
  textSuccess: {
    color: colors.success,
  },
  textError: {
    color: colors.error,
  },
});

const Consultation = (props: any) => {
  const [picked, setPicked] = useState<MediumType>(MediumArray[0]);
  const [textBody, setTextBody] = useState<string>('');
  const [userId, setUserId] = useState<number>();
  const [imageID, setImageID] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isFollowingUp, setIsFollowingUp] = useState(false);
  const [followUpUserId, setFollowUpUserId] = useState<number>();
  const [followUpQuestion, setFollowUpQuestion] = useState<string>('');

  const [createStatus, setCreateStatus] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [quickActionStatus, setQuickActionStatus] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [toolsStatus, setToolsStatus] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const [getConsultationId, setGetConsultationId] = useState<string>('');
  const [getConsultationFollowUpId, setConsultationFollowUpId] =
    useState<string>('');
  const [followUpError, setFollowUpError] = useState<string>('');
  const [viewImageModalVisible, setViewImageModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      setPicked(MediumArray[0]);
      setTextBody('');
      setUserId(undefined);
      setImageID(undefined);
      setPreviewUri(null);
      setGetConsultationId('');
      setConsultationFollowUpId('');
      setFollowUpError('');
      setCreateStatus(null);
      setQuickActionStatus(null);
      setToolsStatus(null);
      setIsCreating(false);
      setIsFollowingUp(false);
      setFollowUpUserId(undefined);
      setFollowUpQuestion('');
    });
    return unsubscribe;
  }, [props.navigation]);

  const removeMedia = () => {
    setImageID(undefined);
    setPreviewUri(null);
  };

  const openImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || !response.assets) return;
      const source =
        Platform.OS === 'android'
          ? response?.assets?.[0].uri
          : response?.assets?.[0].uri?.replace('file://', '');
      if (!source) return;
      const fileName = encodeURI(source.replace(/^.*[\\\/]/, ''));
      const type = response?.assets?.[0]?.type || '';

      setPreviewUri(source);
      setUploading(true);
      uploadMedia(source, type, fileName)
        .then((res: any) => setImageID(res?.data?.id))
        .catch(() =>
          setCreateStatus({ text: 'Failed to upload image.', type: 'error' })
        )
        .finally(() => setUploading(false));
    });
  };

  const uploadUsingGallery = async () => {
    if (Platform.OS === 'android' && parseFloat(Platform.Version + '') >= 33) {
      openImagePicker();
      return;
    }
    let permission = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    );
    if (
      ['granted', 'limited', 'undetermined', 'authorized'].includes(permission)
    ) {
      openImagePicker();
    } else {
      setCreateStatus({ text: 'Permission denied.', type: 'error' });
    }
  };

  const getCurrentConsultationInfo = () => {
    getLastConsultation()
      .then((res: any) => {
        if (res.data && res.data[0] && res.data[0].status !== 'closed') {
          const chatConfigWithDoctorName = res?.data[0]?.chatConfig
            ? {
              ...res.data[0].chatConfig,
              doctor_name: res?.data[0]?.doctor_name,
              doctor_avatar: res?.data[0]?.doctor_avatar,
            }
            : null;
          props.navigation.navigate('WaitingRoom', {
            videoConfig: res?.data[0]?.videoConfig,
            voipConfig: res?.data[0]?.voipConfig,
            chatConfig: chatConfigWithDoctorName,
            status: res?.data[0]?.status,
            medium: res?.data[0]?.medium,
            channel: res.data[0].pusherChannel,
            consultationId: res.data[0].id,
            socketParams: res.data[0].socketParams,
          });
        } else {
          setCreateStatus({
            text: 'No active consultation found.',
            type: 'info',
          });
          setIsCreating(false);
          setIsFollowingUp(false);
        }
      })
      .catch(() => {
        setCreateStatus({
          text: 'Failed to fetch active consultation.',
          type: 'error',
        });
        setIsCreating(false);
        setIsFollowingUp(false);
      });
  };

  const attachAsCSV = async (jsonData: any) => {
    const csvContent = json2csv(jsonData, {
      excelBOM: true
    });
    const fileName = `attach-consultation-${new Date().getTime()}.csv`;
    const filePath = `${DocumentDirectoryPath}/${fileName}`;
    await writeFile(filePath, csvContent, 'utf8');
    try {
      uploadMedia(
        `${Platform.OS === 'android' ? 'file://' : ''}` + filePath,
        'text/csv',
        fileName
      ).then((res: any) => {
        console.log(res)
        if (res?.data?.id) {
          setImageID(res?.data?.id);
        }
      });
    } catch (error) {
      throw Error(JSON.stringify(error));
    }
  };

  const submitConsultation = (followUpId: number = 0) => {
    const isFollowUp = followUpId > 0;
    const setStatus = isFollowUp ? setQuickActionStatus : setCreateStatus;

    const question = isFollowUp ? followUpQuestion : textBody;
    const uid = isFollowUp ? followUpUserId : userId;

    if (!question || question.length < 10 || !uid) {
      setStatus({
        text: 'Question too short or User ID missing.',
        type: 'error',
      });
      return;
    }

    if (isFollowUp) {
      setIsFollowingUp(true);
    } else {
      setIsCreating(true);
    }
    createConsultation({
      question: question,
      medium: picked,
      user_id: uid || 0,
      ...(imageID ? { mediaIds: [imageID] } : {}),
      ...(followUpId ? { parent_consultation_id: followUpId } : {}),
      forceWhiteLabelingPartnerName: 'partnerTest',
    })
      .then(() => getCurrentConsultationInfo())
      .catch((error: any) => {
        setStatus({
          text: error?.data?.message || 'Failed to create consultation.',
          type: 'error',
        });
        setIsCreating(false);
        setIsFollowingUp(false);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 70}
      style={styles.flex}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <AppHeader
            title="Consultation"
            subtitle="Create and manage consultations"
          />

          <AppCard>
            <Text style={styles.sectionTitle}>New Consultation</Text>
            <Radio
              pick={[picked, setPicked]}
              array={MediumArray}
              title={'Select Medium'}
            />
            <AppTextInput
              label="User ID"
              keyboardType={'number-pad'}
              placeholder="Enter User ID"
              value={`${userId || ''}`}
              onChangeText={(text) => setUserId(parseInt(text, 10))}
            />
            <AppTextInput
              label="Question"
              multiline
              placeholder="Medical consultation question (min 10 chars)..."
              value={textBody}
              onChangeText={setTextBody}
              containerStyle={styles.inputContainer}
              style={styles.textInput}
            />
            <View style={styles.mediaContainer}>
              {uploading ? (
                <View
                  style={[
                    styles.fileButton,
                    styles.fileButtonDisabled,
                  ]}
                >
                  <ActivityIndicator color={colors.primary} />
                  <Text
                    style={[
                      styles.fileButtonText,
                      styles.fileButtonTextDisabled,
                    ]}
                  >
                    Uploading...
                  </Text>
                </View>
              ) : imageID ? (
                <View style={styles.previewContainer}>
                  <TouchableOpacity
                    onPress={() => setViewImageModalVisible(true)}
                  >
                    <Image
                      source={{ uri: previewUri || undefined }}
                      style={styles.previewImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeMediaBadge}
                    onPress={removeMedia}
                  >
                    <Text style={styles.removeMediaText}>×</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <AppButton
                  title="Attach Media (Optional)"
                  onPress={uploadUsingGallery}
                />
              )}
            </View>
            <AppButton
              title="Create Consultation"
              loading={isCreating}
              onPress={() => submitConsultation()}
            />
            <AppButton
              title="Go to Active Consultation"
              variant="secondary"
              onPress={getCurrentConsultationInfo}
            />
            {createStatus && (
              <View
                style={[
                  styles.feedbackContainer,
                  createStatus.type === 'error' ? styles.feedbackError : styles.feedbackSuccess,
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    createStatus.type === 'error' ? styles.textError : styles.textSuccess,
                  ]}
                >
                  {createStatus.text}
                </Text>
              </View>
            )}
          </AppCard>

          <AppCard>
            <Text style={styles.sectionTitle}>Follow Up Consultation</Text>
            <AppTextInput
              label="User ID"
              keyboardType={'number-pad'}
              placeholder="Enter User ID"
              value={`${followUpUserId || ''}`}
              onChangeText={(text) => setFollowUpUserId(parseInt(text, 10))}
            />
            <AppTextInput
              label="Question"
              multiline
              placeholder="Follow-up medical question (min 10 chars)..."
              value={followUpQuestion}
              onChangeText={setFollowUpQuestion}
              containerStyle={styles.inputContainer}
              style={styles.textInput}
            />
            <AppTextInput
              label="Parent Consultation ID"
              placeholder="Enter Consultation ID to follow up"
              keyboardType="number-pad"
              value={getConsultationFollowUpId}
              onChangeText={(text) => {
                setConsultationFollowUpId(text);
                if (followUpError) setFollowUpError('');
              }}
              error={followUpError}
            />
            <AppButton
              title="Submit Follow Up"
              loading={isFollowingUp}
              onPress={() => {
                if (!getConsultationFollowUpId) {
                  setFollowUpError('Required');
                  return;
                }
                submitConsultation(parseInt(getConsultationFollowUpId, 10));
              }}
            />
            {quickActionStatus && (
              <View
                style={[
                  styles.feedbackContainer,
                  quickActionStatus.type === 'error' ? styles.feedbackError : styles.feedbackSuccess,
                ]}
              >
                <Text
                  style={[
                    styles.feedbackText,
                    quickActionStatus.type === 'error' ? styles.textError : styles.textSuccess,
                  ]}
                >
                  {quickActionStatus.text}
                </Text>
              </View>
            )}
          </AppCard>

          {false}
        </View>
      </ScrollView >

      <Modal visible={viewImageModalVisible} transparent animationType="fade">
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setViewImageModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalImageWrapper}>
            <Image
              source={{ uri: previewUri || undefined }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </KeyboardAvoidingView >
  );
};

export default Consultation;
