(global["webpackJsonp"] = global["webpackJsonp"] || []).push([[0],{

/***/ "./tabs/mlkit/abstract.mlkitview.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractMLKitViewComponent", function() { return AbstractMLKitViewComponent; });
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



/***/ }),

/***/ "./tabs/mlkit/barcodescanning/barcodescanning.component.html":
/***/ (function(module, exports) {

module.exports = "<ActionBar class=\"action-bar\">\r\n  <Label class=\"action-bar-title\" text=\"Barcode scanning\"></Label>\r\n</ActionBar>\r\n\r\n<GridLayout>\r\n  <MLKitBarcodeScanner\r\n      width=\"100%\"\r\n      height=\"100%\"\r\n      formats=\"QR_CODE, UPC_A, EAN_13\"\r\n      beepOnScan=\"true\"\r\n      android:processEveryNthFrame=\"5\"\r\n      ios:processEveryNthFrame=\"10\"\r\n      [torchOn]=\"torchOn\"\r\n      [pause]=\"pause\"\r\n      (scanResult)=\"onBarcodeScanResult($event)\">\r\n  </MLKitBarcodeScanner>\r\n\r\n  <GridLayout rows=\"*, 320, *\" columns=\"*, 5/6*, *\">\r\n    <Label class=\"mask\" row=\"0\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"2\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"0\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"2\"></Label>\r\n    <GridLayout row=\"1\" col=\"1\" rows=\"1/6*, *, 1/6*\" columns=\"1/6*, *, 1/6*\">\r\n      <Label class=\"frame-top-left\" row=\"0\" col=\"0\"></Label>\r\n      <Label class=\"frame-top-right\" row=\"0\" col=\"2\"></Label>\r\n      <Label class=\"frame-bottom-left\" row=\"2\" col=\"0\"></Label>\r\n      <Label class=\"frame-bottom-right\" row=\"2\" col=\"2\"></Label>\r\n      <StackLayout class=\"swing\" row=\"0\" col=\"0\" colSpan=\"3\">\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.1)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.2)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.3)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.4)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.5)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.6)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.7)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.8)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.9)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 1)\"></Label>\r\n      </StackLayout>\r\n    </GridLayout>\r\n    <Label row=\"0\" col=\"1\" class=\"text-center c-white\" textWrap=\"true\" verticalAlignment=\"center\" text=\"The scanner has been configured to detect QR codes, UPC A, and EAN 13. It processes every 5th frame (default 10). These settings can be tweaked in your usage of the plugin. Oh, and we briefly pause the scanner after every scan, just for show.\"></Label>\r\n    <ListView row=\"2\" col=\"0\" colSpan=\"3\" [items]=\"barcodes\" class=\"m-t-20\" backgroundColor=\"transparent\">\r\n      <ng-template let-item=\"item\">\r\n        <GridLayout columns=\"2*, 3*\">\r\n          <Label col=\"0\" class=\"mlkit-result\" textWrap=\"true\" [text]=\"item.format\"></Label>\r\n          <Label col=\"1\" class=\"mlkit-result\" textWrap=\"true\" [text]=\"item.value\"></Label>\r\n        </GridLayout>\r\n      </ng-template>\r\n    </ListView>\r\n  </GridLayout>\r\n\r\n  <GridLayout rows=\"auto\" columns=\"auto, auto\" horizontalAlignment=\"right\" class=\"m-t-4 m-r-8\">\r\n    <Label col=\"0\" text=\"Torch\" class=\"c-white\" [class.disabled]=\"!torchOn\"></Label>\r\n    <Switch col=\"1\" [checked]=\"torchOn\" (checkedChange)=\"toggleTorch($event)\"></Switch>\r\n  </GridLayout>\r\n\r\n</GridLayout>\r\n"

/***/ }),

/***/ "./tabs/mlkit/barcodescanning/barcodescanning.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BarcodeScanningComponent", function() { return BarcodeScanningComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./tabs/mlkit/abstract.mlkitview.component.ts");


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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "mlkit-barcodescanning",
            /*duleId: module.i*/
            template: __webpack_require__("./tabs/mlkit/barcodescanning/barcodescanning.component.html"),
        })
    ], BarcodeScanningComponent);
    return BarcodeScanningComponent;
}(_tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__["AbstractMLKitViewComponent"]));



/***/ }),

