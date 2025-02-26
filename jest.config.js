export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    testPathIgnorePatterns: ['node_modules', '.next'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        isolatedModules: true,
    }
};