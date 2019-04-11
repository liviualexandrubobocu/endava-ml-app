

import { MLKitCustomModelResult } from "nativescript-plugin-firebase/mlkit/custommodel";
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
        useCustomClassifier(imageSource);
    });
});

const useCustomClassifier = (imageSource) => {
    firebase.mlkit.custommodel.useCustomModel({
        image: imageSource,
        maxResults: 10,
        localModelFile: "~/path/to/custom-model/custom-model-name.tflite",
        labelsFile: "~/path/to/custom-labels/custom-model-labels.txt",
        modelInput: [{
            shape: [1, 299, 299, 3],
            type: "QUANT" // quantized model
        }]
    })
    .then((result: MLKitCustomModelResult) => console.log(JSON.stringify(result.result)))
    .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
};

//Post-training quantization is a general technique to reduce model size while also providing up to 3x lower latency with little degradation in model accuracy. 
//Post-training quantization quantizes weights from floating point to 8-bits of precision. 
//This technique is enabled as an option in the TensorFlow Lite converter



