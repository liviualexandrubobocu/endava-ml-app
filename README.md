# Integrating native mobile apps written in Angular and NativeScript with Firebase vision software

## Cloning:

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
