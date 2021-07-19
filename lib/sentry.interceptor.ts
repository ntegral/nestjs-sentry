// Nestjs imports
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { 
  HttpArgumentsHost,
  WsArgumentsHost,
  RpcArgumentsHost,
  ContextType
} from '@nestjs/common/interfaces';
// Rxjs imports
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// Sentry imports
import { Scope } from '@sentry/hub';
import { Handlers } from '@sentry/node';

import { SentryService } from './sentry.service';
import { SentryInterceptorOptions, SentryInterceptorOptionsFilter } from './sentry.interfaces';


@Injectable()
export class SentryInterceptor implements NestInterceptor {

  private client: SentryService = SentryService.SentryServiceInstance()
  constructor(
    private readonly options?: SentryInterceptorOptions
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // first param would be for events, second is for errors
    return next.handle().pipe(
      tap(null, (exception) => {
        if(this.shouldReport(exception)) {
          this.client.instance().withScope((scope) => {
            switch (context.getType<ContextType>()) {
              case 'http':
                return this.captureHttpException(
                  scope, 
                  context.switchToHttp(), 
                  exception
                );
              case 'rpc':
                return this.captureRpcException(
                  scope,
                  context.switchToRpc(),
                  exception,
                );
              case 'ws':
                return this.captureWsException(
                  scope,
                  context.switchToWs(),
                  exception,
                );
            }
          })
        }
      })
    );
  }

  private captureHttpException(scope: Scope, http: HttpArgumentsHost, exception: any): void {
    const data = Handlers.parseRequest(<any>{},http.getRequest(), {});

    scope.setExtra('req', data.request);
    
    if (data.extra) scope.setExtras(data.extra);
    if (data.user) scope.setUser(data.user);

    this.client.instance().captureException(exception);
  }

  private captureRpcException(
    scope: Scope,
    rpc: RpcArgumentsHost,
    exception: any,
  ): void {
    scope.setExtra('rpc_data', rpc.getData());

    this.client.instance().captureException(exception);
  }

  private captureWsException(
    scope: Scope,
    ws: WsArgumentsHost,
    exception: any,
  ): void {
    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());

    this.client.instance().captureException(exception);
  }

  private shouldReport(exception: any) {
    if (this.options && !this.options.filters) return true;

    // If all filters pass, then we do not report
    if (this.options) {
      const opts: SentryInterceptorOptions = this.options as {}
      if (opts.filters) {
        let filters: SentryInterceptorOptionsFilter[] = opts.filters
        return filters.every(({ type, filter }) => {
          return !(exception instanceof type && (!filter || filter(exception)));
        });
      }
    } else {
      return true;
    }
  }
}