/***/ "./tabs/mlkit/custommodel/custommodel.component.html":
/***/ (function(module, exports) {

module.exports = "<ActionBar class=\"action-bar\">\r\n  <Label class=\"action-bar-title\" text=\"Custom model\"></Label>\r\n</ActionBar>\r\n\r\n<GridLayout>\r\n  <MLKitCustomModel\r\n      width=\"100%\"\r\n      height=\"100%\"\r\n      localModelFile=\"~/custommodel/inception/inception_v3_quant.tflite\"\r\n      labelsFile=\"~/custommodel/inception/inception_labels.txt\"\r\n      modelInputShape=\"1, 299, 299, 3\"\r\n      modelInputType=\"QUANT\"\r\n      processEveryNthFrame=\"30\"\r\n      maxResults=\"5\"\r\n      (scanResult)=\"onCustomModelResult($event)\">\r\n  </MLKitCustomModel>\r\n\r\n  <GridLayout rows=\"*, 320, *\" columns=\"*, 5/6*, *\">\r\n    <Label class=\"mask\" row=\"0\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"2\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"0\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"2\"></Label>\r\n    <GridLayout row=\"1\" col=\"1\" rows=\"1/6*, *, 1/6*\" columns=\"1/6*, *, 1/6*\">\r\n      <Label class=\"frame-top-left\" row=\"0\" col=\"0\"></Label>\r\n      <Label class=\"frame-top-right\" row=\"0\" col=\"2\"></Label>\r\n      <Label class=\"frame-bottom-left\" row=\"2\" col=\"0\"></Label>\r\n      <Label class=\"frame-bottom-right\" row=\"2\" col=\"2\"></Label>\r\n      <StackLayout class=\"swing\" row=\"0\" col=\"0\" colSpan=\"3\">\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.1)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.2)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.3)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.4)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.5)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.6)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.7)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.8)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.9)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 1)\"></Label>\r\n      </StackLayout>\r\n    </GridLayout>\r\n    <ListView separatorColor=\"transparent\" row=\"0\" rowSpan=\"3\" col=\"0\" colSpan=\"3\" [items]=\"labels\" class=\"m-t-20\" backgroundColor=\"transparent\">\r\n      <ng-template let-item=\"item\">\r\n        <GridLayout columns=\"3*, 2*\">\r\n          <Label col=\"0\" class=\"mlkit-result\" textWrap=\"true\" [text]=\"item.text\"></Label>\r\n          <Label col=\"1\" class=\"mlkit-result\" textWrap=\"true\" [text]=\"item.confidence | number\"></Label>\r\n        </GridLayout>\r\n      </ng-template>\r\n    </ListView>\r\n  </GridLayout>\r\n\r\n  <GridLayout rows=\"auto\" columns=\"auto, auto\" horizontalAlignment=\"right\" class=\"m-t-4 m-r-8\">\r\n    <Label col=\"0\" text=\"Torch\" class=\"c-white\" [class.disabled]=\"!torchOn\"></Label>\r\n    <Switch col=\"1\" [checked]=\"torchOn\" (checkedChange)=\"toggleTorch($event)\"></Switch>\r\n  </GridLayout>\r\n\r\n</GridLayout>\r\n"

/***/ }),

/***/ "./tabs/mlkit/custommodel/custommodel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomModelComponent", function() { return CustomModelComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./tabs/mlkit/abstract.mlkitview.component.ts");


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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "mlkit-custommodel",
            /*duleId: module.i*/
            template: __webpack_require__("./tabs/mlkit/custommodel/custommodel.component.html"),
        })
    ], CustomModelComponent);
    return CustomModelComponent;
}(_tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__["AbstractMLKitViewComponent"]));



/***/ }),

/***/ "./tabs/mlkit/facedetection/facedetection.component.html":
/***/ (function(module, exports) {

module.exports = "<ActionBar class=\"action-bar\">\r\n  <Label class=\"action-bar-title\" text=\"Face detection\"></Label>\r\n</ActionBar>\r\n\r\n<GridLayout rows=\"6/8*, 2/8*\">\r\n  <GridLayout row=\"0\">\r\n    <MLKitFaceDetection\r\n        width=\"100%\"\r\n        height=\"100%\"\r\n        processEveryNthFrame=\"30\"\r\n        enableFaceTracking=\"true\"\r\n        minimumFaceSize=\"0.2\"\r\n        preferFrontCamera=\"true\"\r\n        modeType=\"accurate\"\r\n        (scanResult)=\"onFaceDetectionResult($event)\">\r\n    </MLKitFaceDetection>\r\n\r\n    <GridLayout rows=\"*, 250, *\" columns=\"*, 5/6*, *\">\r\n      <Label class=\"mask\" row=\"0\" col=\"0\" colSpan=\"3\"></Label>\r\n      <Label class=\"mask\" row=\"2\" col=\"0\" colSpan=\"3\"></Label>\r\n      <Label class=\"mask\" row=\"1\" col=\"0\"></Label>\r\n      <Label class=\"mask\" row=\"1\" col=\"2\"></Label>\r\n      <GridLayout row=\"1\" col=\"1\" rows=\"1/6*, *, 1/6*\" columns=\"1/6*, *, 1/6*\">\r\n        <Label class=\"frame-top-left\" row=\"0\" col=\"0\"></Label>\r\n        <Label class=\"frame-top-right\" row=\"0\" col=\"2\"></Label>\r\n        <Label class=\"frame-bottom-left\" row=\"2\" col=\"0\"></Label>\r\n        <Label class=\"frame-bottom-right\" row=\"2\" col=\"2\"></Label>\r\n        <StackLayout class=\"swing\" row=\"0\" col=\"0\" colSpan=\"3\">\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.1)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.2)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.3)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.4)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.5)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.6)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.7)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.8)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.9)\"></Label>\r\n          <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 1)\"></Label>\r\n        </StackLayout>\r\n      </GridLayout>\r\n      <Label row=\"0\" col=\"1\" class=\"text-center c-white\" textWrap=\"true\" color=\"white\" verticalAlignment=\"center\" text=\"The scanner has been configured to detect faces every 30th frame (default is 10). You can tweak this in your usage of the plugin.\"></Label>\r\n      <StackLayout row=\"2\" col=\"0\" colSpan=\"3\">\r\n        <Label [text]=\"mlKitAllOK\" textWrap=\"true\" class=\"m-t-5 c-purple\"></Label>\r\n        <GridLayout row=\"auto\" columns=\"60, *, *, *\" class=\"m-t-5\">\r\n          <Label row=\"0\" col=\"0\" class=\"mlkit-result font-weight-bold\" textWrap=\"true\" text=\"ID\"></Label>\r\n          <Label row=\"0\" col=\"1\" class=\"mlkit-result font-weight-bold\" textWrap=\"true\" text=\"Smiling\"></Label>\r\n          <Label row=\"0\" col=\"2\" class=\"mlkit-result font-weight-bold\" textWrap=\"true\" text=\"Left 👁 open\"></Label>\r\n          <Label row=\"0\" col=\"3\" class=\"mlkit-result font-weight-bold\" textWrap=\"true\" text=\"Right 👁 open\"></Label>\r\n        </GridLayout>\r\n      </StackLayout>\r\n    </GridLayout>\r\n  </GridLayout>\r\n\r\n  <ListView backgroundColor=\"black\" row=\"1\" [items]=\"faces\">\r\n    <ng-template let-item=\"item\">\r\n      <GridLayout columns=\"50, *, *, *\">\r\n        <Label col=\"0\" class=\"mlkit-result c-white\" [text]=\"item.trackingId\" textWrap=\"true\"></Label>\r\n        <Label col=\"1\" class=\"mlkit-result c-white\" [class.c-purple]=\"item.smilingProbability > 0.7\" [text]=\"item.smilingProbability | number\" textWrap=\"true\"></Label>\r\n        <Label col=\"2\" class=\"mlkit-result c-white\" [class.c-purple]=\"item.leftEyeOpenProbability > 0.7\" [text]=\"item.leftEyeOpenProbability | number\" textWrap=\"true\"></Label>\r\n        <Label col=\"3\" class=\"mlkit-result c-white\" [class.c-purple]=\"item.rightEyeOpenProbability > 0.7\" [text]=\"item.rightEyeOpenProbability | number\" textWrap=\"true\"></Label>\r\n      </GridLayout>\r\n    </ng-template>\r\n  </ListView>\r\n\r\n  <!-- not needed; we're using the front camera ;) -->\r\n  <!--<GridLayout rows=\"auto\" columns=\"auto, auto\" horizontalAlignment=\"right\" class=\"m-t-4 m-r-8\">-->\r\n    <!--<Label col=\"0\" text=\"Torch\" class=\"c-white\" [class.disabled]=\"!torchOn\"></Label>-->\r\n    <!--<Switch col=\"1\" [checked]=\"torchOn\" (checkedChange)=\"toggleTorch($event)\"></Switch>-->\r\n  <!--</GridLayout>-->\r\n\r\n</GridLayout>\r\n"

/***/ }),

