"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var abstract_mlkitview_component_1 = require("~/tabs/mlkit/abstract.mlkitview.component");
var BarcodeScanningComponent = /** @class */ (function (_super) {
    __extends(BarcodeScanningComponent, _super);
    function BarcodeScanningComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.pause = false;
        return _this;
    }
    BarcodeScanningComponent.prototype.onBarcodeScanResult = function (event) {
        var _this = this;
        var result = event.value;
        this.barcodes = result.barcodes;
        if (this.barcodes.length > 0) {
            console.log("this.barcodes: " + JSON.stringify(this.barcodes));
            console.log("pausing the scanner for 1 second (to show the 'pause' feature)");
            this.pause = true;
            setTimeout(function () { return _this.pause = false; }, 1000);
        }
    };
    BarcodeScanningComponent = __decorate([
        core_1.Component({
            selector: "mlkit-barcodescanning",
            moduleId: module.id,
            templateUrl: "./barcodescanning.component.html",
        })
    ], BarcodeScanningComponent);
    return BarcodeScanningComponent;
}(abstract_mlkitview_component_1.AbstractMLKitViewComponent));
exports.BarcodeScanningComponent = BarcodeScanningComponent;
