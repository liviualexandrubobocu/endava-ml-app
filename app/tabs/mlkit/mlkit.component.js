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
        this.mlkitFeatures = [
            "Text recognition (on device)",
            "Text recognition (cloud)",
            "Barcode scanning (on device)",
            "Face detection (on device)",
            "Image labeling (on device)",
            "Image labeling (cloud)",
            "Custom model",
            "Landmark recognition (cloud)"
        ];
        this.mlkitOnDeviceFeatures = [
            "Text recognition",
            "Barcode scanning",
            "Face detection",
            "Image labeling",
            "Custom model"
        ];
    }
    MLKitComponent.prototype.fromCameraFeed = function () {
        var _this = this;
        dialogs_1.action("Test which on-device ML Kit feature?", "Cancel", this.mlkitOnDeviceFeatures).then(function (pickedItem) {
            var to;
            if (pickedItem === "Text recognition") {
                to = "/tabs/mlkit/textrecognition";
            }
            else if (pickedItem === "Barcode scanning") {
                to = "/tabs/mlkit/barcodescanning";
            }
            else if (pickedItem === "Face detection") {
                to = "/tabs/mlkit/facedetection";
            }
            else if (pickedItem === "Image labeling") {
                to = "/tabs/mlkit/imagelabeling";
            }
            else if (pickedItem === "Custom model") {
                to = "/tabs/mlkit/custommodel";
            }
            if (to !== undefined) {
                _this.routerExtensions.navigate([to], {
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
                // give the user some time to to see the picture
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
                // give the user some time to to see the picture
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
        dialogs_1.action("Use which ML Kit feature?", "Cancel", this.mlkitFeatures).then(function (pickedItem) {
            var pickedItemIndex = _this.mlkitFeatures.indexOf(pickedItem);
            if (pickedItem === "Text recognition (on device)") {
                _this.recognizeTextOnDevice(imageSource);
            }
            else if (pickedItem === "Text recognition (cloud)") {
                _this.recognizeTextCloud(imageSource);
            }
            else if (pickedItem === "Barcode scanning (on device)") {
                _this.scanBarcodeOnDevice(imageSource);
            }
            else if (pickedItem === "Face detection (on device)") {
                _this.detectFacesOnDevice(imageSource);
            }
            else if (pickedItem === "Image labeling (on device)") {
                _this.labelImageOnDevice(imageSource);
            }
            else if (pickedItem === "Image labeling (cloud)") {
                _this.labelImageCloud(imageSource);
            }
            else if (pickedItem === "Landmark recognition (cloud)") {
                _this.recognizeLandmarkCloud(imageSource);
            }
            else if (pickedItem === "Custom model") {
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
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
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
            // note that only local quant models work currently (so not 'float' models, and not loaded from the cloud)
            // cloudModelName: "~/mobilenet_quant_v2_1_0_299",
            // cloudModelName: "~/inception_v3_quant",
            // note that there's an issue with this model (making the app crash): "ValueError: Model provided has model identifier 'Mobi', should be 'TFL3'" (reported by https://github.com/EddyVerbruggen/ns-mlkit-tflite-curated/blob/master/scripts/get_model_details.py)
            // localModelFile: "~/custommodel/nutella/nutella_quantize.tflite",
            // labelsFile: "~/custommodel/nutella/nutella_labels.txt",
            // localModelFile: "~/custommodel/mobilenet/mobilenet_quant_v2_1.0_299.tflite",
            // labelsFile: "~/custommodel/mobilenet/mobilenet_labels.txt",
            localModelFile: "~/custommodel/inception/inception_v3_quant.tflite",
            labelsFile: "~/custommodel/inception/inception_labels.txt",
            maxResults: 5,
            modelInput: [{
                    // shape: [1, 224, 224, 3], // flowers / nutella
                    shape: [1, 299, 299, 3],
                    type: "QUANT" // the only currently supported type of model
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
    /*
    private customModelOnDevice(imageSource: ImageSource): void {
      console.log("customModelOnDevice");
      firebase.mlkit.custommodel.useCustomModel({
        image: imageSource
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
    */
    MLKitComponent.prototype.labelImageCloud = function (imageSource) {
        firebase.mlkit.imagelabeling.labelImageCloud({
            image: imageSource,
            modelType: "stable",
            maxResults: 5
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.labels),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
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
