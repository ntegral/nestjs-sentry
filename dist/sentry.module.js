"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SentryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const sentry_core_module_1 = require("./sentry-core.module");
let SentryModule = SentryModule_1 = class SentryModule {
    static forRoot(options) {
        return {
            module: SentryModule_1,
            imports: [sentry_core_module_1.SentryCoreModule.forRoot(options)],
        };
    }
    static forRootAsync(options) {
        return {
            module: SentryModule_1,
            imports: [sentry_core_module_1.SentryCoreModule.forRootAsync(options)],
        };
    }
};
SentryModule = SentryModule_1 = __decorate([
    common_1.Module({})
], SentryModule);
exports.SentryModule = SentryModule;
//# sourceMappingURL=sentry.module.js.map