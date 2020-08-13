import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject } from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SENTRY_TOKEN, InjectSentry } from '../common';
import { SentryService } from './sentry.service';
import { Scope } from '@sentry/hub';
import { HttpArgumentsHost, ContextType, WsArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { Handlers } from '@sentry/node';
import { SentryInterceptorOptions, SentryFilterFunction, SentryInterceptorOptionsFilter } from '../interfaces/sentry-interceptor.interface';

@Injectable()
export class SentryInterceptor implements NestInterceptor {

  constructor(
    @InjectSentry() private readonly client: SentryService,
    private readonly options?: SentryInterceptorOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // first param would be for events, second is for errors
    return next.handle().pipe(
      tap(null, (exception) => {
        if (this.shouldReport(exception)) {
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
    const data = Handlers.parseRequest(<any>{},http.getRequest(), this.options);

    scope.setExtra('req', data.request);
    data.extra && scope.setExtras(data.extra);
    if (data.user) scope.setUser(data.user);

    this.captureException(scope, exception);
  }

  private captureRpcException(
    scope: Scope,
    rpc: RpcArgumentsHost,
    exception: any,
  ): void {
    scope.setExtra('rpc_data', rpc.getData());

    this.captureException(scope, exception);
  }

  private captureWsException(
    scope: Scope,
    ws: WsArgumentsHost,
    exception: any,
  ): void {
    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());

    this.captureException(scope, exception);
  }

  private captureException(scope: Scope, exception: any): void {
    if (this.options) {
      if (this.options.level) scope.setLevel(this.options.level);
      if (this.options.fingerprint)
        scope.setFingerprint(this.options.fingerprint);
      if (this.options.extra) scope.setExtras(this.options.extra);
      if (this.options.tags) scope.setTags(this.options.tags);
    }

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
