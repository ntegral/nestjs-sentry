"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sentry_constants_1 = require("./sentry.constants");
const sentry_service_1 = require("./sentry.service");
function createSentryProviders(options) {
    return {
        provide: sentry_constants_1.SENTRY_TOKEN,
        useValue: new sentry_service_1.SentryService(options),
    };
}
exports.createSentryProviders = createSentryProviders;
//# sourceMappingURL=sentry.providers.js.map