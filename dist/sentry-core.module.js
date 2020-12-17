"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var SentryCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const sentry_constants_1 = require("./sentry.constants");
const sentry_service_1 = require("./sentry.service");
const sentry_providers_1 = require("./sentry.providers");
let SentryCoreModule = SentryCoreModule_1 = class SentryCoreModule {
    static forRoot(options) {
        const provider = sentry_providers_1.createSentryProviders(options);
        return {
            exports: [provider, sentry_service_1.SentryService],
            module: SentryCoreModule_1,
            providers: [provider, sentry_service_1.SentryService],
        };
    }
    static forRootAsync(options) {
        const provider = {
            inject: [sentry_constants_1.SENTRY_MODULE_OPTIONS],
            provide: sentry_constants_1.SENTRY_TOKEN,
            useFactory: (options) => new sentry_service_1.SentryService(options),
        };
        return {
            exports: [provider, sentry_service_1.SentryService],
            imports: options.imports,
            module: SentryCoreModule_1,
            providers: [
                ...this.createAsyncProviders(options),
                provider,
                sentry_service_1.SentryService,
            ],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        const useClass = options.useClass;
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: useClass,
                useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                inject: options.inject || [],
                provide: sentry_constants_1.SENTRY_MODULE_OPTIONS,
                useFactory: options.useFactory,
            };
        }
        const inject = [
            (options.useClass || options.useExisting),
        ];
        return {
            provide: sentry_constants_1.SENTRY_MODULE_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () { return yield optionsFactory.createSentryModuleOptions(); }),
            inject,
        };
    }
};
SentryCoreModule = SentryCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], SentryCoreModule);
exports.SentryCoreModule = SentryCoreModule;
//# sourceMappingURL=sentry-core.module.js.map