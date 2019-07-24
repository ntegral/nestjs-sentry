import { DynamicModule } from '@nestjs/common';
import { SentryModuleOptions, SentryModuleAsyncOptions } from './interfaces/sentry-options.interface';
export declare class SentryModule {
    static forRoot(options: SentryModuleOptions): DynamicModule;
    static forRootAsync(options: SentryModuleAsyncOptions): DynamicModule;
}
