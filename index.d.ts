interface IDrawData {
  file: Blob,
  max: number
}

interface ICutImgStatic {
  cut(data: IDrawData, next: Function): any
}

declare var CutImg: ICutImgStatic;
export = CutImg;
