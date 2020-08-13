import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SentryService } from './sentry.service';
import { SentryInterceptorOptions } from '../interfaces/sentry-interceptor.interface';
export declare class SentryInterceptor implements NestInterceptor {
    private readonly client;
    private readonly options?;
    constructor(client: SentryService, options?: SentryInterceptorOptions | undefined);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private captureHttpException;
    private captureRpcException;
    private captureWsException;
    private captureException;
    private shouldReport;
}
