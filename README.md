# Integrating native mobile apps written in Angular and NativeScript with Firebase vision software

## NativeScript Environment Setup

## Steps:

### 0. Turn Virtualization On:
In order to install HAXM emulator you need to turn on VT-x technology on CPU from BIOS. Enter on Windows start, then F1, go to CPU setup, and turn VT-x on. 

### 1. Install Node.js:
Install the latest LTS version 10.x from Node.js website https://nodejs.org

### 2. Install Android Studio: 
Install Android Studio in order to be able to configure AVD manager and emulators (with operating system, type of view and RAM)

### 3. Install node packages:

npm i -g @angular/cli
npm i -g @nativescript/schematics
npm i -g nativescript

### 4. Check nativescript health and configure local builds:
tns doctor / to checkup nativescript installation

### 5. Configure the actual local build with nativescript console:
Configure Local Build
Allow installation of chocolatey (Windows package manager) 
In chocolatey install -  JDK, Android SDK, android emulator, HAXM emulator (It should now be possible to install HAXM emulator if Virtualization is turned on)

### 6. Check ANDROID_SDK_ROOT and ANDROID_HOME
in environment variables to point to same location under C:\Android\android-sdk. If there are not present, add the two variables to point to the Android SDK. Make sure that the Android SDK in Android Sdk Manager (Android Studio has the same path C:\Android\android-sdk) and then install build tools. 

### 7. Go to AVD manager in Android Studio:
Open new emulator and download devices in order to work properly. Use Android Oreo or Android Pie and a default Android device (eg Nexus 5x) for which the emulator to run. Set it to Cold boot when editing the emulator.
Turn Emulator on to see that it works.
If it doesn’t check log console for messages

### 8. Recheck environment variables and restart Android Studio:
Run Emulator for first time

All set!

# Create application

## NativeScript only:

ng new --collection=@nativescript/schematics my-mobile-app


## NativeScript shared web and mobile:

ng new --collection=@nativescript/schematics my-shared-app --shared

# To Run Endava ML APP

## Clone Repo

## Install packages:

npm install

## Run app:

npm run ml-app.android

or 

tns run android

## Run build (create debug apk)

npm run ml-app.android.build

or

tns build android

## Run bundled 

npm run ml-app.android.bundled

or 

tns run android --bundle

# Create Release APK

## Generate Key

keytool -genkey -v -keystore endava-ml.keystore -alias endava-ml -keyalg RSA -keysize 2048 -validity 10000

## Generate Release APK

tns build android --release --key-store-path "C:\path\to\endava-ml-app\endava-ml.keystore" --key-store-password endava --key-store-alias endava-ml --key-store-alias-password endava
