module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    "**/__tests__/**/*.(js|ts)?(x)",
    "**/?(*.)(spec|test).(js|ts)?(x)"
  ],
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}