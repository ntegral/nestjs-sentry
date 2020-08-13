import { Severity } from "@sentry/node";

export type SentryTransaction = boolean | 'path' | 'methodPath' | 'handler';

export interface SentryFilterFunction {
    (exception:any): boolean
}

export interface SentryInterceptorOptionsFilter {
    type: any;
    filter?: SentryFilterFunction;
}

export interface SentryInterceptorOptions {
    filters?: SentryInterceptorOptionsFilter[];
    tags?: { [key: string]: string };
    extra?: { [key: string]: any };
    fingerprint?: string[];
    level?: Severity;

    // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L163
    request?: boolean;
    serverName?: boolean;
    transaction?: boolean | 'path' | 'methodPath' | 'handler'; // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L16
    user?: boolean | string[];
    version?: boolean;
}