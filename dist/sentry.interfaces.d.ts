import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import { Integration, Options } from '@sentry/types';
import { ConsoleLoggerOptions } from "@nestjs/common";
import { SeverityLevel } from "@sentry/node";
export interface SentryCloseOptions {
    enabled: boolean;
    timeout?: number;
}
export declare type SentryModuleOptions = Omit<Options, 'integrations'> & {
    integrations?: Integration[];
    close?: SentryCloseOptions;
    prefix?: string;
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
export declare type SentryTransaction = boolean | 'path' | 'methodPath' | 'handler';
export interface SentryFilterFunction {
    (exception: any): boolean;
}
export interface SentryInterceptorOptionsFilter {
    type: any;
    filter?: SentryFilterFunction;
}
export interface SentryInterceptorOptions {
    filters?: SentryInterceptorOptionsFilter[];
    tags?: {
        [key: string]: string;
    };
    extra?: {
        [key: string]: any;
    };
    fingerprint?: string[];
    level?: SeverityLevel;
    request?: boolean;
    serverName?: boolean;
    transaction?: boolean | 'path' | 'methodPath' | 'handler';
    user?: boolean | string[];
    version?: boolean;
}
