declare const OT: any;
declare const nativeEvents: NativeEventEmitter;
declare function checkAndroidPermissions(): Promise<any>;
declare function setNativeEvents(events: any): void;
declare function removeNativeEvents(events: any): void;
import { NativeEventEmitter } from 'react-native';

// Export the declared types
export {
  OT,
  nativeEvents,
  checkAndroidPermissions,
  setNativeEvents,
  removeNativeEvents,
};
