import { Provider } from '@nestjs/common';
import { SentryModuleOptions } from '../interfaces/sentry-options.interface';
export declare function createSentryProviders(options: SentryModuleOptions): Provider;
