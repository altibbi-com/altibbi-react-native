package com.altibbi;


import android.util.Log;

import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


public class OTPublisherViewManager extends ViewGroupManager<OTPublisherLayout> {

    @Override
    public String getName() {

        return this.getClass().getSimpleName();
    }

    @Override
    protected OTPublisherLayout createViewInstance(ThemedReactContext reactContext) {

        return new OTPublisherLayout(reactContext);
    }

    @ReactProp(name = "publisherId")
    public void setPublisherId(OTPublisherLayout view, String publisherId) {

        view.createPublisherView(publisherId);
    }

}
