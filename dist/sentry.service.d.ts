import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryModuleOptions } from './sentry.interfaces';
export declare class SentryService extends Logger {
    private readonly options?;
    app: string;
    constructor(options?: SentryModuleOptions | undefined, prior?: SentryService);
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    instance(): typeof Sentry;
}
