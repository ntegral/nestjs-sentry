import { SentryModuleOptions } from './sentry.interfaces';
import { SentryService } from './sentry.service';
import { ConsoleLogger } from '@nestjs/common';

export function createSentryService(options: SentryModuleOptions): SentryService {
  const opts: SentryModuleOptions = {...options};

  if (typeof opts.logger === 'undefined') {
    opts.logger = new ConsoleLogger('', opts.loggerOptions || {});
  }

  return new SentryService(opts);
}