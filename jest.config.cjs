const { TestEnvironment } = require('jest-environment-jsdom');
const path = require('path');
module.exports = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
        "\\.(jpg|jpeg|png|gif|svg)$": "jest-transform-stub"
    },
    setupFiles: [
        "<rootDir>/src/test/setup/textEncoder.js",
        "<rootDir>/src/test/setup/suppressWarnings.js"
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "jest-transform-stub"
    }
};