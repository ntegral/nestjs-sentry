"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var SentryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryService = void 0;
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
const sentry_constants_1 = require("./sentry.constants");
let SentryService = SentryService_1 = class SentryService extends common_1.ConsoleLogger {
    constructor(opts) {
        super();
        this.opts = opts;
        this.app = '@ntegral/nestjs-sentry: ';
        if (!(opts && opts.dsn)) {
            return;
        }
        const { debug, integrations = [] } = opts, sentryOptions = __rest(opts, ["debug", "integrations"]);
        Sentry.init(Object.assign(Object.assign({}, sentryOptions), { integrations: [
                new Sentry.Integrations.OnUncaughtException({
                    onFatalError: (err) => __awaiter(this, void 0, void 0, function* () {
                        if (err.name === 'SentryError') {
                            console.log(err);
                        }
                        else {
                            Sentry.getCurrentHub().getClient().captureException(err);
                            process.exit(1);
                        }
                    }),
                }),
                new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
                ...integrations,
            ] }));
    }
    static SentryServiceInstance() {
        if (!SentryService_1.serviceInstance) {
            SentryService_1.serviceInstance = new SentryService_1();
        }
        return SentryService_1.serviceInstance;
    }
    log(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.log(message, context);
            asBreadcrumb ?
                Sentry.addBreadcrumb({
                    message,
                    level: 'log',
                    data: {
                        context
                    }
                }) :
                Sentry.captureMessage(message, 'log');
        }
        catch (err) { }
    }
    error(message, trace, context) {
        message = `${this.app} ${message}`;
        try {
            super.error(message, trace, context);
            Sentry.captureMessage(message, 'error');
        }
        catch (err) { }
    }
    warn(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.warn(message, context);
            asBreadcrumb ?
                Sentry.addBreadcrumb({
                    message,
                    level: 'warning',
                    data: {
                        context
                    }
                }) :
                Sentry.captureMessage(message, 'warning');
        }
        catch (err) { }
    }
    debug(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.debug(message, context);
            asBreadcrumb ?
                Sentry.addBreadcrumb({
                    message,
                    level: 'debug',
                    data: {
                        context
                    }
                }) :
                Sentry.captureMessage(message, 'debug');
        }
        catch (err) { }
    }
    verbose(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.verbose(message, context);
            asBreadcrumb ?
                Sentry.addBreadcrumb({
                    message,
                    level: 'info',
                    data: {
                        context
                    }
                }) :
                Sentry.captureMessage(message, 'info');
        }
        catch (err) { }
    }
    instance() {
        return Sentry;
    }
    onApplicationShutdown(signal) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_b = (_a = this.opts) === null || _a === void 0 ? void 0 : _a.close) === null || _b === void 0 ? void 0 : _b.enabled) === true) {
                yield Sentry.close((_c = this.opts) === null || _c === void 0 ? void 0 : _c.close.timeout);
            }
        });
    }
};
SentryService = SentryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(sentry_constants_1.SENTRY_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], SentryService);
exports.SentryService = SentryService;
//# sourceMappingURL=sentry.service.js.map