/***/ "./tabs/mlkit/facedetection/facedetection.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FaceDetectionComponent", function() { return FaceDetectionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./tabs/mlkit/abstract.mlkitview.component.ts");


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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "mlkit-facedetection",
            /*duleId: module.i*/
            template: __webpack_require__("./tabs/mlkit/facedetection/facedetection.component.html"),
        })
    ], FaceDetectionComponent);
    return FaceDetectionComponent;
}(_tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__["AbstractMLKitViewComponent"]));



/***/ }),

/***/ "./tabs/mlkit/imagelabeling/imagelabeling.component.html":
/***/ (function(module, exports) {

module.exports = "<ActionBar class=\"action-bar\">\r\n  <Label class=\"action-bar-title\" text=\"Image labeling\"></Label>\r\n</ActionBar>\r\n\r\n<GridLayout>\r\n  <MLKitImageLabeling\r\n      width=\"100%\"\r\n      height=\"100%\"\r\n      confidenceThreshold=\"0.6\"\r\n      (scanResult)=\"onImageLabelingResult($event)\">\r\n  </MLKitImageLabeling>\r\n\r\n  <GridLayout rows=\"*, 320, *\" columns=\"*, 5/6*, *\">\r\n    <Label class=\"mask\" row=\"0\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"2\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"0\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"2\"></Label>\r\n    <GridLayout row=\"1\" col=\"1\" rows=\"1/6*, *, 1/6*\" columns=\"1/6*, *, 1/6*\">\r\n      <Label class=\"frame-top-left\" row=\"0\" col=\"0\"></Label>\r\n      <Label class=\"frame-top-right\" row=\"0\" col=\"2\"></Label>\r\n      <Label class=\"frame-bottom-left\" row=\"2\" col=\"0\"></Label>\r\n      <Label class=\"frame-bottom-right\" row=\"2\" col=\"2\"></Label>\r\n      <StackLayout class=\"swing\" row=\"0\" col=\"0\" colSpan=\"3\">\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.1)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.2)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.3)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.4)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.5)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.6)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.7)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.8)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.9)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 1)\"></Label>\r\n      </StackLayout>\r\n    </GridLayout>\r\n    <ListView separatorColor=\"transparent\" row=\"0\" rowSpan=\"3\" col=\"0\" colSpan=\"3\" [items]=\"labels\" class=\"m-t-20\" backgroundColor=\"transparent\">\r\n      <ng-template let-item=\"item\">\r\n        <GridLayout columns=\"3*, 2*\">\r\n          <Label col=\"0\" class=\"mlkit-result\" textWrap=\"true\" [text]=\"item.text\"></Label>\r\n          <Label col=\"1\" class=\"mlkit-result\" textWrap=\"true\" [text]=\"item.confidence | number\"></Label>\r\n        </GridLayout>\r\n      </ng-template>\r\n    </ListView>\r\n  </GridLayout>\r\n\r\n  <GridLayout rows=\"auto\" columns=\"auto, auto\" horizontalAlignment=\"right\" class=\"m-t-4 m-r-8\">\r\n    <Label col=\"0\" text=\"Torch\" class=\"c-white\" [class.disabled]=\"!torchOn\"></Label>\r\n    <Switch col=\"1\" [checked]=\"torchOn\" (checkedChange)=\"toggleTorch($event)\"></Switch>\r\n  </GridLayout>\r\n\r\n</GridLayout>\r\n"

/***/ }),

