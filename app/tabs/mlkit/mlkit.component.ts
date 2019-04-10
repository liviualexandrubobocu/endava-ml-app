import { Component, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import * as Camera from "nativescript-camera";
import * as ImagePicker from "nativescript-imagepicker";
import { BarcodeFormat, MLKitScanBarcodesOnDeviceResult } from "nativescript-plugin-firebase/mlkit/barcodescanning";
import { MLKitCustomModelResult } from "nativescript-plugin-firebase/mlkit/custommodel";
import { MLKitDetectFacesOnDeviceResult } from "nativescript-plugin-firebase/mlkit/facedetection";
import {
  MLKitImageLabelingCloudResult,
  MLKitImageLabelingOnDeviceResult
} from "nativescript-plugin-firebase/mlkit/imagelabeling";
import { MLKitLandmarkRecognitionCloudResult } from "nativescript-plugin-firebase/mlkit/landmarkrecognition";
import { MLKitRecognizeTextResult } from "nativescript-plugin-firebase/mlkit/textrecognition";
import * as fileSystemModule from "tns-core-modules/file-system";
import { ImageAsset } from "tns-core-modules/image-asset";
import { fromFile, ImageSource } from "tns-core-modules/image-source";
import { isIOS } from "tns-core-modules/platform";
import { action } from "tns-core-modules/ui/dialogs";

const firebase = require("nativescript-plugin-firebase");

@Component({
  selector: "mlkit",
  moduleId: module.id,
  templateUrl: "./mlkit.component.html",
  styleUrls: ['./mlkit.component.css'],
})
export class MLKitComponent {

  pickedImage: ImageSource;
  pickedImages: ImageSource[] = [];

  public TEXT_RECOGNITION_DEVICE: string = "Text recognition (on device)";
  public TEXT_RECOGNITION_CLOUD: string = "Text recognition (cloud)";
  public BARCODE_SCANNING_DEVICE: string = "Barcode scanning (on device)";
  public FACE_DETECTION_DEVICE: string = "Face detection (on device)";
  public IMAGE_LABELLING_DEVICE: string = "Image labeling (on device)";
  public IMAGE_LABELLING_CLOUD: string = "Image labeling (cloud)";
  public LANDMARK_RECOGNITION_CLOUD: string = "Landmark recognition (cloud)";
  public CUSTOM_MODEL: string = "Custom model";

  public TEXT_RECOGNITION_FEATURE: string = "Text recognition";
  public BARCODE_SCANNING_FEATURE: string = "Barcode scanning";
  public FACE_DETECTION_FEATURE: string = "Face detection";
  public IMAGE_LABELLING_FEATURE: string = "Image labelling";
  public CUSTOM_MODEL_FEATURE: string = "Custom model";

  public TEXT_RECOGNITION_ROUTE: string = "/tabs/mlkit/textrecognition";
  public BARCODE_SCANNING_ROUTE: string = "/tabs/mlkit/barcodescanning";
  public FACE_DETECTION_ROUTE: string = "/tabs/mlkit/facedetection";
  public IMAGE_LABELLING_ROUTE: string = "/tabs/mlkit/imagelabeling";
  public CUSTOM_MODEL_ROUTE: string = "/tabs/mlkit/custommodel";


  private mlkitFeatures: Array<string> = [
    this.TEXT_RECOGNITION_DEVICE,
    this.TEXT_RECOGNITION_CLOUD,
    this.BARCODE_SCANNING_DEVICE,
    this.FACE_DETECTION_DEVICE,
    this.IMAGE_LABELLING_DEVICE,
    this.IMAGE_LABELLING_CLOUD,
    this.LANDMARK_RECOGNITION_CLOUD,
    this.CUSTOM_MODEL
  ];

  private mlkitOnDeviceFeatures: Array<string> = [
    this.TEXT_RECOGNITION_FEATURE,
    this.BARCODE_SCANNING_FEATURE,
    this.FACE_DETECTION_FEATURE,
    this.IMAGE_LABELLING_FEATURE,
    this.CUSTOM_MODEL_FEATURE
  ];

  constructor(private routerExtensions: RouterExtensions,
    private zone: NgZone) {
  }

  fromCameraFeed(): void {
    action(
      "Test which on-device ML Kit feature?",
      "Cancel",
      this.mlkitOnDeviceFeatures
    ).then((pickedItem: string) => {
      let route;
      switch (pickedItem) {
        case this.TEXT_RECOGNITION_FEATURE:
          route = this.TEXT_RECOGNITION_ROUTE;
          break;
        case this.BARCODE_SCANNING_FEATURE:
          route = this.BARCODE_SCANNING_ROUTE;
          break;
        case this.FACE_DETECTION_FEATURE:
          route = this.FACE_DETECTION_ROUTE;
          break;
        case this.IMAGE_LABELLING_FEATURE:
          route = this.IMAGE_LABELLING_ROUTE;
          break;
        case this.CUSTOM_MODEL_FEATURE:
          route = this.CUSTOM_MODEL_ROUTE;
          break;
      }

      if (route !== undefined) {
        this.routerExtensions.navigate([route],
          {
            animated: true,
            transition: {
              name: "slide",
              duration: 250,
              curve: "ease"
            }
          });
      }
    });
  }

  fromAppFolder(): void {
    const images = [
      "/images/puppy.jpg",
      "/images/donut.jpg",
      "/images/cat.jpg",
      "/images/car.jpg",
    ];

    for (let image of images) {
      const folder = fileSystemModule.knownFolders.currentApp();
      const path = fileSystemModule.path.join(folder.path, image);
      const exists = fileSystemModule.File.exists(path);

      if (exists) {
        const imageSource = fromFile(path);
        this.pickedImages.push(imageSource);
      }
    }

  }

  fromCameraPicture(): void {
    if (!isIOS) {
      Camera.requestPermissions();
    }
    Camera.takePicture({
      width: 600,
      height: 600,
      keepAspectRatio: true,
      saveToGallery: true,
      cameraFacing: "rear"
    }).then(imageAsset => {
      new ImageSource().fromAsset(imageAsset).then(imageSource => {
        this.pickedImage = imageSource;
        setTimeout(() => this.selectMLKitFeature(imageSource), 500);
      });
    });
  }

  fromCameraRoll(): void {
    const imagePicker = ImagePicker.create({
      mode: "single"
    });

    imagePicker
      .authorize()
      .then(() => imagePicker.present())
      .then((selection: Array<ImageAsset>) => {
        if (selection.length === 0) return;

        const selected = selection[0];
        selected.options.height = 600;
        selected.options.width = 600;
        selected.options.keepAspectRatio = true;
        selected.getImageAsync((image: any, error: any) => {
          if (error) {
            console.log(`Error getting image source from picker: ${error}`);
            return;
          }
          if (!image) {
            alert({
              title: `Invalid image`,
              message: `Perhaps this is an image from cloud storage?`,
              okButtonText: "Hmm.."
            });
            return;
          }
          const imageSource = new ImageSource();
          imageSource.setNativeSource(image);
          this.zone.run(() => {
            this.pickedImage = imageSource;
          });
          setTimeout(() => this.selectMLKitFeature(imageSource), 500);
        });
      })
      .catch(e => {
        console.log(`Image Picker error: ${e}`);
      });
  }

  reusePickedImage(pickedImage): void {
    if (pickedImage) {
      this.selectMLKitFeature(pickedImage);
    }
  }

  private selectMLKitFeature(imageSource: ImageSource): void {
    action(
      "What Firebase ML Kit feature do you want to use?",
      "Cancel",
      this.mlkitFeatures
    ).then((pickedItem: string) => {
      switch (pickedItem) {
        case this.TEXT_RECOGNITION_DEVICE:
          this.recognizeTextOnDevice(imageSource);
          break;
        case this.TEXT_RECOGNITION_CLOUD:
          this.recognizeTextCloud(imageSource);
          break;
        case this.BARCODE_SCANNING_DEVICE:
          this.scanBarcodeOnDevice(imageSource);
          break;
        case this.FACE_DETECTION_DEVICE:
          this.detectFacesOnDevice(imageSource);
          break;
        case this.IMAGE_LABELLING_DEVICE:
          this.labelImageOnDevice(imageSource);
          break;
        case this.IMAGE_LABELLING_CLOUD:
          this.labelImageCloud(imageSource);
          break;
        case this.LANDMARK_RECOGNITION_CLOUD:
          this.recognizeLandmarkCloud(imageSource);
          break;
        case this.CUSTOM_MODEL:
          this.customModel(imageSource);
          break;
        default:
          this.customModel(imageSource);
      }
    });
  }

  private recognizeTextOnDevice(imageSource: ImageSource): void {
    firebase.mlkit.textrecognition.recognizeTextOnDevice({
      image: imageSource
    }).then((result: MLKitRecognizeTextResult) => {
      console.log("recognizeTextOnDevice result: " + JSON.stringify(result));
      alert({
        title: `Result`,
        message: result.text ? result.text : "",
        okButtonText: "OK"
      });
    }).catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private recognizeTextCloud(imageSource: ImageSource): void {
    firebase.mlkit.textrecognition.recognizeTextCloud({
      image: imageSource,
      modelType: "latest",
      maxResults: 15
    }).then(
      (result: MLKitRecognizeTextResult) => {
        console.log("recognizeTextCloud result: " + JSON.stringify(result));
        alert({
          title: `Result`,
          message: result.text ? result.text : "",
          okButtonText: "OK"
        });
      })
      .catch((errorMessage) => {
        alert({
          title: `Result`,
          message: 'ML Kit Failure: ' + errorMessage,
          okButtonText: "OK"
        });
        console.log('ML Kit Failure: ' + errorMessage);
      });
  }

  private recognizeLandmarkCloud(imageSource: ImageSource): void {
    firebase.mlkit.landmarkrecognition.recognizeLandmarksCloud({
      image: imageSource,
      maxResults: 8
    }).then(
      (result: MLKitLandmarkRecognitionCloudResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.landmarks),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private customModel(imageSource: ImageSource): void {
    firebase.mlkit.custommodel.useCustomModel({
      image: imageSource,
      localModelFile: "~/custommodel/inception/inception_v3_quant.tflite",
      labelsFile: "~/custommodel/inception/inception_labels.txt",
      maxResults: 5,
      modelInput: [{
        shape: [1, 299, 299, 3], // others
        type: "QUANT"
      }],
    }).then(
      (result: MLKitCustomModelResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.result),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private scanBarcodeOnDevice(imageSource: ImageSource): void {
    console.log(">>> imageSource.rotationAngle: " + imageSource.rotationAngle);
    firebase.mlkit.barcodescanning.scanBarcodesOnDevice({
      image: imageSource,
      formats: [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13]
    }).then(
      (result: MLKitScanBarcodesOnDeviceResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.barcodes),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private detectFacesOnDevice(imageSource: ImageSource): void {
    firebase.mlkit.facedetection.detectFacesOnDevice({
      image: imageSource,
      detectionMode: "accurate",
      enableFaceTracking: false,
      minimumFaceSize: 0.25
    }).then(
      (result: MLKitDetectFacesOnDeviceResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.faces),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private labelImageOnDevice(imageSource: ImageSource): void {
    firebase.mlkit.imagelabeling.labelImageOnDevice({
      image: imageSource,
      confidenceThreshold: 0.3
    }).then(
      (result: MLKitImageLabelingOnDeviceResult) => {
        alert({
          title: `Result`,
          message: JSON.stringify(result.labels),
          okButtonText: "OK"
        });
      })
      .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
  }

  private labelImageCloud(imageSource: ImageSource): void {
    firebase.mlkit.imagelabeling.labelImageCloud({
      image: imageSource,
      modelType: "stable",
      maxResults: 5
    }).then(
      (result: MLKitImageLabelingCloudResult) => {
        alert({
          title: `Result`,
          message: 'You are looking at a: ' + result.labels[0].text,
          okButtonText: "OK"
        });
      })
      .catch((errorMessage) => {
        alert({
          title: `Result`,
          message: 'ML Kit Failure: ' + errorMessage,
          okButtonText: "OK"
        });
        console.log('ML Kit Failure: ' + errorMessage);
      });
  }

}
