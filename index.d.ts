interface IDrawData {
  file: Blob,
  max: number
}

interface ICutImgStatic {
  cut(data: IDrawData, next: Function): any,
  isImage(type: string): boolean,
}

declare var CutImg: ICutImgStatic;
export = CutImg;