/***/ "./tabs/mlkit/imagelabeling/imagelabeling.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageLabelingComponent", function() { return ImageLabelingComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./tabs/mlkit/abstract.mlkitview.component.ts");


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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "mlkit-imagelabeling",
            /*duleId: module.i*/
            template: __webpack_require__("./tabs/mlkit/imagelabeling/imagelabeling.component.html"),
        }),
        __metadata("design:paramtypes", [])
    ], ImageLabelingComponent);
    return ImageLabelingComponent;
}(_tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__["AbstractMLKitViewComponent"]));



/***/ }),

/***/ "./tabs/mlkit/mlkit.component.css":
/***/ (function(module, exports) {

module.exports = ".button {\r\n    margin:0 0 15px 0;\r\n    background:#de411b;\r\n    color:#fff;\r\n}"

/***/ }),

/***/ "./tabs/mlkit/mlkit.component.html":
/***/ (function(module, exports) {

module.exports = "<GridLayout rows=\"auto, auto, *, auto\" class=\"tab-content\">\r\n\r\n  <FlexboxLayout row=\"1\" flexDirection=\"row\" justifyContent=\"space-around\">\r\n    <Button text=\"Images\" textWrap=\"true\" (tap)=\"fromAppFolder()\" class=\"button\"></Button>\r\n    <Button text=\"Cam roll\" textWrap=\"true\" (tap)=\"fromCameraRoll()\" class=\"button\"></Button>\r\n    <!-- the image may require rotation on Android, and permission may be required - not feeling like exposing this for now -->\r\n    <iOS>\r\n      <Button text=\"Cam pic\" textWrap=\"true\" (tap)=\"fromCameraPicture()\" class=\"button\"></Button>\r\n    </iOS>\r\n    <Button text=\"Cam feed\" textWrap=\"true\" (tap)=\"fromCameraFeed()\" class=\"button\"></Button>\r\n  </FlexboxLayout>\r\n  <DockLayout>\r\n      <Image *ngFor=\"let pickedImage of pickedImages;\" [width]=\"100\" [src]=\"pickedImage\" (tap)=\"reusePickedImage(pickedImage)\"></Image>\r\n  </DockLayout>\r\n\r\n</GridLayout>\r\n"

/***/ }),

