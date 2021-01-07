import { Provider } from '@nestjs/common';
import { SentryModuleOptions } from './sentry.interfaces';
export declare function createSentryProviders(options: SentryModuleOptions): Provider;
