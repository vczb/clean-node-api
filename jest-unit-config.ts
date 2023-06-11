import config from "./jest.config";

// @ts-expect-error
config.testMatch = ["**/**.spec.ts"];

module.exports = config;