/***/ "./tabs/mlkit/mlkit.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MLKitComponent", function() { return MLKitComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-angular/index.js");
/* harmony import */ var nativescript_angular__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var nativescript_camera__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../node_modules/nativescript-camera/camera.js");
/* harmony import */ var nativescript_camera__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nativescript_camera__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var nativescript_imagepicker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../node_modules/nativescript-imagepicker/imagepicker.js");
/* harmony import */ var nativescript_imagepicker__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nativescript_imagepicker__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var nativescript_plugin_firebase_mlkit_barcodescanning__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/barcodescanning/index.js");
/* harmony import */ var nativescript_plugin_firebase_mlkit_barcodescanning__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(nativescript_plugin_firebase_mlkit_barcodescanning__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var tns_core_modules_file_system__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../node_modules/tns-core-modules/file-system/file-system.js");
/* harmony import */ var tns_core_modules_file_system__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_file_system__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var tns_core_modules_image_source__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../node_modules/tns-core-modules/image-source/image-source.js");
/* harmony import */ var tns_core_modules_image_source__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_image_source__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../node_modules/tns-core-modules/platform/platform.js");
/* harmony import */ var tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var tns_core_modules_ui_dialogs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../node_modules/tns-core-modules/ui/dialogs/dialogs.js");
/* harmony import */ var tns_core_modules_ui_dialogs__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(tns_core_modules_ui_dialogs__WEBPACK_IMPORTED_MODULE_8__);









var firebase = __webpack_require__("../node_modules/nativescript-plugin-firebase/firebase.js");
var MLKitComponent = /** @class */ (function () {
    function MLKitComponent(routerExtensions, zone) {
        this.routerExtensions = routerExtensions;
        this.zone = zone;
        this.pickedImages = [];
        this.mlkitFeatures = [
            "Text recognition (on device)",
            "Text recognition (cloud)",
            "Barcode scanning (on device)",
            "Face detection (on device)",
            "Image labeling (on device)",
            "Image labeling (cloud)",
            "Custom model",
            "Landmark recognition (cloud)"
        ];
        this.mlkitOnDeviceFeatures = [
            "Text recognition",
            "Barcode scanning",
            "Face detection",
            "Image labeling",
            "Custom model"
        ];
    }
    MLKitComponent.prototype.fromCameraFeed = function () {
        var _this = this;
        Object(tns_core_modules_ui_dialogs__WEBPACK_IMPORTED_MODULE_8__["action"])("Test which on-device ML Kit feature?", "Cancel", this.mlkitOnDeviceFeatures).then(function (pickedItem) {
            var to;
            if (pickedItem === "Text recognition") {
                to = "/tabs/mlkit/textrecognition";
            }
            else if (pickedItem === "Barcode scanning") {
                to = "/tabs/mlkit/barcodescanning";
            }
            else if (pickedItem === "Face detection") {
                to = "/tabs/mlkit/facedetection";
            }
            else if (pickedItem === "Image labeling") {
                to = "/tabs/mlkit/imagelabeling";
            }
            else if (pickedItem === "Custom model") {
                to = "/tabs/mlkit/custommodel";
            }
            if (to !== undefined) {
                _this.routerExtensions.navigate([to], {
                    animated: true,
                    transition: {
                        name: "slide",
                        duration: 250,
                        curve: "ease"
                    }
                });
            }
        });
    };
    MLKitComponent.prototype.fromAppFolder = function () {
        var images = [
            "/images/puppy.jpg",
            "/images/donut.jpg",
            "/images/cat.jpg",
            "/images/car.jpg",
        ];
        for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
            var image = images_1[_i];
            var folder = tns_core_modules_file_system__WEBPACK_IMPORTED_MODULE_5__["knownFolders"].currentApp();
            var path = tns_core_modules_file_system__WEBPACK_IMPORTED_MODULE_5__["path"].join(folder.path, image);
            var exists = tns_core_modules_file_system__WEBPACK_IMPORTED_MODULE_5__["File"].exists(path);
            if (exists) {
                var imageSource = Object(tns_core_modules_image_source__WEBPACK_IMPORTED_MODULE_6__["fromFile"])(path);
                this.pickedImages.push(imageSource);
            }
        }
    };
    MLKitComponent.prototype.fromCameraPicture = function () {
        var _this = this;
        if (!tns_core_modules_platform__WEBPACK_IMPORTED_MODULE_7__["isIOS"]) {
            nativescript_camera__WEBPACK_IMPORTED_MODULE_2__["requestPermissions"]();
        }
        nativescript_camera__WEBPACK_IMPORTED_MODULE_2__["takePicture"]({
            width: 600,
            height: 600,
            keepAspectRatio: true,
            saveToGallery: true,
            cameraFacing: "rear"
        }).then(function (imageAsset) {
            new tns_core_modules_image_source__WEBPACK_IMPORTED_MODULE_6__["ImageSource"]().fromAsset(imageAsset).then(function (imageSource) {
                _this.pickedImage = imageSource;
                // give the user some time to to see the picture
                setTimeout(function () { return _this.selectMLKitFeature(imageSource); }, 500);
            });
        });
    };
    MLKitComponent.prototype.fromCameraRoll = function () {
        var _this = this;
        var imagePicker = nativescript_imagepicker__WEBPACK_IMPORTED_MODULE_3__["create"]({
            mode: "single"
        });
        imagePicker
            .authorize()
            .then(function () { return imagePicker.present(); })
            .then(function (selection) {
            if (selection.length === 0)
                return;
            var selected = selection[0];
            selected.options.height = 600;
            selected.options.width = 600;
            selected.options.keepAspectRatio = true;
            selected.getImageAsync(function (image, error) {
                if (error) {
                    console.log("Error getting image source from picker: " + error);
                    return;
                }
                if (!image) {
                    alert({
                        title: "Invalid image",
                        message: "Perhaps this is an image from cloud storage?",
                        okButtonText: "Hmm.."
                    });
                    return;
                }
                var imageSource = new tns_core_modules_image_source__WEBPACK_IMPORTED_MODULE_6__["ImageSource"]();
                imageSource.setNativeSource(image);
                _this.zone.run(function () {
                    _this.pickedImage = imageSource;
                });
                // give the user some time to to see the picture
                setTimeout(function () { return _this.selectMLKitFeature(imageSource); }, 500);
            });
        })
            .catch(function (e) {
            console.log("Image Picker error: " + e);
        });
    };
    MLKitComponent.prototype.reusePickedImage = function (pickedImage) {
        if (pickedImage) {
            this.selectMLKitFeature(pickedImage);
        }
    };
    MLKitComponent.prototype.selectMLKitFeature = function (imageSource) {
        var _this = this;
        Object(tns_core_modules_ui_dialogs__WEBPACK_IMPORTED_MODULE_8__["action"])("Use which ML Kit feature?", "Cancel", this.mlkitFeatures).then(function (pickedItem) {
            var pickedItemIndex = _this.mlkitFeatures.indexOf(pickedItem);
            if (pickedItem === "Text recognition (on device)") {
                _this.recognizeTextOnDevice(imageSource);
            }
            else if (pickedItem === "Text recognition (cloud)") {
                _this.recognizeTextCloud(imageSource);
            }
            else if (pickedItem === "Barcode scanning (on device)") {
                _this.scanBarcodeOnDevice(imageSource);
            }
            else if (pickedItem === "Face detection (on device)") {
                _this.detectFacesOnDevice(imageSource);
            }
            else if (pickedItem === "Image labeling (on device)") {
                _this.labelImageOnDevice(imageSource);
            }
            else if (pickedItem === "Image labeling (cloud)") {
                _this.labelImageCloud(imageSource);
            }
            else if (pickedItem === "Landmark recognition (cloud)") {
                _this.recognizeLandmarkCloud(imageSource);
            }
            else if (pickedItem === "Custom model") {
                _this.customModel(imageSource);
            }
        });
    };
    MLKitComponent.prototype.recognizeTextOnDevice = function (imageSource) {
        firebase.mlkit.textrecognition.recognizeTextOnDevice({
            image: imageSource
        }).then(function (result) {
            console.log("recognizeTextOnDevice result: " + JSON.stringify(result));
            alert({
                title: "Result",
                message: result.text ? result.text : "",
                okButtonText: "OK"
            });
        }).catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.recognizeTextCloud = function (imageSource) {
        firebase.mlkit.textrecognition.recognizeTextCloud({
            image: imageSource,
            modelType: "latest",
            maxResults: 15
        }).then(function (result) {
            console.log("recognizeTextCloud result: " + JSON.stringify(result));
            alert({
                title: "Result",
                message: result.text ? result.text : "",
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.recognizeLandmarkCloud = function (imageSource) {
        firebase.mlkit.landmarkrecognition.recognizeLandmarksCloud({
            image: imageSource,
            maxResults: 8
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.landmarks),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.customModel = function (imageSource) {
        firebase.mlkit.custommodel.useCustomModel({
            image: imageSource,
            // note that only local quant models work currently (so not 'float' models, and not loaded from the cloud)
            // cloudModelName: "~/mobilenet_quant_v2_1_0_299",
            // cloudModelName: "~/inception_v3_quant",
            // note that there's an issue with this model (making the app crash): "ValueError: Model provided has model identifier 'Mobi', should be 'TFL3'" (reported by https://github.com/EddyVerbruggen/ns-mlkit-tflite-curated/blob/master/scripts/get_model_details.py)
            // localModelFile: "~/custommodel/nutella/nutella_quantize.tflite",
            // labelsFile: "~/custommodel/nutella/nutella_labels.txt",
            // localModelFile: "~/custommodel/mobilenet/mobilenet_quant_v2_1.0_299.tflite",
            // labelsFile: "~/custommodel/mobilenet/mobilenet_labels.txt",
            localModelFile: "~/custommodel/inception/inception_v3_quant.tflite",
            labelsFile: "~/custommodel/inception/inception_labels.txt",
            maxResults: 5,
            modelInput: [{
                    // shape: [1, 224, 224, 3], // flowers / nutella
                    shape: [1, 299, 299, 3],
                    type: "QUANT" // the only currently supported type of model
                }],
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.result),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.scanBarcodeOnDevice = function (imageSource) {
        console.log(">>> imageSource.rotationAngle: " + imageSource.rotationAngle);
        firebase.mlkit.barcodescanning.scanBarcodesOnDevice({
            image: imageSource,
            formats: [nativescript_plugin_firebase_mlkit_barcodescanning__WEBPACK_IMPORTED_MODULE_4__["BarcodeFormat"].QR_CODE, nativescript_plugin_firebase_mlkit_barcodescanning__WEBPACK_IMPORTED_MODULE_4__["BarcodeFormat"].EAN_13]
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.barcodes),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.detectFacesOnDevice = function (imageSource) {
        firebase.mlkit.facedetection.detectFacesOnDevice({
            image: imageSource,
            detectionMode: "accurate",
            enableFaceTracking: false,
            minimumFaceSize: 0.25
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.faces),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent.prototype.labelImageOnDevice = function (imageSource) {
        firebase.mlkit.imagelabeling.labelImageOnDevice({
            image: imageSource,
            confidenceThreshold: 0.3
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.labels),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    /*
    private customModelOnDevice(imageSource: ImageSource): void {
      console.log("customModelOnDevice");
      firebase.mlkit.custommodel.useCustomModel({
        image: imageSource
      }).then(
          (result: MLKitCustomModelResult) => {
            alert({
              title: `Result`,
              message: JSON.stringify(result.result),
              okButtonText: "OK"
            });
          })
          .catch(errorMessage => console.log("ML Kit error: " + errorMessage));
    }
    */
    MLKitComponent.prototype.labelImageCloud = function (imageSource) {
        firebase.mlkit.imagelabeling.labelImageCloud({
            image: imageSource,
            modelType: "stable",
            maxResults: 5
        }).then(function (result) {
            alert({
                title: "Result",
                message: JSON.stringify(result.labels),
                okButtonText: "OK"
            });
        })
            .catch(function (errorMessage) { return console.log("ML Kit error: " + errorMessage); });
    };
    MLKitComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "mlkit",
            /*duleId: module.i*/
            template: __webpack_require__("./tabs/mlkit/mlkit.component.html"),
            styles: [__webpack_require__("./tabs/mlkit/mlkit.component.css")],
        }),
        __metadata("design:paramtypes", [nativescript_angular__WEBPACK_IMPORTED_MODULE_1__["RouterExtensions"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]])
    ], MLKitComponent);
    return MLKitComponent;
}());



/***/ }),

/***/ "./tabs/mlkit/textrecognition/textrecognition.component.html":
/***/ (function(module, exports) {

module.exports = "<ActionBar class=\"action-bar\">\r\n  <Label class=\"action-bar-title\" text=\"Text recognition\"></Label>\r\n</ActionBar>\r\n\r\n<GridLayout>\r\n  <MLKitTextRecognition\r\n      width=\"100%\"\r\n      height=\"100%\"\r\n      [torchOn]=\"torchOn\"\r\n      (scanResult)=\"onTextRecognitionResult($event)\">\r\n  </MLKitTextRecognition>\r\n\r\n  <GridLayout rows=\"*, 320, *\" columns=\"*, 5/6*, *\">\r\n    <Label class=\"mask\" row=\"0\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"2\" col=\"0\" colSpan=\"3\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"0\"></Label>\r\n    <Label class=\"mask\" row=\"1\" col=\"2\"></Label>\r\n    <GridLayout row=\"1\" col=\"1\" rows=\"1/6*, *, 1/6*\" columns=\"1/6*, *, 1/6*\">\r\n      <Label class=\"frame-top-left\" row=\"0\" col=\"0\"></Label>\r\n      <Label class=\"frame-top-right\" row=\"0\" col=\"2\"></Label>\r\n      <Label class=\"frame-bottom-left\" row=\"2\" col=\"0\"></Label>\r\n      <Label class=\"frame-bottom-right\" row=\"2\" col=\"2\"></Label>\r\n      <StackLayout class=\"swing\" row=\"0\" col=\"0\" colSpan=\"3\">\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.1)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.2)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.3)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.4)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.5)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.6)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.7)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.8)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 0.9)\"></Label>\r\n        <Label height=\"1\" marginBottom=\"1\" borderBottomWidth=\"1\" borderColor=\"rgba(81, 184, 237, 1)\"></Label>\r\n      </StackLayout>\r\n    </GridLayout>\r\n    <ListView separatorColor=\"transparent\" row=\"0\" rowSpan=\"3\" col=\"0\" colSpan=\"3\" [items]=\"blocks\" class=\"m-t-20\" backgroundColor=\"transparent\">\r\n      <ng-template let-item=\"item\">\r\n        <Label class=\"mlkit-result\" textWrap=\"true\" [text]=\"item.text\"></Label>\r\n      </ng-template>\r\n    </ListView>\r\n  </GridLayout>\r\n\r\n  <GridLayout rows=\"auto\" columns=\"auto, auto\" horizontalAlignment=\"right\" class=\"m-t-4 m-r-8\">\r\n    <Label col=\"0\" text=\"Torch\" class=\"c-white\" [class.disabled]=\"!torchOn\"></Label>\r\n    <Switch col=\"1\" [checked]=\"torchOn\" (checkedChange)=\"toggleTorch($event)\"></Switch>\r\n  </GridLayout>\r\n\r\n</GridLayout>\r\n"

/***/ }),

/***/ "./tabs/mlkit/textrecognition/textrecognition.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextRecognitionComponent", function() { return TextRecognitionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./tabs/mlkit/abstract.mlkitview.component.ts");


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
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "mlkit-textrecognition",
            /*duleId: module.i*/
            template: __webpack_require__("./tabs/mlkit/textrecognition/textrecognition.component.html"),
        })
    ], TextRecognitionComponent);
    return TextRecognitionComponent;
}(_tabs_mlkit_abstract_mlkitview_component__WEBPACK_IMPORTED_MODULE_1__["AbstractMLKitViewComponent"]));



/***/ }),

/***/ "./tabs/tabs-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsRoutingModule", function() { return TabsRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-angular/router/index.js");
/* harmony import */ var nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tabs_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./tabs/tabs.component.ts");
/* harmony import */ var _tabs_mlkit_textrecognition_textrecognition_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./tabs/mlkit/textrecognition/textrecognition.component.ts");
/* harmony import */ var _tabs_mlkit_barcodescanning_barcodescanning_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./tabs/mlkit/barcodescanning/barcodescanning.component.ts");
/* harmony import */ var _tabs_mlkit_facedetection_facedetection_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./tabs/mlkit/facedetection/facedetection.component.ts");
/* harmony import */ var _tabs_mlkit_imagelabeling_imagelabeling_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./tabs/mlkit/imagelabeling/imagelabeling.component.ts");
/* harmony import */ var _tabs_mlkit_custommodel_custommodel_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./tabs/mlkit/custommodel/custommodel.component.ts");








var routes = [
    { path: "", component: _tabs_component__WEBPACK_IMPORTED_MODULE_2__["TabsComponent"] },
    { path: "mlkit/textrecognition", component: _tabs_mlkit_textrecognition_textrecognition_component__WEBPACK_IMPORTED_MODULE_3__["TextRecognitionComponent"] },
    { path: "mlkit/barcodescanning", component: _tabs_mlkit_barcodescanning_barcodescanning_component__WEBPACK_IMPORTED_MODULE_4__["BarcodeScanningComponent"] },
    { path: "mlkit/facedetection", component: _tabs_mlkit_facedetection_facedetection_component__WEBPACK_IMPORTED_MODULE_5__["FaceDetectionComponent"] },
    { path: "mlkit/imagelabeling", component: _tabs_mlkit_imagelabeling_imagelabeling_component__WEBPACK_IMPORTED_MODULE_6__["ImageLabelingComponent"] },
    { path: "mlkit/custommodel", component: _tabs_mlkit_custommodel_custommodel_component__WEBPACK_IMPORTED_MODULE_7__["CustomModelComponent"] }
];
var TabsRoutingModule = /** @class */ (function () {
    function TabsRoutingModule() {
    }
    TabsRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__["NativeScriptRouterModule"].forChild(routes)],
            exports: [nativescript_angular_router__WEBPACK_IMPORTED_MODULE_1__["NativeScriptRouterModule"]]
        })
    ], TabsRoutingModule);
    return TabsRoutingModule;
}());



