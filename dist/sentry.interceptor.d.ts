import { CallHandler, ExecutionContext, HttpException, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Scope } from '@sentry/hub';
import { SentryService } from './sentry.service';
import { SentryInterceptorOptions } from './sentry.interfaces';
export declare class SentryInterceptor implements NestInterceptor {
    private readonly options?;
    protected readonly client: SentryService;
    constructor(options?: SentryInterceptorOptions | undefined);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    protected captureException(context: ExecutionContext, scope: Scope, exception: HttpException): void;
    private captureHttpException;
    private captureRpcException;
    private captureWsException;
    private shouldReport;
}
