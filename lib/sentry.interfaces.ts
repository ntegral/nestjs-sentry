import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import { Integration, Options } from '@sentry/types';
import { Severity } from "@sentry/node";
import { ConsoleLoggerOptions, LoggerService } from '@nestjs/common';

export interface SentryCloseOptions {
    enabled: boolean;
    // timeout – Maximum time in ms the client should wait until closing forcefully
    timeout?: number;
}

export interface LoggingOptions {
    logger?: LoggerService | null;
    loggerOptions?: ConsoleLoggerOptions;
}

export type SentryModuleOptions = Omit<Options, 'integrations'> & {
    integrations?: Integration[];
    close?: SentryCloseOptions
} & LoggingOptions;

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
    level?: Severity;

    // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L163
    request?: boolean;
    serverName?: boolean;
    transaction?: boolean | 'path' | 'methodPath' | 'handler'; // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L16
    user?: boolean | string[];
    version?: boolean;
}