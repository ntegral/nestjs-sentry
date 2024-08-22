"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlInterceptor = void 0;
const common_1 = require("@nestjs/common");
const _1 = require(".");
const node_1 = require("@sentry/node");
let GqlExecutionContext;
try {
    ({ GqlExecutionContext } = require('@nestjs/graphql'));
}
catch (e) { }
let GraphqlInterceptor = class GraphqlInterceptor extends _1.SentryInterceptor {
    captureException(context, scope, exception) {
        if (context.getType() === 'graphql') {
            this.captureGraphqlException(scope, GqlExecutionContext.create(context), exception);
        }
        else {
            super.captureException(context, scope, exception);
        }
    }
    captureGraphqlException(scope, gqlContext, exception) {
        const info = gqlContext.getInfo();
        const context = gqlContext.getContext();
        scope.setExtra('type', info.parentType.name);
        if (context.req) {
            const data = (0, node_1.extractRequestData)(context.req, {});
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
    (0, common_1.Injectable)()
], GraphqlInterceptor);
exports.GraphqlInterceptor = GraphqlInterceptor;
//# sourceMappingURL=graphql.interceptor.js.map