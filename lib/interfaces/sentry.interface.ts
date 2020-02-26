import * as Sentry from '@sentry/types';

export interface ISentryFilterFn {
    (exception:any): boolean;
}

export interface ISentryInterceptorOptionsFilter {
    type: any;
    filter?: ISentryFilterFn;
}

export interface ISentryInterceptorOptions {
    filters?: ISentryInterceptorOptionsFilter[];
    tags?: { [key: string]: string };
    extra?: { [key: string]: any };
    fingerprint?: string[];
    level?: Sentry.Severity;
    context?: 'Http' | 'Ws' | 'Rpc' | 'GraphQL';

    request?: boolean;
    serverName?: boolean;
    transaction?: boolean | 'path' | 'methodPath' | 'handler';
    user?: boolean | string[];
    version?: boolean;
}