import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-altibbi' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SocketReactNative = NativeModules.SocketReactNative
  ? NativeModules.SocketReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

enum SocketEventName {
  ON_AUTHORIZER = 'SocketReactNative:onAuthorizer',
  ON_CONNECTION_STATE_CHANGE = 'SocketReactNative:onConnectionStateChange',
  ON_SUBSCRIPTION_ERROR = 'SocketReactNative:onSubscriptionError',
  ON_EVENT = 'SocketReactNative:onEvent',
  ON_ERROR = 'SocketReactNative:onError',
  ON_MEMBER_ADDED = 'SocketReactNative:onMemberAdded',
  ON_MEMBER_REMOVED = 'SocketReactNative:onMemberRemoved',
}

export interface TBISocketAuthorizerResult {
  /** required for private channels */
  auth?: string;
  /** required for encrypted channels */
  shared_secret?: string;
  /** required for presence channels, should be stringified JSON */
  channel_data?: string;
}

export class TBISocketEvent {
  channelName: string;
  eventName: string;
  data: any;
  userId?: string;
  constructor(args: {
    channelName: string;
    eventName: string;
    data: any;
    userId?: string;
  }) {
    this.channelName = args.channelName;
    this.eventName = args.eventName;
    this.data = args.data;
    this.userId = args.userId;
  }
  toString() {
    return `{ channelName: ${this.channelName}, eventName: ${this.eventName}, data: ${this.data}, userId: ${this.userId} }`;
  }
}

export class TBISocketMember {
  userId: string;
  userInfo: any;
  constructor(userId: string, userInfo: any) {
    this.userId = userId;
    this.userInfo = userInfo;
  }

  toString() {
    return `{ userId: ${this.userId}, userInfo: ${JSON.stringify(
      this.userInfo
    )} }`;
  }
}

export class TBISocketChannel {
  channelName: string;
  members = new Map<String, TBISocketMember>();
  me?: TBISocketMember;
  subscriptionCount?: Number;
  onSubscriptionSucceeded?: (data: any) => void;
  onSubscriptionCount?: (subscriptionCount: Number) => void;
  onEvent?: (event: any) => void;
  onMemberAdded?: (member: TBISocketMember) => void;
  onMemberRemoved?: (member: TBISocketMember) => void;
  constructor(args: {
    channelName: string;
    onSubscriptionSucceeded?: (data: any) => void;
    onSubscriptionCount?: (subscriptionCount: Number) => void;
    onEvent?: (member: TBISocketEvent) => void;
    onMemberAdded?: (member: TBISocketMember) => void;
    onMemberRemoved?: (member: TBISocketMember) => void;
    me?: TBISocketMember;
  }) {
    this.channelName = args.channelName;
    this.onSubscriptionSucceeded = args.onSubscriptionSucceeded;
    this.onEvent = args.onEvent;
    this.onMemberAdded = args.onMemberAdded;
    this.onMemberRemoved = args.onMemberRemoved;
    this.onSubscriptionCount = args.onSubscriptionCount;
    this.me = args.me;
  }

  async unsubscribe() {
    return TBISocket.getInstance().unsubscribe({
      channelName: this.channelName,
    });
  }

  async trigger(event: TBISocketEvent) {
    if (event.channelName !== this.channelName) {
      throw 'Event is not for this channel';
    }
    return TBISocket.getInstance().trigger(event);
  }
}

export class TBISocket {
  private static instance: TBISocket;
  private socketEventEmitter = new NativeEventEmitter(SocketReactNative);
  public channels = new Map<String, TBISocketChannel>();
  public connectionState = 'DISCONNECTED';

  private constructor() {}

  static getInstance(): TBISocket {
    if (!TBISocket.instance) {
      TBISocket.instance = new TBISocket();
    }
    return TBISocket.instance;
  }

  private addListener(
    socketEventName: SocketEventName,
    callback: (event: any) => void
  ) {
    return this.socketEventEmitter.addListener(socketEventName, callback);
  }

