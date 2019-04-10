"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var tabs_component_1 = require("./tabs.component");
var textrecognition_component_1 = require("~/tabs/mlkit/textrecognition/textrecognition.component");
var barcodescanning_component_1 = require("~/tabs/mlkit/barcodescanning/barcodescanning.component");
var facedetection_component_1 = require("~/tabs/mlkit/facedetection/facedetection.component");
var imagelabeling_component_1 = require("~/tabs/mlkit/imagelabeling/imagelabeling.component");
var custommodel_component_1 = require("~/tabs/mlkit/custommodel/custommodel.component");
var routes = [
    { path: "", component: tabs_component_1.TabsComponent },
    { path: "mlkit/textrecognition", component: textrecognition_component_1.TextRecognitionComponent },
    { path: "mlkit/barcodescanning", component: barcodescanning_component_1.BarcodeScanningComponent },
    { path: "mlkit/facedetection", component: facedetection_component_1.FaceDetectionComponent },
    { path: "mlkit/imagelabeling", component: imagelabeling_component_1.ImageLabelingComponent },
    { path: "mlkit/custommodel", component: custommodel_component_1.CustomModelComponent }
];
var TabsRoutingModule = /** @class */ (function () {
    function TabsRoutingModule() {
    }
    TabsRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forChild(routes)],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], TabsRoutingModule);
    return TabsRoutingModule;
}());
exports.TabsRoutingModule = TabsRoutingModule;
