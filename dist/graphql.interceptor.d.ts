import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class GraphqlInterceptor implements NestInterceptor {
    private client;
    constructor();
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private captureHttpException;
    private captureRpcException;
    private captureWsException;
    private captureGraphqlException;
}
