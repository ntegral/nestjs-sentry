import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SentryInterceptorOptions } from './sentry.interfaces';
export declare class SentryInterceptor implements NestInterceptor {
    private readonly options?;
    private client;
    constructor(options?: SentryInterceptorOptions | undefined);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private captureHttpException;
    private captureRpcException;
    private captureWsException;
    private shouldReport;
}
