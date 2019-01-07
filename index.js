"use strict";
// eg:
// let url = '/api/private_barcode_tmpl_image/upload';
// let file = {}; // 文件对象
// var fileData = {
//   file: file,
//   max: 140,
//   url: url
// };
// this.ImgUploadService.draw(fileData, function(res){
exports.__esModule = true;
// })
var EXIF = require("exif-js");
/**
 * 裁剪图片
 * @param data = {
 *  file: file,
 *  max: 123,
 * }
 */
var ImgUploadService = /** @class */ (function () {
    function ImgUploadService(Upload) {
        // this.Upload = Upload;
    }
    ;
    //获取图片方向
    ImgUploadService.prototype.getPhotoOrientation = function (img, next) {
        var _this = this;
        var orient = 1;
        // next(orient);
        EXIF.getData(img, function () {
            orient = EXIF.getTag(_this, 'Orientation');
            next(orient);
        });
    };
    ImgUploadService.prototype.draw = function (data, next, id) {
        var that = this;
        var canvas, file = data.file, max = data.max;
        var context, img;
        if (that.isImage(file.type)) {
            img = new Image();
            img.src = that.getObjectURL(file);
            img.onload = function () {
                that.getPhotoOrientation(img, function (orient) {
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
                        canvas = document.getElementById(id);
                    }
                    else {
                        canvas = document.createElement('canvas');
                    }
                    if (orient === 6) {
                        canvas.setAttribute('width', maxHeight);
                        canvas.setAttribute('height', maxWidth);
                    }
                    else {
                        canvas.setAttribute('width', maxWidth);
                        canvas.setAttribute('height', maxHeight);
                    }
                    context = canvas.getContext('2d');
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
                    var blob = that.dataURItoBlob(strDataURI);
                    // data.file = blob;
                    next(blob);
                });
            };
        }
    };
    ImgUploadService.prototype.isImage = function (type) {
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
    ImgUploadService.prototype.getObjectURL = function (file) {
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
    ImgUploadService.prototype.dataURItoBlob = function (dataURI) {
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
        // var bb = new BlobBuilder();
        // bb.append(ab);
        // return bb.getBlob(mimeString);
    };
    return ImgUploadService;
}());
exports["default"] = ImgUploadService;
