export default {
  clearMocks: true,

  coverageDirectory: 'coverage',

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/**/*.mock.{ts,tsx}',
    '!<rootDir>/src/**/index.{ts,tsx}',
  ],

  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],

  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src$1',
    '(\\.(css|less|svg))$': 'identity-obj-proxy',
  },

  modulePathIgnorePatterns: ['<rootDir>/dist/'],

  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '\\.(ts|tsx)': 'ts-jest',
  },

  transformIgnorePatterns: ['<rootDir>/node_modules/(?!antd|rc-pagination)/'],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
}
