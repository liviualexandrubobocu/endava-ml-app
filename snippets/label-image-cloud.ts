import { MLKitImageLabelingCloudResult } from "nativescript-plugin-firebase/mlkit/imagelabeling";
import { ImageSource } from "tns-core-modules/image-source";
import * as Camera from "nativescript-camera";

const firebase = require("nativescript-plugin-firebase");

Camera.takePicture({
    width: 600,
    height: 600,
    keepAspectRatio: true,
    saveToGallery: true,
    cameraFacing: "rear"
}).then(imageAsset => {
    new ImageSource().fromAsset(imageAsset).then(imageSource => {
        labelCloudImage(imageSource);
    });
});

const labelCloudImage = (imageSource) => {
    firebase.mlkit.imagelabeling.labelImageCloud({
        image: imageSource,
        modelType: "stable",
        maxResults: 5
    })
    .then((result: MLKitImageLabelingCloudResult) => console.log(JSON.stringify(result.labels)))
    .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
};
