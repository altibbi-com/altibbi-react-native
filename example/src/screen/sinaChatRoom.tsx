import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  LayoutAnimation,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Markdown from 'react-native-markdown-display';
import LottieView from 'lottie-react-native';
import { sendSinaMessage, getSinaChatMessages } from '../../../src';
import { colors } from '../theme/colors';

type ChatMessage = {
  text: string;
  from: 'user' | 'ai';
  timestamp: string;
  animate?: boolean;
};

const TypewriterMarkdown = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const words = text.split(' ');

    const speed = 90;

    const intervalId = setInterval(() => {
      if (index < words.length) {
        setDisplayedText((prev) => {
          const nextWord = words[index];
          return prev ? `${prev} ${nextWord}` : nextWord;
        });
        index++;
      } else {
        clearInterval(intervalId);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <Markdown
      style={{
        ...markdownStyles,
        body: {
          ...markdownStyles.body,
          textAlign: /[\u0600-\u06FF]/.test(text) ? 'right' : 'left',
        },
      }}
    >
      {displayedText}
    </Markdown>
  );
};

const SinaChatRoom = ({ route, navigation }: any) => {
  const { sessionId } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (sessionId) {
      getSinaChatMessages(sessionId)
        .then((res) => {
          const dataArray = Array.isArray(res.data)
            ? res.data
            : (res.data as any).data;
          if (Array.isArray(dataArray) && dataArray.length > 0) {
            const history = dataArray
              .map((m: any) => ({
                text: m.text,
                from: (m.sender === 'sina' || m.sender === 'ai'
                  ? 'ai'
                  : 'user') as 'user' | 'ai',
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }))
              .reverse();
            setMessages(history);
          } else {
            setMessages([
              {
                text: "Hello! I'm Sina, your AI health assistant. How can I help you today?",
                from: 'ai',
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              },
            ]);
          }
        })
        .catch((e) => console.log('Load Error:', e));
    }
  }, [sessionId]);

  const sendMessages = async () => {
    if (!text.trim()) return;

    const currentText = text;
    setText('');

    const newMessage: ChatMessage = {
      text: currentText,
      from: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      100
    );

    try {
      const res = await sendSinaMessage(currentText, sessionId);
      const data = res.data as any;

      const sinaMessage = data.sina_message || data.sinaMessage;

      if (sinaMessage) {
        const aiMessage: ChatMessage = {
          text: sinaMessage.text,
          from: 'ai' as const,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          animate: true,
        };
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (e) {
      console.log('Send Error:', e);
    } finally {
      setIsTyping(false);
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  };

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        lottieRef.current?.play();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleEndSession = () => {
    setMenuVisible(false);
    navigation.navigate('AskSina');
  };

  const handleAnimationComplete = (index: number) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages[index]) {
        newMessages[index] = { ...newMessages[index], animate: false };
      }
      return newMessages;
    });
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/icon/logo_small.png')}
            style={styles.headerLogoSmall}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Sina</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          <Image
            source={require('../assets/icon/dots.png')}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity onPress={handleEndSession} style={styles.menuItem}>
            <Text style={styles.menuItemText}>End session</Text>
          </TouchableOpacity>
        </View>
      )}

      {menuVisible && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        />
      )}

      <KeyboardAvoidingView
        style={styles.chatWindowWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/icon/full_logo.png')}
              style={styles.fullLogo}
              resizeMode="contain"
            />
            <Text style={styles.emptySubtitle}>
              Ask me anything about symptoms, medications, or general health.
            </Text>
          </View>

          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                message.from === 'user' ? styles.userWrapper : styles.aiWrapper,
              ]}
            >
              {message.from === 'ai' && (
                <Image
                  source={require('../assets/icon/chat_logo.png')}
                  style={styles.messageAvatar}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.from === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {message.from === 'ai' ? (
                  message.animate ? (
                    <TypewriterMarkdown
                      text={message.text}
                      onComplete={() => handleAnimationComplete(index)}
                    />
                  ) : (
                    <Markdown
                      style={{
                        ...markdownStyles,
                        body: {
                          ...markdownStyles.body,
                          textAlign: /[\u0600-\u06FF]/.test(message.text)
                            ? 'right'
                            : 'left',
                        },
                      }}
                    >
                      {message.text}
                    </Markdown>
                  )
                ) : (
                  <Text style={[styles.messageText, styles.userText]}>
                    {message.text}
                  </Text>
                )}
                <Text
                  style={[
                    styles.timestamp,
                    message.from === 'user'
                      ? styles.userTimestamp
                      : styles.aiTimestamp,
                  ]}
                >
                  {message.timestamp}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={[styles.messageWrapper, styles.aiWrapper]}>
              <Image
                source={require('../assets/icon/chat_logo.png')}
                style={styles.messageAvatar}
              />
              <View
                style={[
                  styles.messageBubble,
                  styles.aiBubble,
                  styles.typingBubble,
                ]}
              >
                <LottieView
                  ref={lottieRef}
                  source={require('../assets/lottile/typing.json')}
                  autoPlay
                  loop
                  style={styles.typingAnimation}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          {messages.length <= 1 && !isTyping && (
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsList}>
                {[
                  'Lifestyle Tips',
                  'I have a headache',
                  'Health tips',
                  'My stomach hurts',
                  'My heart is beating slowly',
                  'I have a fever',
                ].map((tip) => (
                  <TouchableOpacity
                    key={tip}
                    style={styles.suggestionChip}
                    onPress={() => {
                      setText(tip);
                    }}
                  >
                    <Text style={styles.suggestionText}>{tip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Ask anything..."
              style={styles.input}
              multiline
              maxLength={200}
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.counterText}>{text.length}/200</Text>
            <TouchableOpacity
              onPress={sendMessages}
              disabled={isTyping || !text.trim()}
              style={[
                styles.sendButton,
                (isTyping || !text.trim()) && styles.sendButtonDisabled,
              ]}
            >
              <Image
                source={require('../assets/icon/arrow_up.png')}
                style={styles.sendIconImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  chatWindowWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FE',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  menuButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray,
    marginVertical: 2,
  },
  menuDropdown: {
    position: 'absolute',
    right: 36,
    top: Platform.OS === 'android' ? 50 : 110,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 999,
    minWidth: 140,
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
    color: '#D32F2F',
    fontWeight: '500',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backArrow: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '300',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyLottie: {
    width: 180,
    height: 180,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    height: 23,
    width: 23,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    maxWidth: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  menuIcon: {
    height: 30,
    width: 40,
  },
  userBubble: {
    backgroundColor: '#7366DB',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  typingBubble: {
    width: 60,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: colors.gray,
  },
  counterText: {
    fontSize: 9,
    color: colors.gray,
    position: 'absolute',
    bottom: 4,
    right: 60,
  },
  inputWrapper: {
    paddingHorizontal: 6,
    paddingBottom: Platform.OS === 'ios' ? 10 : 12,
    backgroundColor: '#F8F9FE',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 16,
    color: colors.text,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    backgroundColor: '#7366DB',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  sendIcon: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#7366DB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 8,
  },
  suggestionText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
  },
  headerLogoSmall: {
    width: 30,
    height: 30,
  },
  fullLogo: {
    width: 150,
    height: 110,
  },
  typingAnimation: {
    width: 45,
    height: 25,
    justifyContent: 'center',
  },
  sendIconImage: {
    height: 20,
    width: 30,
  },
});

const markdownStyles = {
  body: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 4,
  },
};

export default SinaChatRoom;
