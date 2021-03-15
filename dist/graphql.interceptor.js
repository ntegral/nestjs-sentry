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
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const sentry_service_1 = require("./sentry.service");
const graphql_1 = require("@nestjs/graphql");
const node_1 = require("@sentry/node");
let GraphqlInterceptor = class GraphqlInterceptor {
    constructor() {
        this.client = sentry_service_1.SentryService.SentryServiceInstance();
    }
    intercept(context, next) {
        return next.handle().pipe(operators_1.tap(null, (exception) => {
            this.client.instance().withScope((scope) => {
                switch (context.getType()) {
                    case 'http':
                        return this.captureHttpException(scope, context.switchToHttp(), exception);
                    case 'rpc':
                        return this.captureRpcException(scope, context.switchToRpc(), exception);
                    case 'ws':
                        return this.captureWsException(scope, context.switchToWs(), exception);
                    case 'graphql':
                        return this.captureGraphqlException(scope, graphql_1.GqlExecutionContext.create(context), exception);
                }
            });
        }));
    }
    captureHttpException(scope, http, exception) {
        const data = node_1.Handlers.parseRequest({}, http.getRequest(), {});
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
    captureGraphqlException(scope, gqlContext, exception) {
        const info = gqlContext.getInfo();
        const context = gqlContext.getContext();
        scope.setExtra('type', info.parentType.name);
        if (context.req) {
            const data = node_1.Handlers.parseRequest({}, context.req, {});
            scope.setExtra('req', data.request);
            if (data.extra)
                scope.setExtras(data.extra);
            if (data.user)
                scope.setUser(data.user);
        }
        this.client.instance().captureException(exception);
    }
};
GraphqlInterceptor = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], GraphqlInterceptor);
exports.GraphqlInterceptor = GraphqlInterceptor;
//# sourceMappingURL=graphql.interceptor.js.map