const CutImg = require('../index.js');
const webCacheImg = require('@/images/web-cache.jpg');

let params = {
  file: webCacheImg,
  max: 20
}
test('cut img', () => {
  expect(CutImg(1 , 2)).toBe(3);
})


// test('test 2 plus 2 should equal 4', () => {
//   expect(sum(2 , 2)).toBe(4);
// })