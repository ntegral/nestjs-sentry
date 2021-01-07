import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SentryService } from './sentry.service';
export declare class SentryInterceptor implements NestInterceptor {
    private readonly client;
    constructor(client: SentryService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private captureHttpException;
    private captureRpcException;
    private captureWsException;
    private captureGraphqlException;
}