/***/ }),

/***/ "./tabs/tabs.component.css":
/***/ (function(module, exports) {

module.exports = ".application-content{\r\n    padding:15px;\r\n}\r\n.application-content Image{\r\n    width:90%;\r\n    margin:15px 0;\r\n}"

/***/ }),

/***/ "./tabs/tabs.component.html":
/***/ (function(module, exports) {

module.exports = "<ActionBar [title]=\"title\"></ActionBar>\r\n<StackLayout class=\"application-content\" [row]=\"1\">\r\n    <Image src=\"https://www.endava.com/-/media/EndavaDigital/Endava/Images/MetaDataImages/preview-image.ashx\"></Image>\r\n    <mlkit></mlkit>\r\n</StackLayout>\r\n"

/***/ }),

/***/ "./tabs/tabs.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsComponent", function() { return TabsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");

var TabsComponent = /** @class */ (function () {
    function TabsComponent() {
        this._title = 'Endava Angular ML App';
    }
    TabsComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(TabsComponent.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            if (this._title !== value) {
                this._title = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    TabsComponent.prototype.onSelectedIndexChanged = function (args) {
        var tabView = args.object;
        var selectedTabViewItem = tabView.items[args.newIndex];
        this.title = selectedTabViewItem.title;
    };
    TabsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: "TabsComponent",
            /*duleId: module.i*/
            template: __webpack_require__("./tabs/tabs.component.html"),
            styles: [__webpack_require__("./tabs/tabs.component.css")],
        }),
        __metadata("design:paramtypes", [])
    ], TabsComponent);
    return TabsComponent;
}());



