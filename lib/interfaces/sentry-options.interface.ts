import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import { LogLevel } from '@sentry/types';

export interface SentryModuleOptions {
    dsn: string;
    debug: boolean;
    environment?: string;
    release?: string;
    logLevel?: LogLevel
}

export interface SentryOptionsFactory {
    createSentryModuleOptions(): Promise<SentryModuleOptions> | SentryModuleOptions;
}

export interface SentryModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useClass?: Type<SentryOptionsFactory>;
    useExisting?: Type<SentryOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<SentryModuleOptions> | SentryModuleOptions;
}