"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
function createSentryClient(options) {
    const sentry = new services_1.SentryService(options);
    return sentry;
}
exports.createSentryClient = createSentryClient;
