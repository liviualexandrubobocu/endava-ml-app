"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var abstract_mlkitview_component_1 = require("~/tabs/mlkit/abstract.mlkitview.component");
var FaceDetectionComponent = /** @class */ (function (_super) {
    __extends(FaceDetectionComponent, _super);
    function FaceDetectionComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FaceDetectionComponent.prototype.onFaceDetectionResult = function (scanResult) {
        var value = scanResult.value;
        if (value.faces.length > 0) {
            this.faces = value.faces;
            console.log("this.faces: " + JSON.stringify(this.faces));
            var allSmilingAndEyesOpen_1 = true;
            value.faces.forEach(function (face) {
                allSmilingAndEyesOpen_1 = allSmilingAndEyesOpen_1 && face.smilingProbability && face.leftEyeOpenProbability && face.rightEyeOpenProbability &&
                    face.smilingProbability > 0.7 && face.leftEyeOpenProbability > 0.7 && face.rightEyeOpenProbability > 0.7;
            });
            this.mlKitAllOK = "All smiling and eyes open? " + (allSmilingAndEyesOpen_1 ? 'Yes!' : 'Nope');
        }
    };
    FaceDetectionComponent = __decorate([
        core_1.Component({
            selector: "mlkit-facedetection",
            moduleId: module.id,
            templateUrl: "./facedetection.component.html",
        })
    ], FaceDetectionComponent);
    return FaceDetectionComponent;
}(abstract_mlkitview_component_1.AbstractMLKitViewComponent));
exports.FaceDetectionComponent = FaceDetectionComponent;
