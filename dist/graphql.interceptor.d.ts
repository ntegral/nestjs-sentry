import { ExecutionContext } from "@nestjs/common";
import { SentryInterceptor } from ".";
import { Scope } from "@sentry/node";
export declare class GraphqlInterceptor extends SentryInterceptor {
    protected captureException(context: ExecutionContext, scope: Scope, exception: any): void;
    private captureGraphqlException;
}
