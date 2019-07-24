"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sentry_constants_1 = require("../common/sentry.constants");
const sentry_util_1 = require("../common/sentry.util");
function createSentryProviders(options) {
    return {
        provide: sentry_constants_1.SENTRY_TOKEN,
        useValue: sentry_util_1.createSentryClient(options),
    };
}
exports.createSentryProviders = createSentryProviders;
