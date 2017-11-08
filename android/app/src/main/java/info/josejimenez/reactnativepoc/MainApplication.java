package info.josejimenez.reactnativepoc;

import android.app.Application;
import android.content.Intent;

import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.reactnativenavigation.controllers.ActivityCallbacks;
import com.zmxv.RNSound.RNSoundPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.reactnativenavigation.NavigationApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.facebook.FacebookSdk;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public void onCreate() {
    super.onCreate();

    setActivityCallbacks(new ActivityCallbacks() {
      @Override
      public void onActivityResult(int requestCode, int resultCode, Intent data) {
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
      }
    });

    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new RNGoogleSigninPackage(),
        new FBSDKPackage(mCallbackManager),
        new FIRMessagingPackage(),
        new RNSoundPackage(),
        new VectorIconsPackage(),
        new RNFetchBlobPackage(),
        new ReactNativeAudioPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }
}
