import { Logger } from '@nestjs/common';
import { Scope } from '@sentry/hub';
import { Breadcrumb, Event, Severity, User } from '@sentry/types';
import { SentryModuleOptions } from '../interfaces/sentry-options.interface';
export interface ISentryService {
    addBreadcrumb(breadcrumb: Breadcrumb): void;
    captureException(exception: any): string;
    captureEvent(event: Event): string;
    configureScope(callback: (scope: Scope) => void): void;
    captureMessage(message: string, level?: Severity | undefined): string;
    setContext(name: string, context: {
        [key: string]: any;
    } | null): void;
    setExtras(extras: {
        [key: string]: any;
    }): void;
    setTags(tags: {
        [key: string]: string;
    }): void;
    setExtra(key: string, extra: any): void;
    setTag(key: string, value: string): void;
    setUser(user: User | null): void;
    withScope(callback: (scope: Scope) => void): void;
    _callOnClient(method: string, ...args: any[]): void;
}
export declare abstract class SentryBaseService extends Logger {
}
export declare class SentryService extends Logger {
    private readonly options?;
    app: string;
    constructor(options?: SentryModuleOptions | undefined);
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
}
