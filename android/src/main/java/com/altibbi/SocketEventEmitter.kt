package com.altibbi

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class SocketEventEmitter (private val context: ReactApplicationContext) {

  companion object {
    private const val EVENT_PREFIX = "SocketReactNative"
  }

  fun emit(eventName: String, params: Any?) {
    val jsModule = this.context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    val socketEventName = "${EVENT_PREFIX}:${eventName}"

    if (params is Map<*, *>) {
      jsModule.emit(socketEventName, Arguments.makeNativeMap(params as Map<String, Any>))
    }

    if (params is String) {
      jsModule.emit(socketEventName, params)
    }
  }
}
