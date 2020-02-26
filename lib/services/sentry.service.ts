import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { Options, Client } from '@sentry/types';
import * as Sentry from '@sentry/node';

import { SENTRY_MODULE_OPTIONS } from '../common/sentry.constants';
import { SentryModuleOptions } from '../interfaces/sentry-options.interface';

export abstract class SentryBaseService extends Logger {}

@Injectable()
export class SentryService extends Logger {
    app: string = '@ntegral/nestjs-sentry: ';
    constructor(
        @Inject(SENTRY_MODULE_OPTIONS)
        private readonly options?: SentryModuleOptions,
        @Optional() prior?: SentryService
      ) {
        super();
        if (!(options && options.dsn)) {
          // console.log('options not found. Did you use SentryModule.forRoot?');
          return;
        }

        Sentry.init({
          dsn: options.dsn,
          debug: options.debug === true ? false : options.debug,
          environment: options.environment,
          release: options.release,
          logLevel: options.logLevel,
          integrations: [
            new Sentry.Integrations.OnUncaughtException({
              onFatalError: (async (err) => {
                // console.error('uncaughtException, not cool!')
                // console.error(err);
                if (err.name === 'SentryError') { console.log(err); } else { (Sentry.getCurrentHub().getClient<Client<Options>>() as Client<Options>).captureException(err); process.exit(1); }
              }),
            }),
            new Sentry.Integrations.OnUnhandledRejection({mode: 'warn'})
          ]
        });
      }

  log(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Log);
      super.log(message, context);
    } catch (err) {  }
  }

  error(message: string, trace?: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Error);
      super.error(message, trace, context);
    } catch (err) {  }
  }

  warn(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Warning);
      super.warn(message, context);
    } catch (err) {  }
  }

  debug(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Debug);
      super.debug(message, context);
    } catch (err) {  }
  }

  verbose(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Info);
      super.verbose(message, context);
    } catch (err) {  }
  }

  instance() {
    return Sentry;
  }
}