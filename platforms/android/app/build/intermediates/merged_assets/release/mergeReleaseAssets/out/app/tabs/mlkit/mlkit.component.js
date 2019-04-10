"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_angular_1 = require("nativescript-angular");
var Camera = require("nativescript-camera");
var ImagePicker = require("nativescript-imagepicker");
var barcodescanning_1 = require("nativescript-plugin-firebase/mlkit/barcodescanning");
var fileSystemModule = require("tns-core-modules/file-system");
var image_source_1 = require("tns-core-modules/image-source");
var platform_1 = require("tns-core-modules/platform");
var dialogs_1 = require("tns-core-modules/ui/dialogs");
var firebase = require("nativescript-plugin-firebase");
var MLKitComponent = /** @class */ (function () {
    function MLKitComponent(routerExtensions, zone) {
        this.routerExtensions = routerExtensions;
        this.zone = zone;
        this.pickedImages = [];
        this.TEXT_RECOGNITION_DEVICE = "Text recognition (on device)";
        this.TEXT_RECOGNITION_CLOUD = "Text recognition (cloud)";
        this.BARCODE_SCANNING_DEVICE = "Barcode scanning (on device)";
        this.FACE_DETECTION_DEVICE = "Face detection (on device)";
        this.IMAGE_LABELLING_DEVICE = "Image labeling (on device)";
        this.IMAGE_LABELLING_CLOUD = "Image labeling (cloud)";
        this.LANDMARK_RECOGNITION_CLOUD = "Landmark recognition (cloud)";
        this.CUSTOM_MODEL = "Custom model";
        this.TEXT_RECOGNITION_FEATURE = "Text recognition";
        this.BARCODE_SCANNING_FEATURE = "Barcode scanning";
        this.FACE_DETECTION_FEATURE = "Face detection";
        this.IMAGE_LABELLING_FEATURE = "Image labelling";
        this.CUSTOM_MODEL_FEATURE = "Custom model";
        this.TEXT_RECOGNITION_ROUTE = "/tabs/mlkit/textrecognition";
        this.BARCODE_SCANNING_ROUTE = "/tabs/mlkit/barcodescanning";
        this.FACE_DETECTION_ROUTE = "/tabs/mlkit/facedetection";
        this.IMAGE_LABELLING_ROUTE = "/tabs/mlkit/imagelabeling";
        this.CUSTOM_MODEL_ROUTE = "/tabs/mlkit/custommodel";
        this.mlkitFeatures = [
            this.TEXT_RECOGNITION_DEVICE,
            this.TEXT_RECOGNITION_CLOUD,
            this.BARCODE_SCANNING_DEVICE,
            this.FACE_DETECTION_DEVICE,
            this.IMAGE_LABELLING_DEVICE,
            this.IMAGE_LABELLING_CLOUD,
            this.LANDMARK_RECOGNITION_CLOUD,
            this.CUSTOM_MODEL
        ];
        this.mlkitOnDeviceFeatures = [
            this.TEXT_RECOGNITION_FEATURE,
            this.BARCODE_SCANNING_FEATURE,
            this.FACE_DETECTION_FEATURE,
            this.IMAGE_LABELLING_FEATURE,
            this.CUSTOM_MODEL_FEATURE
        ];
    }
    MLKitComponent.prototype.fromCameraFeed = function () {
        var _this = this;
        dialogs_1.action("Test which on-device ML Kit feature?", "Cancel", this.mlkitOnDeviceFeatures).then(function (pickedItem) {
            var route;
            switch (pickedItem) {
                case _this.TEXT_RECOGNITION_FEATURE:
                    route = _this.TEXT_RECOGNITION_ROUTE;
                    break;
                case _this.BARCODE_SCANNING_FEATURE:
                    route = _this.BARCODE_SCANNING_ROUTE;
                    break;
                case _this.FACE_DETECTION_FEATURE:
                    route = _this.FACE_DETECTION_ROUTE;
                    break;
                case _this.IMAGE_LABELLING_FEATURE:
                    route = _this.IMAGE_LABELLING_ROUTE;
                    break;
                case _this.CUSTOM_MODEL_FEATURE:
                    route = _this.CUSTOM_MODEL_ROUTE;
                    break;
            }
            if (route !== undefined) {
                _this.routerExtensions.navigate([route], {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 250,
                        curve: "ease"
                    }
                });
            }
        });
    };
    MLKitComponent.prototype.fromAppFolder = function () {
        var images = [
            "/images/puppy.jpg",
            "/images/donut.jpg",
            "/images/cat.jpg",
            "/images/car.jpg",
        ];
        for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
            var image = images_1[_i];
            var folder = fileSystemModule.knownFolders.currentApp();
            var path = fileSystemModule.path.join(folder.path, image);
            var exists = fileSystemModule.File.exists(path);
            if (exists) {
                var imageSource = image_source_1.fromFile(path);
                this.pickedImages.push(imageSource);
            }
        }
    };
    MLKitComponent.prototype.fromCameraPicture = function () {
        var _this = this;
        if (!platform_1.isIOS) {
            Camera.requestPermissions();
        }
        Camera.takePicture({
            width: 600,
            height: 600,
            keepAspectRatio: true,
            saveToGallery: true,
            cameraFacing: "rear"
        }).then(function (imageAsset) {
            new image_source_1.ImageSource().fromAsset(imageAsset).then(function (imageSource) {
                _this.pickedImage = imageSource;
                setTimeout(function () { return _this.selectMLKitFeature(imageSource); }, 500);
            });
        });
    };
    MLKitComponent.prototype.fromCameraRoll = function () {
        var _this = this;
        var imagePicker = ImagePicker.create({
            mode: "single"
        });
        imagePicker
            .authorize()
            .then(function () { return imagePicker.present(); })
            .then(function (selection) {
            if (selection.length === 0)
                return;
            var selected = selection[0];
            selected.options.height = 600;
            selected.options.width = 600;
            selected.options.keepAspectRatio = true;
            selected.getImageAsync(function (image, error) {
                if (error) {
                    console.log("Error getting image source from picker: " + error);
                    return;
                }
                if (!image) {
                    alert({
                        title: "Invalid image",
                        message: "Perhaps this is an image from cloud storage?",
                        okButtonText: "Hmm.."
                    });
                    return;
                }
                var imageSource = new image_source_1.ImageSource();
                imageSource.setNativeSource(image);
                _this.zone.run(function () {
                    _this.pickedImage = imageSource;
                });
                setTimeout(function () { return _this.selectMLKitFeature(imageSource); }, 500);
            });
        })
            .catch(function (e) {
            console.log("Image Picker error: " + e);
        });
    };
    MLKitComponent.prototype.reusePickedImage = function (pickedImage) {
        if (pickedImage) {
            this.selectMLKitFeature(pickedImage);
        }
    };
    MLKitComponent.prototype.selectMLKitFeature = function (imageSource) {
        var _this = this;
        dialogs_1.action("What Firebase ML Kit feature do you want to use?", "Cancel", this.mlkitFeatures).then(function (pickedItem) {
            switch (pickedItem) {
                case _this.TEXT_RECOGNITION_DEVICE:
                    _this.recognizeTextOnDevice(imageSource);
                    break;
                case _this.TEXT_RECOGNITION_CLOUD:
                    _this.recognizeTextCloud(imageSource);
                    break;
                case _this.BARCODE_SCANNING_DEVICE:
                    _this.scanBarcodeOnDevice(imageSource);
                    break;
                case _this.FACE_DETECTION_DEVICE:
                    _this.detectFacesOnDevice(imageSource);
                    break;
                case _this.IMAGE_LABELLING_DEVICE:
                    _this.labelImageOnDevice(imageSource);
                    break;
                case _this.IMAGE_LABELLING_CLOUD:
                    _this.labelImageCloud(imageSource);
                    break;
                case _this.LANDMARK_RECOGNITION_CLOUD:
                    _this.recognizeLandmarkCloud(imageSource);
                    break;
                case _this.CUSTOM_MODEL:
                    _this.customModel(imageSource);
                    break;
                default:
                    _this.customModel(imageSource);
            }
        });
    };
    MLKitComponent.prototype.recognizeTextOnDevice = function (imageSource) {
        firebase.mlkit.textrecognition.recognizeTextOnDevice({
            image: imageSource
        }).then(function (result) {
            console.log("recognizeTextOnDevice result: " + JSON.stringify(result));
            alert({
                title: "Result",
                message: result.text ? result.text : "",
                okButtonText: "OK"
            });
        }).catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.recognizeTextCloud = function (imageSource) {
        firebase.mlkit.textrecognition.recognizeTextCloud({
            image: imageSource,
            modelType: "latest",
            maxResults: 15
        }).then(function (result) {
            console.log("recognizeTextCloud result: " + JSON.stringify(result));
            alert({
                title: "Result",
                message: result.text ? result.text : "",
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) {
            alert({
                title: "Result",
                message: 'ML Kit Failure: ' + errorMessage,
                okButtonText: "OK"
            });
            console.log('ML Kit Failure: ' + errorMessage);
        });
    };
    MLKitComponent.prototype.recognizeLandmarkCloud = function (imageSource) {
        firebase.mlkit.landmarkrecognition.recognizeLandmarksCloud({
            image: imageSource,
            maxResults: 8
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.landmarks),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.customModel = function (imageSource) {
        firebase.mlkit.custommodel.useCustomModel({
            image: imageSource,
            localModelFile: "~/custommodel/inception/inception_v3_quant.tflite",
            labelsFile: "~/custommodel/inception/inception_labels.txt",
            maxResults: 5,
            modelInput: [{
                    shape: [1, 299, 299, 3],
                    type: "QUANT"
                }],
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.result),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.scanBarcodeOnDevice = function (imageSource) {
        console.log(">>> imageSource.rotationAngle: " + imageSource.rotationAngle);
        firebase.mlkit.barcodescanning.scanBarcodesOnDevice({
            image: imageSource,
            formats: [barcodescanning_1.BarcodeFormat.QR_CODE, barcodescanning_1.BarcodeFormat.EAN_13]
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.barcodes),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.detectFacesOnDevice = function (imageSource) {
        firebase.mlkit.facedetection.detectFacesOnDevice({
            image: imageSource,
            detectionMode: "accurate",
            enableFaceTracking: false,
            minimumFaceSize: 0.25
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.faces),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.labelImageOnDevice = function (imageSource) {
        firebase.mlkit.imagelabeling.labelImageOnDevice({
            image: imageSource,
            confidenceThreshold: 0.3
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.labels),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.labelImageCloud = function (imageSource) {
        firebase.mlkit.imagelabeling.labelImageCloud({
            image: imageSource,
            modelType: "stable",
            maxResults: 5
        }).then(function (result) {
            alert({
                title: "Result",
                message: 'You are looking at a: ' + result.labels[0].text,
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) {
            alert({
                title: "Result",
                message: 'ML Kit Failure: ' + errorMessage,
                okButtonText: "OK"
            });
            console.log('ML Kit Failure: ' + errorMessage);
        });
    };
    MLKitComponent = __decorate([
        core_1.Component({
            selector: "mlkit",
            moduleId: module.id,
            templateUrl: "./mlkit.component.html",
            styleUrls: ['./mlkit.component.css'],
        }),
        __metadata("design:paramtypes", [nativescript_angular_1.RouterExtensions,
            core_1.NgZone])
    ], MLKitComponent);
    return MLKitComponent;
}());
exports.MLKitComponent = MLKitComponent;
