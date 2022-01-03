"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectSentryModuleConfig = exports.InjectSentry = void 0;
const injectDecoratoryFactory_1 = require("./injectDecoratoryFactory");
const sentry_constants_1 = require("./sentry.constants");
exports.InjectSentry = (0, injectDecoratoryFactory_1.makeInjectableDecorator)(sentry_constants_1.SENTRY_TOKEN);
exports.InjectSentryModuleConfig = (0, injectDecoratoryFactory_1.makeInjectableDecorator)(sentry_constants_1.SENTRY_MODULE_OPTIONS);
//# sourceMappingURL=sentry.decorator.js.map