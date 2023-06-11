import config from "./jest.config";

// @ts-expect-error
config.testMatch = ["**/**.test.ts"];

module.exports = config;
