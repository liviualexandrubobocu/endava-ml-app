"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var abstract_mlkitview_component_1 = require("~/tabs/mlkit/abstract.mlkitview.component");
var TextRecognitionComponent = /** @class */ (function (_super) {
    __extends(TextRecognitionComponent, _super);
    function TextRecognitionComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextRecognitionComponent.prototype.onTextRecognitionResult = function (scanResult) {
        var value = scanResult.value;
        this.blocks = value.blocks;
    };
    TextRecognitionComponent = __decorate([
        core_1.Component({
            selector: "mlkit-textrecognition",
            moduleId: module.id,
            templateUrl: "./textrecognition.component.html",
        })
    ], TextRecognitionComponent);
    return TextRecognitionComponent;
}(abstract_mlkitview_component_1.AbstractMLKitViewComponent));
exports.TextRecognitionComponent = TextRecognitionComponent;
