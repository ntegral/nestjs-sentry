import { Module, DynamicModule } from "@nestjs/common";
import { SentryCoreModule } from "./sentry-core.module";
import { SentryInterceptor } from "./sentry.interceptor";
import { GraphqlInterceptor } from "./graphql.interceptor";
import {
  SentryModuleOptions,
  SentryModuleAsyncOptions,
} from "./sentry.interfaces";

@Module({})
export class SentryModule {
  public static forRoot(options: SentryModuleOptions): DynamicModule {
    return {
      module: SentryModule,
      imports: [SentryCoreModule.forRoot(options)],
      exports: [SentryInterceptor, GraphqlInterceptor],
    };
  }

  public static forRootAsync(options: SentryModuleAsyncOptions): DynamicModule {
    return {
      module: SentryModule,
      imports: [SentryCoreModule.forRootAsync(options)],
      exports: [SentryInterceptor, GraphqlInterceptor],
    };
  }
}
