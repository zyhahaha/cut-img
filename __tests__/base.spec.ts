import CutImg from '../index';
// const webCacheImg = require('./web-cache.jpg');

// let params = {
//   file: webCacheImg,
//   max: 20
// }
let cutImg = new CutImg();
test('isImage', () => {
  expect(cutImg.isImage('image/jpeg')).toBe(true);
})

// test('isImage', () => {
//   expect(cutImg.getPhotoOrientation(webCacheImg)).toBe(1);
// })


// test('test 2 plus 2 should equal 4', () => {
//   expect(sum(2 , 2)).toBe(4);
// })