/***/ }),

/***/ "./tabs/tabs.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabsModule", function() { return TabsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var nativescript_angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../node_modules/nativescript-angular/common.js");
/* harmony import */ var nativescript_angular_common__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular_common__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mlkit_mlkit_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./tabs/mlkit/mlkit.component.ts");
/* harmony import */ var _tabs_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./tabs/tabs-routing.module.ts");
/* harmony import */ var _tabs_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./tabs/tabs.component.ts");
/* harmony import */ var _tabs_mlkit_textrecognition_textrecognition_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./tabs/mlkit/textrecognition/textrecognition.component.ts");
/* harmony import */ var _tabs_mlkit_barcodescanning_barcodescanning_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("./tabs/mlkit/barcodescanning/barcodescanning.component.ts");
/* harmony import */ var _tabs_mlkit_facedetection_facedetection_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("./tabs/mlkit/facedetection/facedetection.component.ts");
/* harmony import */ var _tabs_mlkit_imagelabeling_imagelabeling_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("./tabs/mlkit/imagelabeling/imagelabeling.component.ts");
/* harmony import */ var _tabs_mlkit_custommodel_custommodel_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./tabs/mlkit/custommodel/custommodel.component.ts");
/* harmony import */ var nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../node_modules/nativescript-angular/element-registry.js");
/* harmony import */ var nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10__);











