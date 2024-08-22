import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import { Integration, Options } from '@sentry/types';
import { ConsoleLoggerOptions, HttpException } from "@nestjs/common";
import { SeverityLevel } from "@sentry/node";

export interface SentryCloseOptions {
    enabled: boolean;
    // timeout – Maximum time in ms the client should wait until closing forcefully
    timeout?: number;
}

export type SentryModuleOptions = Omit<Options, 'integrations'> & {
    integrations?: Integration[];
    close?: SentryCloseOptions
} & ConsoleLoggerOptions;

export interface SentryOptionsFactory {
    createSentryModuleOptions(): Promise<SentryModuleOptions> | SentryModuleOptions;
}

export interface SentryModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useClass?: Type<SentryOptionsFactory>;
    useExisting?: Type<SentryOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<SentryModuleOptions> | SentryModuleOptions;
}

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
    level?: SeverityLevel;

    // https://github.com/getsentry/sentry-javascript/blob/615c670cfe283e77132339c3d9751060f30d3956/packages/utils/src/requestdata.ts#L148
    include?: string[];

    // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L163
    request?: boolean;
    /**
     * @deprecated Not used anymore in Sentry v8.0
     */
    serverName?: boolean;
    transaction?: boolean | 'path' | 'methodPath' | 'handler'; // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L16
    user?: boolean | string[];
    /**
     * @deprecated Not used anymore in Sentry v8.0
     */
    version?: boolean;
}