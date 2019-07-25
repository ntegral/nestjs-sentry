import { SentryModuleOptions } from '../interfaces';
import { SentryService } from '../services';

export function createSentryClient(options?: SentryModuleOptions): SentryService {
    const sentry = new SentryService(options);
    return sentry;
}