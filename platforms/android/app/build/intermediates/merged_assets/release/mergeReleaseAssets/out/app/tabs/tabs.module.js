"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("nativescript-angular/common");
var mlkit_component_1 = require("./mlkit/mlkit.component");
var tabs_routing_module_1 = require("./tabs-routing.module");
var tabs_component_1 = require("./tabs.component");
var textrecognition_component_1 = require("~/tabs/mlkit/textrecognition/textrecognition.component");
var barcodescanning_component_1 = require("~/tabs/mlkit/barcodescanning/barcodescanning.component");
var facedetection_component_1 = require("~/tabs/mlkit/facedetection/facedetection.component");
var imagelabeling_component_1 = require("~/tabs/mlkit/imagelabeling/imagelabeling.component");
var custommodel_component_1 = require("~/tabs/mlkit/custommodel/custommodel.component");
var element_registry_1 = require("nativescript-angular/element-registry");
element_registry_1.registerElement("MLKitBarcodeScanner", function () { return require("nativescript-plugin-firebase/mlkit/barcodescanning").MLKitBarcodeScanner; });
element_registry_1.registerElement("MLKitFaceDetection", function () { return require("nativescript-plugin-firebase/mlkit/facedetection").MLKitFaceDetection; });
element_registry_1.registerElement("MLKitTextRecognition", function () { return require("nativescript-plugin-firebase/mlkit/textrecognition").MLKitTextRecognition; });
element_registry_1.registerElement("MLKitImageLabeling", function () { return require("nativescript-plugin-firebase/mlkit/imagelabeling").MLKitImageLabeling; });
element_registry_1.registerElement("MLKitCustomModel", function () { return require("nativescript-plugin-firebase/mlkit/custommodel").MLKitCustomModel; });
var TabsModule = /** @class */ (function () {
    function TabsModule() {
    }
    TabsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.NativeScriptCommonModule,
                tabs_routing_module_1.TabsRoutingModule
            ],
            declarations: [
                barcodescanning_component_1.BarcodeScanningComponent,
                facedetection_component_1.FaceDetectionComponent,
                imagelabeling_component_1.ImageLabelingComponent,
                mlkit_component_1.MLKitComponent,
                tabs_component_1.TabsComponent,
                textrecognition_component_1.TextRecognitionComponent,
                custommodel_component_1.CustomModelComponent
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], TabsModule);
    return TabsModule;
}());
exports.TabsModule = TabsModule;
