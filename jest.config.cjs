module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest.setup.cjs'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.cjs'],
    testPathIgnorePatterns: ['node_modules', '.next'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/$1',
    },
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
            configFile: './babel.config.test.cjs',
        }],
    },
    moduleFileExtensions: ['js', 'jsx', 'json'],
    collectCoverageFrom: [
        'app/**/*.{js,jsx}',
        '!app/**/*.test.{js,jsx}',
        '!app/**/node_modules/**',
    ],
};

