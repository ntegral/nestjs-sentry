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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const sentry_service_1 = require("./sentry.service");
const node_1 = require("@sentry/node");
let SentryInterceptor = class SentryInterceptor {
    constructor(options) {
        this.options = options;
        this.client = sentry_service_1.SentryService.SentryServiceInstance();
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.tap)(null, (exception) => {
            if (this.shouldReport(exception)) {
                this.client.instance().withScope((scope) => {
                    return this.captureException(context, scope, exception);
                });
            }
        }));
    }
    captureException(context, scope, exception) {
        switch (context.getType()) {
            case 'http':
                return this.captureHttpException(scope, context.switchToHttp(), exception);
            case 'rpc':
                return this.captureRpcException(scope, context.switchToRpc(), exception);
            case 'ws':
                return this.captureWsException(scope, context.switchToWs(), exception);
        }
    }
    captureHttpException(scope, http, exception) {
        const data = (0, node_1.extractRequestData)(http.getRequest(), this.options);
        scope.setExtra('req', data.request);
        if (data.extra)
            scope.setExtras(data.extra);
        if (data.user)
            scope.setUser(data.user);
        this.client.instance().captureException(exception);
    }
    captureRpcException(scope, rpc, exception) {
        scope.setExtra('rpc_data', rpc.getData());
        this.client.instance().captureException(exception);
    }
    captureWsException(scope, ws, exception) {
        scope.setExtra('ws_client', ws.getClient());
        scope.setExtra('ws_data', ws.getData());
        this.client.instance().captureException(exception);
    }
    shouldReport(exception) {
        if (this.options && !this.options.filters)
            return true;
        if (this.options) {
            const opts = this.options;
            if (opts.filters) {
                let filters = opts.filters;
                return filters.some(({ type, filter }) => {
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
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], SentryInterceptor);
exports.SentryInterceptor = SentryInterceptor;
//# sourceMappingURL=sentry.interceptor.js.map