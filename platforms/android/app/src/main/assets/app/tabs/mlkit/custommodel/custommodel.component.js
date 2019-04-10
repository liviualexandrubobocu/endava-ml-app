"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var abstract_mlkitview_component_1 = require("~/tabs/mlkit/abstract.mlkitview.component");
var CustomModelComponent = /** @class */ (function (_super) {
    __extends(CustomModelComponent, _super);
    function CustomModelComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomModelComponent.prototype.onCustomModelResult = function (scanResult) {
        var value = scanResult.value;
        this.labels = value.result;
    };
    CustomModelComponent = __decorate([
        core_1.Component({
            selector: "mlkit-custommodel",
            moduleId: module.id,
            templateUrl: "./custommodel.component.html",
        })
    ], CustomModelComponent);
    return CustomModelComponent;
}(abstract_mlkitview_component_1.AbstractMLKitViewComponent));
exports.CustomModelComponent = CustomModelComponent;
