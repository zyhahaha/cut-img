"use strict";
/**
 * eg:
 * let file = {}; // Blob
 * let fileData = {
 *  file: file,
 *  max: 140,
 * };
 * this.CutImg.cut(fileData, function(res){})
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EXIF = __importStar(require("exif-js"));
;
var CutImg = /** @class */ (function () {
    function CutImg() {
        // this.Upload = Upload;
    }
    ;
    /**
     * cut img
     * @param data = {
     *  file: file,
     *  max: 123,
     * }
    */
    CutImg.prototype.cut = function (data, id) {
        var _this = this;
        var canvas;
        var context;
        var img;
        var file = data.file;
        var max = data.max;
        if (this.isImage(file.type)) {
            return new Promise(function (resolve, reject) {
                img = new Image();
                img.src = _this.getObjectURL(file) || '';
                img.onload = function () {
                    _this.getPhotoOrientation(img).then(function (orient) {
                        var maxWidth = img.width, maxHeight = img.height;
                        if (img.width > img.height) {
                            if (img.width > max) {
                                maxWidth = max;
                                maxHeight = maxWidth / img.width * img.height;
                            }
                        }
                        else {
                            if (img.height > max) {
                                maxHeight = max;
                                maxWidth = maxHeight / img.height * img.width;
                            }
                        }
                        if (id) {
                            // canvas = document.getElementById(id);
                            canvas = document.createElement('canvas');
                        }
                        else {
                            canvas = document.createElement('canvas');
                        }
                        if (orient === 6) {
                            canvas.setAttribute('width', String(maxHeight));
                            canvas.setAttribute('height', String(maxWidth));
                        }
                        else {
                            canvas.setAttribute('width', String(maxWidth));
                            canvas.setAttribute('height', String(maxHeight));
                        }
                        context = canvas.getContext('2d') || context;
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        if (orient === 6) {
                            // context.save();
                            context.translate(maxHeight, 0);
                            context.rotate(90 * Math.PI / 180);
                            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
                            // context.restore();
                        }
                        else {
                            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                        }
                        var strDataURI = canvas.toDataURL(file.type);
                        var blob = _this.dataURItoBlob(strDataURI);
                        // data.file = blob;
                        resolve(blob);
                    });
                };
            });
        }
    };
    CutImg.prototype.isImage = function (type) {
        switch (type) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/bmp':
            case 'image/jpg':
                return true;
            default:
                return false;
        }
    };
    // get direction
    CutImg.prototype.getPhotoOrientation = function (img) {
        var _this = this;
        var orient = 1;
        return new Promise(function (resolve, reject) {
            EXIF.getData(img, function () {
                try {
                    orient = EXIF.getTag(_this, 'Orientation');
                    resolve(orient);
                }
                catch (error) {
                    reject(1);
                }
            });
        });
    };
    CutImg.prototype.getObjectURL = function (file) {
        var url = null;
        if (URL !== undefined) {
            url = URL.createObjectURL(file);
        }
        else if (webkitURL !== undefined) {
            url = webkitURL.createObjectURL(file);
        }
        return url;
    };
    ;
    CutImg.prototype.dataURItoBlob = function (dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], { type: mimeString });
        return blob;
        // Old code
        // let bb = new BlobBuilder();
        // bb.append(ab);
        // return bb.getBlob(mimeString);
    };
    return CutImg;
}());
exports.default = CutImg;
