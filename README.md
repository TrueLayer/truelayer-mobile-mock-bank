<p align="center">
    <img height="100px" src="./truelayer_logo.svg" />
</p>

<br>

# TrueLayer Mobile Mock Bank

The TrueLayer Mobile Mock Bank lets you complete payments made via TrueLayer's mock banks via a mobile app to simulate the experience of completing a payment within a bank's app.

<p align="center">
    <img height="350px" src="./docs/android_demo.gif">
    <br/>
    <br/>
    <img height="350px" src="./docs/iOS_demo.gif">
</p>



## Requirements
- Node 14+
- JDK 11+
- Android 12+
- Ruby 2.7.5+
- Xcode 13.4.1+
- [Cocopaods](https://guides.cocoapods.org/using/getting-started.html) (iOS Only) 

For more help setting up your environment you can follow the steps [here](https://reactnative.dev/docs/environment-setup).

## Build
### Android
To test on an Android emulator or device you can run the following commands.
```
yarn react-native start
```

In a separate terminal window run the next command to start the app.
```
yarn react-native run-android
```

To build an APK for Android devices you can run the following commands.
```
yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

```
cd android
```

```
./gradlew assembleDebug
```

The APK will be available in the path `android/app/build/outputs/apk/debug/app-debug.apk`

### iOS
To test on an iOS simlulator or device you can run the following commands.
```
yarn react-native start
```

In the `ios` folder install depedencies with
```
pod install
```

In a separate terminal window run the next command to start the app.
```
yarn react-native run-ios
```

Or you can open the `ios` folder in Xcode and build the app directly from its UI.

## Usage
1. Install the app on your device
2. On Android devices, you need to approve support for supported links to be redirected to the app instead of the website.
   1. Go to Settings -> Apps -> See All Apps -> MockBank -> Open by Default -> + Add Link
   2. Check the boxes next to each of the links in the list and confirm.
3. Create a payment on your device via the HPP or mobile SDKs using one of TrueLayer's mock banks.
4. At the final step of the payment you'll be redirected to the MockBank app.
5. Select an option to complete or reject the payment.


### Test Universal Links
Requirements: Having the simulator with mock bank app booted (See above)

```bash
$ xcrun simctl openurl booted https://pay-mock-connect.truelayer-sandbox.com/login/7e0670ea-4ef2-4a20-b333-c71b15e9499d\#token\=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTA2NzBlYS00ZWYyLTRhMjAtYjMzMy1jNzFiMTVlOTQ5OWQiLCJzY29wZSI6InBheS1tb2NrLWNvbm5lY3QtYXBpIiwibmJmIjoxNjY2NzgxNjYzLCJleHAiOjE2NjY3ODUyNjMsImlzcyI6Imh0dHBzOi8vcGF5LW1vY2stY29ubmVjdC50N3IuZGV2IiwiYXVkIjoiaHR0cHM6Ly9wYXktbW9jay1jb25uZWN0LnQ3ci5kZXYifQ.OjtUsxjVlQWNO14iA3XEn1zF0F0ZMrQYHbWWaIV2Uvc
```

Expected output: should load the app with `paymentId: 7e0670ea-4ef2-4a20-b333-c71b15e9499d` at the bottom of the screen
