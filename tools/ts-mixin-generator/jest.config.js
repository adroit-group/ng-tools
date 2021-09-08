module.exports = {
  displayName: 'TS mixin generator',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: '../../coverage/tools/ts-mixin-generator',
  snapshotSerializers: ['jest-preset-angular/build/serializers/html-comment'],
};
