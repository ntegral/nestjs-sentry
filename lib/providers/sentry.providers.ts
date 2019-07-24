import { Provider } from '@nestjs/common';
import { SentryModuleOptions } from '../interfaces/sentry-options.interface';
import { SENTRY_TOKEN } from '../common/sentry.constants';
import { createSentryClient } from '../common/sentry.util';

export function createSentryProviders(options: SentryModuleOptions) : Provider {
    return {
        provide: SENTRY_TOKEN,
        useValue: createSentryClient(options),
    }
}