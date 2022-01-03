import { ConsoleLogger } from '@nestjs/common';
import { OnApplicationShutdown } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryModuleOptions } from './sentry.interfaces';
export declare class SentryService extends ConsoleLogger implements OnApplicationShutdown {
    readonly opts?: SentryModuleOptions | undefined;
    app: string;
    private static serviceInstance;
    constructor(opts?: SentryModuleOptions | undefined);
    static SentryServiceInstance(): SentryService;
    log(message: string, context?: string, asBreadcrumb?: boolean): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string, asBreadcrumb?: boolean): void;
    debug(message: string, context?: string, asBreadcrumb?: boolean): void;
    verbose(message: string, context?: string, asBreadcrumb?: boolean): void;
    instance(): typeof Sentry;
    onApplicationShutdown(signal?: string): Promise<void>;
}
