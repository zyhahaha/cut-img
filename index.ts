/**
 * eg:
 * 
 * let file = {}; // Blob
 * let params = {
 *  file: file,
 *  max: 140,
 * };
 * let cutImg = new CutImg.cut(params).then(res => {
 *   console.log(res);
 * })
 */

import * as EXIF from 'exif-js';

interface IDrawData {
  file: Blob,
  max: number
};

export default class CutImg {
  constructor() {
    // this.Upload = Upload;
  };

  /**
   * cut img
   * @param data = {
   *  file: file,
   *  max: 123,
   * }
  */
  public cut(data: IDrawData) {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let img: HTMLImageElement;
    let file = data.file;
    let max = data.max;
    canvas = document.createElement('canvas');
    if (this.isImage(file.type)) {
      return new Promise((resolve: Function, reject: Function) => {
        img = new Image();
        img.src = this.getObjectURL(file) || '';
        img.onload = () => {
          this.getPhotoOrientation(img).then((orient: number) => {
            let maxWidth = img.width,
              maxHeight = img.height;
            if (img.width > img.height) {
              if (img.width > max) {
                maxWidth = max;
                maxHeight = maxWidth / img.width * img.height;
              }
            } else {
              if (img.height > max) {
                maxHeight = max;
                maxWidth = maxHeight / img.height * img.width;
              }
            }

            if (orient === 6) {
              canvas.setAttribute('width', String(maxHeight));
              canvas.setAttribute('height', String(maxWidth));
            } else {
              canvas.setAttribute('width', String(maxWidth));
              canvas.setAttribute('height', String(maxHeight));
            }
            context = canvas.getContext('2d') || context;
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (orient === 6) {
              context.translate(maxHeight, 0);
              context.rotate(90 * Math.PI / 180);
              context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.height, canvas.width);
            } else {
              context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            }
            let strDataURI = canvas.toDataURL(file.type);
            let blob = this.dataURItoBlob(strDataURI);
            resolve(blob);
          });
        };
      });
    }
  }

  public isImage(type: string) {
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
  }

  // get direction
  public getPhotoOrientation(img: HTMLImageElement): PromiseLike<number> {
    let orient: number = 1;
    return new Promise((resolve: Function, reject: Function) => {
      EXIF.getData(img, () => {
        try {
          orient = EXIF.getTag(this, 'Orientation');
          resolve(orient);
        } catch (error) {
          reject(1);
        }
      });
    })
  }

  public getObjectURL(file: { type: string }) {
    let url = null;
    if (URL !== undefined) {
      url = URL.createObjectURL(file);
    } else if (webkitURL !== undefined) {
      url = webkitURL.createObjectURL(file);
    }
    return url;
  };

  private dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    let blob = new Blob([ab], { type: mimeString });
    return blob;

    // Old code
    // let bb = new BlobBuilder();
    // bb.append(ab);
    // return bb.getBlob(mimeString);
  }
}
