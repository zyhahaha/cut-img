"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
// const webCacheImg = import('@/images/web-cache.jpg');
// let params = {
//   file: webCacheImg,
//   max: 20
// }
let cutImg = new index_1.default();
test('isImage', () => {
    expect(cutImg.isImage('image/jpeg')).toBe(true);
});
// test('test 2 plus 2 should equal 4', () => {
//   expect(sum(2 , 2)).toBe(4);
// })
