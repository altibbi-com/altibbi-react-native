package com.altibbi;


import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import android.util.Log;


public class OTSubscriberViewManager extends ViewGroupManager<OTSubscriberLayout> {

    @Override
    public String getName() {

        return this.getClass().getSimpleName();
    }

    @Override
    protected OTSubscriberLayout createViewInstance(ThemedReactContext reactContext) {

        return new OTSubscriberLayout(reactContext);
    }

    @ReactProp(name = "streamId")
    public void setStreamId(OTSubscriberLayout view, String streamId) {
        if (streamId != null) {
            view.createSubscriberView(streamId);
        }
    }

}