  public init(args: {
    apiKey: string;
    cluster: string;
    authEndpoint?: string;
    useTLS?: boolean;
    activityTimeout?: Number;
    pongTimeout?: Number;
    maxReconnectionAttempts?: Number;
    maxReconnectGapInSeconds?: Number;
    authorizerTimeoutInSeconds?: Number;
    proxy?: string;
    onConnectionStateChange?: (
      currentState: string,
      previousState: string
    ) => void;
    onAuthorizer?: (
      channelName: string,
      socketId: string
    ) => Promise<TBISocketAuthorizerResult>;
    onError?: (message: string, code: Number, e: any) => void;
    onEvent?: (event: TBISocketEvent) => void;
    onSubscriptionSucceeded?: (channelName: string, data: any) => void;
    onSubscriptionError?: (
      channelName: string,
      message: string,
      e: any
    ) => void;
    onSubscriptionCount?: (
      channelName: string,
      subscriptionCount: Number
    ) => void;
    onDecryptionFailure?: (eventName: string, reason: string) => void;
    onMemberAdded?: (channelName: string, member: TBISocketMember) => void;
    onMemberRemoved?: (channelName: string, member: TBISocketMember) => void;
  }) {
    this.removeAllListeners();

    this.addListener(
      SocketEventName.ON_CONNECTION_STATE_CHANGE,
      (event: any) => {
        this.connectionState = event.currentState.toUpperCase();
        args.onConnectionStateChange?.(
          event.currentState.toUpperCase(),
          event.previousState.toUpperCase()
        );
      }
    );

    this.addListener(SocketEventName.ON_ERROR, (event: any) =>
      args.onError?.(event.message, event.code, event.error)
    );

    this.addListener(SocketEventName.ON_EVENT, (event: any) => {
      const channelName = event.channelName;
      const eventName = event.eventName;
      const data = event.data;
      const userId = event.userId;
      const channel = this.channels.get(channelName);

      switch (eventName) {
        case 'socket_internal:subscription_succeeded':
          // Depending on the platform implementation we get json or a Map.
          var decodedData = data instanceof Object ? data : JSON.parse(data);
          for (const _userId in decodedData?.presence?.hash) {
            const userInfo = decodedData?.presence?.hash[_userId];
            var member = new TBISocketMember(_userId, userInfo);
            channel?.members.set(member.userId, member);
            if (_userId === userId && channel) {
              channel.me = member;
            }
          }
          args.onSubscriptionSucceeded?.(channelName, decodedData);
          channel?.onSubscriptionSucceeded?.(decodedData);
          break;
        case 'socket_internal:subscription_count':
          // Depending on the platform implementation we get json or a Map.
          var decodedData = data instanceof Object ? data : JSON.parse(data);
          if (channel) {
            channel.subscriptionCount = decodedData.subscription_count;
          }
          args.onSubscriptionCount?.(
            channelName,
            decodedData.subscription_count
          );
          channel?.onSubscriptionCount?.(decodedData.subscription_count);
          break;
        default:
          const socketEvent = new TBISocketEvent(event);
          args.onEvent?.(socketEvent);
          channel?.onEvent?.(socketEvent);
          break;
      }
    });

    this.addListener(SocketEventName.ON_MEMBER_ADDED, (event) => {
      const user = event.user;
      const channelName = event.channelName;
      var member = new TBISocketMember(user.userId, user.userInfo);
      const channel = this.channels.get(channelName);
      channel?.members.set(member.userId, member);
      args.onMemberAdded?.(channelName, member);
      channel?.onMemberAdded?.(member);
    });

    this.addListener(SocketEventName.ON_MEMBER_REMOVED, (event) => {
      const user = event.user;
      const channelName = event.channelName;
      var member = new TBISocketMember(user.userId, user.userInfo);
      const channel = this.channels.get(channelName);
      channel?.members.delete(member.userId);
      args.onMemberRemoved?.(channelName, member);
      channel?.onMemberRemoved?.(member);
    });

    this.addListener(
      SocketEventName.ON_AUTHORIZER,
      async ({ channelName, socketId }) => {
        const data = await args.onAuthorizer?.(channelName, socketId);
        if (data) {
          await SocketReactNative.onAuthorizer(channelName, socketId, data);
        }
      }
    );

    this.addListener(
      SocketEventName.ON_SUBSCRIPTION_ERROR,
      async ({ channelName, message, type }) => {
        args.onSubscriptionError?.(channelName, message, type);
      }
    );

    return SocketReactNative.initialize({
      apiKey: args.apiKey,
      cluster: args.cluster,
      authEndpoint: args.authEndpoint,
      useTLS: args.useTLS,
      activityTimeout: args.activityTimeout,
      pongTimeout: args.pongTimeout,
      maxReconnectionAttempts: args.maxReconnectionAttempts,
      maxReconnectGapInSeconds: args.maxReconnectGapInSeconds,
      authorizerTimeoutInSeconds: args.authorizerTimeoutInSeconds,
      authorizer: args.onAuthorizer ? true : false,
      proxy: args.proxy,
    });
  }

  public async connect() {
    return await SocketReactNative.connect();
  }

  public async disconnect() {
    return await SocketReactNative.disconnect();
  }

  private unsubscribeAllChannels() {
    const channelsCopy = new Map(this.channels);
    channelsCopy.forEach((channel) => {
      this.unsubscribe({ channelName: channel.channelName });
    });
  }

  private removeAllListeners() {
    this.socketEventEmitter.removeAllListeners(SocketEventName.ON_AUTHORIZER);
    this.socketEventEmitter.removeAllListeners(SocketEventName.ON_ERROR);
    this.socketEventEmitter.removeAllListeners(SocketEventName.ON_EVENT);
    this.socketEventEmitter.removeAllListeners(SocketEventName.ON_MEMBER_ADDED);
    this.socketEventEmitter.removeAllListeners(
      SocketEventName.ON_MEMBER_REMOVED
    );
  }

  public async reset() {
    this.removeAllListeners();
    this.unsubscribeAllChannels();
  }

  async subscribe(args: {
    channelName: string;
    onSubscriptionSucceeded?: (data: any) => void;
    onSubscriptionError?: (
      channelName: string,
      message: string,
      e: any
    ) => void;
    onMemberAdded?: (member: TBISocketMember) => void;
    onMemberRemoved?: (member: TBISocketMember) => void;
    onEvent?: (event: TBISocketEvent) => void;
  }) {
    const channel = this.channels.get(args.channelName);
    if (channel) {
      return channel;
    }

    const newChannel = new TBISocketChannel(args);
    await SocketReactNative.subscribe(args.channelName);
    this.channels.set(args.channelName, newChannel);
    return newChannel;
  }

  public async unsubscribe({ channelName }: { channelName: string }) {
    await SocketReactNative.unsubscribe(channelName);
    this.channels.delete(channelName);
  }

  public async trigger(event: TBISocketEvent) {
    if (
      event.channelName.startsWith('private-') ||
      event.channelName.startsWith('presence-')
    ) {
      await SocketReactNative.trigger(
        event.channelName,
        event.eventName,
        event.data
      );
    } else {
      throw 'Trigger event is only for private/presence channels';
    }
  }

  public async getSocketId() {
    return await SocketReactNative.getSocketId();
  }

  public getChannel(channelName: string): TBISocketChannel | undefined {
    return this.channels.get(channelName);
  }
}
