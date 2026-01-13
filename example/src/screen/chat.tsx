import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { request } from 'react-native-permissions';
import { PERMISSIONS } from 'react-native-permissions';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  AltibbiChat,
  ConnectionHandler,
  GroupChannelHandler,
  GroupChannelModule,
  uploadMedia,
  GroupChannel,
  cancelConsultation,
} from 'react-native-altibbi';
import { AppHeader } from '../component/appHeader';
import { colors } from '../theme/colors';

const Chat = (props) => {
  const data = props?.route?.params?.event;
  const ref = useRef<any>(null);

  const channelRef = useRef<any>();
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [message, setMessage] = useState<any>(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const init = () => {
    ref.current = AltibbiChat.init({
      appId: data.app_id,
      modules: [new GroupChannelModule()],
    });
  };

  const connect = async () => {
    await ref?.current?.connect(data.chat_user_id, data.chat_user_token);
  };
  const disconnect = () => {
    ref?.current?.disconnect().then((r) => {
      // Success handler
    });
  };

  const reconnect = () => {
    ref?.current?.reconnect();
  };

  const getChannel = async (channelURL: string): Promise<GroupChannel> => {
    const channel = await ref?.current?.groupChannel
      .getChannel(channelURL)
      .catch((e) => {
        return e;
      });
    channelRef.current = channel;
    return channel;
  };
  const sendMessage = (msg) => {
    const send = channelRef?.current?.sendUserMessage(msg);
    send?.onSucceeded((message1: any) => {
      const newMessage = {
        createdAt: message1.createdAt,
        message: message1.message,
        messageId: message1.messageId,
        sender: {
          userId: message1.sender.userId,
        },
      };
      setMessage(newMessage);
    });
    send.onFailed((err) => {
      // Failed handler
    });
    send.onPending(() => {
      // Pending handler
    });
  };

  const loadAllMessage = async (channelURL) => {
    const channel = await getChannel(channelURL);
    const previousMessageList = await channel.createPreviousMessageListQuery();
    let allMessages = [];

    while (previousMessageList.hasNext) {
      let newMsgArr = await previousMessageList.load();
      allMessages = [...allMessages, ...newMsgArr];
    }
    return allMessages;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender.userId == data.chat_user_id;
    return (
      <View
        style={[styles.messageRow, isUser ? styles.rowEnd : styles.rowStart]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userMessage : styles.otherMessage,
          ]}
        >
          {item?.message?.includes('cdn') ||
            item?.message?.includes('/image/') ||
            /\.(jpg|jpeg|png|gif|heic|webp)$/i.test(
              item?.message?.split('?')?.[0]
            ) ? (
            <TouchableOpacity onPress={() => setSelectedImage(item.message)}>
              <View pointerEvents="none">
                <Image
                  source={{ uri: item?.message?.trim() }}
                  style={styles.messageImage}
                  resizeMode={'cover'}
                  onError={(e) => { }
                  }
                />
              </View>
            </TouchableOpacity>
          ) : (
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.otherMessageText,
              ]}
            >
              {item.message}
            </Text>
          )}
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.otherTimestamp,
            ]}
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const onUserJoined = () => { };
  const onUserLeft = () => { };
  const onTypingStatusUpdated = () => { };

  const onMessageReceived = (channel, message) => {
    setMessage({
      createdAt: message.createdAt,
      message: message.message,
      messageId: message.messageId,
      sender: message.sender.userId,
    });
  };

  const onConnected = (userId) => {
  };
  const onReconnectStarted = () => { };
  const onReconnectSucceeded = () => { };
  const onReconnectFailed = () => { };
  const onDisconnected = () => { };

  const addHandler = () => {
    let groupChannelHandler = new GroupChannelHandler({
      onUserJoined,
      onUserLeft,
      onTypingStatusUpdated,
      onMessageReceived,
    });

    let connectionHandler = new ConnectionHandler({
      onConnected,
      onReconnectStarted,
      onReconnectSucceeded,
      onReconnectFailed,
      onDisconnected,
    });
    ref?.current?.groupChannel?.addGroupChannelHandler(
      'CHA_HAN',
      groupChannelHandler
    );
    ref?.current?.addConnectionHandler('CHA_CONN', connectionHandler);
  };

  const removeConnectionHandler = (appChannel) => {
    ref.current.removeConnectionHandler(appChannel);
  };
  const removeGroupChannelHandler = (appChannel) => {
    ref.current.groupChannel.removeGroupChannelHandler(appChannel);
  };

  const setPushTriggerOption = (pushTriggerOption) => {
    ref.current.setPushTriggerOption(pushTriggerOption);
  };

  // for ios
  const registerAPNSPushTokenForCurrentUser = (token) => {
    ref.current.registerAPNSPushTokenForCurrentUser(token);
  };
  // for android
  const registerFCMPushTokenForCurrentUser = (token) => {
    ref.current.registerFCMPushTokenForCurrentUser(token);
  };

  const openImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        // User cancelled
      } else if (response.errorMessage) {
        // Error handler
      } else {
        const source =
          Platform.OS === 'android'
            ? response.assets?.[0].uri
            : response.assets?.[0].uri?.replace('file://', '');
        const fileName = encodeURI(source.replace(/^.*[\\\/]/, ''));

        uploadMedia(source, response.assets?.[0]?.type || '', fileName).then(
          (res) => {
            sendMessage({
              message: res.data.url,
            });
          }
        );
      }
    });
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

  useEffect(() => {
    if (message !== null) {
      const newArray = [...messageList];
      newArray.push(message);
      setMessageList([...newArray]);
    }
  }, [message]);

  useEffect(() => {
    if (messageList.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messageList]);

  useEffect(() => {
    const chatStart = async () => {
      init();
      addHandler();
      connect().then(() => {
        loadAllMessage(`channel_${data.group_id}`).then((res) => {
          setMessageList(res);
          setLoading(false);
        });
      });
    };
    chatStart();
  }, []);

  const handleLeaveConsultation = () => {
    setMenuVisible(false);
    if (data.consultationId) {
      cancelConsultation(data.consultationId).finally(() => {
        props.navigation.navigate('Consultation', {});
      });
    } else {
      props.navigation.navigate('Consultation', {});
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }
  const renderEmptyComponent = () => (
    <View
      style={styles.emptyContainer}
    >
      <Text
        style={styles.emptyTitle}
      >
        No messages yet
      </Text>
      <Text style={styles.emptySubtitle}>
        Start the conversation by sending a message.
      </Text>
    </View>
  );
  const isDisabled = !textInput.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View
          style={styles.headerContainer}
        >
          <AppHeader
            title="Consultation with"
            subtitle={data.doctor_name}
            avatar={data.doctor_avatar}
            onMenuPress={() => setMenuVisible(!menuVisible)}
          />
          {menuVisible && (
            <View style={styles.menuDropdown}>
              <TouchableOpacity
                onPress={handleLeaveConsultation}
                style={styles.menuItem}
              >
                <Text style={styles.menuItemText}>End Consultation</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {menuVisible && (
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          />
        )}

        <FlatList
          ref={flatListRef}
          data={messageList}
          keyExtractor={(item, index) => `${item.messageId}_${index}`}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyComponent}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={uploadUsingGallery}
            style={styles.attachButton}
          >
            <Text style={styles.attachButtonText}>+</Text>
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(txt) => setTextInput(txt)}
              value={textInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.gray}
            />
          </View>

          <View
            style={[
              styles.sendButtonContainer,
              { backgroundColor: isDisabled ? colors.gray : colors.primary },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                sendMessage({
                  message: textInput,
                });
                setTextInput('');
              }}
              disabled={!textInput.trim()}
              style={styles.sendButton}
            >
              <Image
                source={require('../assets/icon/arrow_up.png')}
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <View style={styles.modalImageWrapper}>
            <Image
              source={{ uri: selectedImage?.trim() }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 20,
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  rowStart: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#E1E4E8',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
    fontWeight: '500',
  },
  otherMessageText: {
    color: colors.text,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: colors.gray,
  },
  inputContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 12,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  attachButtonText: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 26,
    marginTop: -2,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  input: {
    fontSize: 15,
    color: colors.text,
    height: 44,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  disabledSendText: {
    color: colors.gray,
    opacity: 0.6,
  },
  menuDropdown: {
    position: 'absolute',
    right: 20,
    top: 60,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 999,
    minWidth: 180,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.error || 'red',
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%',
  },
  emptyTitle: {
    color: colors.gray,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.gray,
    fontSize: 14,
  },
  flex: {
    flex: 1,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    zIndex: 2,
    position: 'relative',
  },
  sendButtonContainer: {
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  sendIcon: {
    width: 25,
    height: 25,
  },
});
export default Chat;
