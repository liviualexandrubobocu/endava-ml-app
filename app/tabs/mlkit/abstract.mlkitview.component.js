"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractMLKitViewComponent = /** @class */ (function () {
    function AbstractMLKitViewComponent() {
        this.torchOn = false;
    }
    AbstractMLKitViewComponent.prototype.toggleTorch = function (args) {
        if (args.value !== null && args.value !== this.torchOn) {
            this.torchOn = args.value;
        }
    };
    return AbstractMLKitViewComponent;
}());
exports.AbstractMLKitViewComponent = AbstractMLKitViewComponent;
