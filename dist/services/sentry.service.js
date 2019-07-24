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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
const sentry_constants_1 = require("../common/sentry.constants");
class SentryBaseService extends common_1.Logger {
}
exports.SentryBaseService = SentryBaseService;
let SentryService = class SentryService extends common_1.Logger {
    constructor(options) {
        super();
        this.options = options;
        this.app = '@ntegral/nestjs-sentry: ';
        if (!(options && options.dsn)) {
            console.log('options not found. Did you use SentryModule.forRoot?');
            return;
        }
        Sentry.init({
            dsn: options.dsn,
            debug: options.debug,
            environment: options.environment,
            release: options.release,
            logLevel: options.logLevel
        });
        console.log('sentry.io initialized', Sentry);
    }
    log(message, context) {
        message = `${this.app} ${message}`;
        try {
            Sentry.captureMessage(message, Sentry.Severity.Log);
            super.log(message, context);
        }
        catch (err) {
            console.error(message, err);
        }
    }
    error(message, trace, context) {
        message = `${this.app} ${message}`;
        try {
            Sentry.captureMessage(message, Sentry.Severity.Error);
            super.error(message, trace, context);
        }
        catch (err) {
            console.error(message, err);
        }
    }
    warn(message, context) {
        message = `${this.app} ${message}`;
        try {
            Sentry.captureMessage(message, Sentry.Severity.Warning);
            super.warn(message, context);
        }
        catch (err) {
            console.error(message, err);
        }
    }
    debug(message, context) {
        message = `${this.app} ${message}`;
        try {
            Sentry.captureMessage(message, Sentry.Severity.Debug);
            super.debug(message, context);
        }
        catch (err) {
            console.error(message, err);
        }
    }
    verbose(message, context) {
        message = `${this.app} ${message}`;
        try {
            Sentry.captureMessage(message, Sentry.Severity.Info);
            super.verbose(message, context);
        }
        catch (err) {
            console.error(message, err);
        }
    }
};
SentryService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(sentry_constants_1.SENTRY_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], SentryService);
exports.SentryService = SentryService;
