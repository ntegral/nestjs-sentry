import { Breadcrumb, Severity, Scope, User } from "@sentry/node";
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