Object(nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10__["registerElement"])("MLKitBarcodeScanner", function () { return __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/barcodescanning/index.js").MLKitBarcodeScanner; });
Object(nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10__["registerElement"])("MLKitFaceDetection", function () { return __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/facedetection/index.js").MLKitFaceDetection; });
Object(nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10__["registerElement"])("MLKitTextRecognition", function () { return __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/textrecognition/index.js").MLKitTextRecognition; });
Object(nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10__["registerElement"])("MLKitImageLabeling", function () { return __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/imagelabeling/index.js").MLKitImageLabeling; });
Object(nativescript_angular_element_registry__WEBPACK_IMPORTED_MODULE_10__["registerElement"])("MLKitCustomModel", function () { return __webpack_require__("../node_modules/nativescript-plugin-firebase/mlkit/custommodel/index.js").MLKitCustomModel; });
var TabsModule = /** @class */ (function () {
    function TabsModule() {
    }
    TabsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                nativescript_angular_common__WEBPACK_IMPORTED_MODULE_1__["NativeScriptCommonModule"],
                _tabs_routing_module__WEBPACK_IMPORTED_MODULE_3__["TabsRoutingModule"]
            ],
            declarations: [
                _tabs_mlkit_barcodescanning_barcodescanning_component__WEBPACK_IMPORTED_MODULE_6__["BarcodeScanningComponent"],
                _tabs_mlkit_facedetection_facedetection_component__WEBPACK_IMPORTED_MODULE_7__["FaceDetectionComponent"],
                _tabs_mlkit_imagelabeling_imagelabeling_component__WEBPACK_IMPORTED_MODULE_8__["ImageLabelingComponent"],
                _mlkit_mlkit_component__WEBPACK_IMPORTED_MODULE_2__["MLKitComponent"],
                _tabs_component__WEBPACK_IMPORTED_MODULE_4__["TabsComponent"],
                _tabs_mlkit_textrecognition_textrecognition_component__WEBPACK_IMPORTED_MODULE_5__["TextRecognitionComponent"],
                _tabs_mlkit_custommodel_custommodel_component__WEBPACK_IMPORTED_MODULE_9__["CustomModelComponent"]
            ],
            schemas: [
                _angular_core__WEBPACK_IMPORTED_MODULE_0__["NO_ERRORS_SCHEMA"]
            ]
        })
    ], TabsModule);
    return TabsModule;
}());



/***/ })

}]);