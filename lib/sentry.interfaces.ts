import { ConsoleLoggerOptions } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { AddRequestDataToEventOptions } from '@sentry/node';
import { Integration, Options } from '@sentry/types';

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
    addRequestDataOptions?: Omit<AddRequestDataToEventOptions, 'deps'>;
}