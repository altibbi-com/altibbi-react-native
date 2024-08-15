import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  createConsultation,
  deleteConsultation,
  getConsultationInfo,
  getConsultationList,
  getLastConsultation,
  getPrescription,
  MediumArray,
  MediumType,
  uploadMedia,
  getMediaList,
  deleteMedia,
} from 'react-native-altibbi';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';
import { Radio } from '../component/radio';
import { DownloadDirectoryPath, writeFile } from 'react-native-fs';
import { json2csv } from 'json-2-csv';

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 15,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#10e1d0',
    flex: 1,
    borderRadius: 15,
    marginTop: 20,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewHolder: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  input: {
    marginVertical: 20,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 20,
    textAlign: 'auto',
  },
  input2: {
    marginTop: 20,
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'auto',
    paddingLeft: 20,
    minHeight: 50,
  },
  input3: {
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    height: 40,
    marginRight: 20,
    width: 40,
  },
});
const Consultation = (props) => {
  const [picked, setPicked] = useState<MediumType>(MediumArray[0]);
  const [textBody, setTextBody] = useState<string>('');
  const [deleteConsultationId, setDeleteConsultationId] = useState<string>('');
  const [getConsultationId, setGetConsultationId] = useState<string>('');
  const [getConsultationListId, setGetConsultationListId] =
    useState<string>('');
  const [getConsultationFollowUpId, setConsultationFollowUpId] =
    useState<string>('');
  const [prescriptionId, setPrescriptionId] = useState<string>('');
  const [userId, setUserId] = useState<number>();
  const [imageID, setImageID] = useState<string>();
  const [deleteMediaId, setDeleteMediaId] = useState<string>();

  const openImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      const source =
        Platform.OS === 'android'
          ? response?.assets?.[0].uri
          : response?.assets?.[0].uri?.replace('file://', '');
      const fileName = encodeURI(source.replace(/^.*[\\\/]/, ''));
      const type = response?.assets?.[0]?.type || '';
      uploadMedia(source, type, fileName).then((res) => {
        setImageID(res?.data?.id);
      });
    }).then();
  };
  const uploadUsingGallery = async () => {
    let permission = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : parseFloat(Platform.Version + '') > 32
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    );
    if (
      permission === 'granted' ||
      permission === 'limited' ||
      ['undetermined', 'authorized'].includes(permission)
    ) {
      openImagePicker();
    }
    return null;
  };

  const getCurrentConsultationInfo = () => {
    getLastConsultation().then((res) => {
      console.log(res);
      if (res.data[0].status !== 'closed') {
        props.navigation.navigate('WaitingRoom', {
          videoConfig: res?.data[0]?.videoConfig,
          voipConfig: res?.data[0]?.voipConfig,
          chatConfig: res?.data[0]?.chatConfig,
          status: res?.data[0]?.status,
          medium: res?.data[0]?.medium,
          channel: res.data[0].pusherChannel,
          consultationId: res.data[0].id,
          socketParams: res.data[0].socketParams,
        });
      }
    });
  };

  const getMediaItems = () => {
    getMediaList(1, 20).then((res) => {
      console.log(res);
    });
  };

  const attachAsCSV = async (jsonData) => {
    const csvContent = json2csv(jsonData, {
      excelBOM: true
    });
    const fileName = `attach-consultation-${new Date().getTime()}.csv`;
    const filePath = `${DownloadDirectoryPath}/${fileName}`;
    await writeFile(filePath, csvContent, 'utf8');
    try {
      uploadMedia(
        `${Platform.OS === 'android' ? 'file://' : ''}` + filePath,
        'text/csv',
        fileName
      ).then((res) => {
        console.log(res)
        if (res?.data?.id) {
          setImageID(res?.data?.id);
        }
      });
    } catch (error) {
      throw Error(JSON.stringify(error));
    }
  };
  const submitConsultation = (followUpConsultationId: number = 0) => {
    if (!textBody || textBody.length < 10 || !userId) {
      console.log('consultation should be longer than 10 characters');
      return;
    }
    if (picked === 'video') {
      request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );
    }
    createConsultation({
      question: textBody,
      medium: picked,
      user_id: userId,
      ...(imageID ? { mediaIds: [imageID] } : {}),
      ...(followUpConsultationId ? { followUpConsultationId } : {}),
    })
      .then((res) => {
        console.log(res);
        getCurrentConsultationInfo();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <ScrollView style={{ backgroundColor: '#F3F3F4' }}>
      <View style={{ padding: 20 }}>
        <Radio
          pick={[picked, setPicked]}
          array={MediumArray}
          title={'Medium'}
        />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TextInput
            keyboardType={'number-pad'}
            style={[styles.input2, { flex: 1 }]}
            placeholder="userId"
            value={`${userId || ''}`}
            onChangeText={(text) => setUserId(parseInt(text, 10))}
          />
          <TouchableOpacity
            onPress={() => uploadUsingGallery()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#10e1d0',
              marginTop: 20,
              marginLeft: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
            }}
          >
            <Text style={styles.buttonText}>file</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Medical consultaiton question with minimum 10 characters"
          value={textBody}
          onChangeText={(text) => setTextBody(text)}
        />
        <TouchableOpacity
          onPress={() => {
            submitConsultation();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create Consultation</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={getConsultationFollowUpId}
            onChangeText={(idText: string) => setConsultationFollowUpId(idText)}
          />
          <TouchableOpacity
            onPress={() => {
              if (getConsultationFollowUpId) {
                submitConsultation(parseInt(getConsultationFollowUpId, 10));
              }
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Followup on Consultation</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={getConsultationListId}
            onChangeText={(idText: string) => setGetConsultationListId(idText)}
          />
          <TouchableOpacity
            onPress={() => {
              getConsultationList(parseInt(getConsultationListId), 1, 20).then(
                (res) => {
                  console.log(res);
                }
              );
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Consultation List</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            getCurrentConsultationInfo();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Last Consultation</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={deleteConsultationId}
            onChangeText={(idText: string) => setDeleteConsultationId(idText)}
          />
          <TouchableOpacity
            onPress={() => {
              if (!deleteConsultationId) {
                return;
              }
              deleteConsultation(parseInt(deleteConsultationId)).then((res) => {
                console.log(res);
              });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Delete Consultation</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={getConsultationId}
            onChangeText={(idText: string) => setGetConsultationId(idText)}
          />
          <TouchableOpacity
            onPress={() => {
              if (!getConsultationId) {
                return;
              }
              getConsultationInfo(parseInt(getConsultationId)).then((res) => {
                console.log(res);
              });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Consultation by id</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              attachAsCSV({
                extraInfo1: { Lable: 'AnyValue', NumberValue: 20 },
                extraInfo2: 'AnyData',
              })
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Attach JSON to consultation</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={prescriptionId}
            onChangeText={(idText: string) => setPrescriptionId(idText)}
          />
          <TouchableOpacity
            onPress={() => {
              getPrescription(parseInt(prescriptionId)).then(
                async (response) => {
                  const {
                    dirs: { DownloadDir, DocumentDir }, // DownloadDir for android  , DocumentDir for ios
                  } = RNFetchBlob.fs;
                  const arrayBuffer = await response.arrayBuffer();
                  const buffer = Buffer.from(arrayBuffer);
                  const base64String = buffer.toString('base64');
                  const filePath =
                    (Platform.OS === 'ios' ? DocumentDir : DownloadDir) +
                    '/prescription' +
                    new Date().getTime() +
                    '.pdf';
                  await RNFetchBlob.fs.createFile(
                    filePath,
                    base64String,
                    'base64'
                  );
                  console.log('Download Completed');
                }
              );
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>download Prescription</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            getMediaItems();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Media List</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            keyboardType={'number-pad'}
            style={styles.input3}
            placeholder="id"
            value={deleteMediaId}
            onChangeText={(mediaId: string) => setDeleteMediaId(mediaId)}
          />
          <TouchableOpacity
            onPress={() => {
              deleteMedia(deleteMediaId).then((res) => {
                console.log(res);
              });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Delete Media</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Consultation;
