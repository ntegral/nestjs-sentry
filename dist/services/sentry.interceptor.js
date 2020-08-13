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
const operators_1 = require("rxjs/operators");
const common_2 = require("../common");
const sentry_service_1 = require("./sentry.service");
const node_1 = require("@sentry/node");
let SentryInterceptor = class SentryInterceptor {
    constructor(client, options) {
        this.client = client;
        this.options = options;
    }
    intercept(context, next) {
        return next.handle().pipe(operators_1.tap(null, (exception) => {
            if (this.shouldReport(exception)) {
                this.client.instance().withScope((scope) => {
                    switch (context.getType()) {
                        case 'http':
                            return this.captureHttpException(scope, context.switchToHttp(), exception);
                        case 'rpc':
                            return this.captureRpcException(scope, context.switchToRpc(), exception);
                        case 'ws':
                            return this.captureWsException(scope, context.switchToWs(), exception);
                    }
                });
            }
        }));
    }
    captureHttpException(scope, http, exception) {
        const data = node_1.Handlers.parseRequest({}, http.getRequest(), this.options);
        scope.setExtra('req', data.request);
        data.extra && scope.setExtras(data.extra);
        if (data.user)
            scope.setUser(data.user);
        this.captureException(scope, exception);
    }
    captureRpcException(scope, rpc, exception) {
        scope.setExtra('rpc_data', rpc.getData());
        this.captureException(scope, exception);
    }
    captureWsException(scope, ws, exception) {
        scope.setExtra('ws_client', ws.getClient());
        scope.setExtra('ws_data', ws.getData());
        this.captureException(scope, exception);
    }
    captureException(scope, exception) {
        if (this.options) {
            if (this.options.level)
                scope.setLevel(this.options.level);
            if (this.options.fingerprint)
                scope.setFingerprint(this.options.fingerprint);
            if (this.options.extra)
                scope.setExtras(this.options.extra);
            if (this.options.tags)
                scope.setTags(this.options.tags);
        }
        this.client.instance().captureException(exception);
    }
    shouldReport(exception) {
        if (this.options && !this.options.filters)
            return true;
        if (this.options) {
            const opts = this.options;
            if (opts.filters) {
                let filters = opts.filters;
                return filters.every(({ type, filter }) => {
                    return !(exception instanceof type && (!filter || filter(exception)));
                });
            }
        }
        else {
            return true;
        }
    }
};
SentryInterceptor = __decorate([
    common_1.Injectable(),
    __param(0, common_2.InjectSentry()),
    __metadata("design:paramtypes", [sentry_service_1.SentryService, Object])
], SentryInterceptor);
exports.SentryInterceptor = SentryInterceptor;
//# sourceMappingURL=sentry.interceptor.js.map