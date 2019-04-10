"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var abstract_mlkitview_component_1 = require("~/tabs/mlkit/abstract.mlkitview.component");
var ImageLabelingComponent = /** @class */ (function (_super) {
    __extends(ImageLabelingComponent, _super);
    function ImageLabelingComponent() {
        var _this = _super.call(this) || this;
        // let's start with the torch on, just for show
        _this.torchOn = true;
        return _this;
    }
    ImageLabelingComponent.prototype.onImageLabelingResult = function (scanResult) {
        var value = scanResult.value;
        this.labels = value.labels;
    };
    ImageLabelingComponent = __decorate([
        core_1.Component({
            selector: "mlkit-imagelabeling",
            moduleId: module.id,
            templateUrl: "./imagelabeling.component.html",
        }),
        __metadata("design:paramtypes", [])
    ], ImageLabelingComponent);
    return ImageLabelingComponent;
}(abstract_mlkitview_component_1.AbstractMLKitViewComponent));
exports.ImageLabelingComponent = ImageLabelingComponent;
