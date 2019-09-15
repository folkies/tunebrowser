// https://github.com/thymikee/jest-preset-angular#brief-explanation-of-config

// config workaround for Angular 8, see https://github.com/briebug/jest-schematic/issues/12
const tsJestPreset = require('jest-preset-angular/jest-preset').globals['ts-jest'];

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['src'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@env': '<rootDir>/src/environments/environment',
    '@src/(.*)': '<rootDir>/src/src/$1',
    '@state/(.*)': '<rootDir>/src/app/state/$1'
  },
  globals: {
    'ts-jest': {
      ...tsJestPreset,
      tsConfig: 'tsconfig.spec.json'
    }
  },
  transformIgnorePatterns: ['node_modules/(?!(jest-test))']
};
