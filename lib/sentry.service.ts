import { ConsoleLogger, Inject, Injectable, LoggerService } from '@nestjs/common';
import { Options, Client } from '@sentry/types';
import * as Sentry from '@sentry/node';
import { OnApplicationShutdown } from '@nestjs/common';

import { SENTRY_MODULE_OPTIONS } from './sentry.constants';
import { SentryModuleOptions } from './sentry.interfaces';

@Injectable()
export class SentryService implements LoggerService, OnApplicationShutdown {

  app = '@ntegral/nestjs-sentry: ';
  private static serviceInstance: SentryService;

  constructor(
    @Inject(SENTRY_MODULE_OPTIONS)
    readonly opts?: SentryModuleOptions,
  ) {
    if (!(opts && opts.dsn)) {
      // console.log('options not found. Did you use SentryModule.forRoot?');
      return;
    }
    const { debug, integrations = [], logger, loggerOptions, ...sentryOptions } = opts;

    if (typeof logger === 'undefined') {
      opts.logger = new ConsoleLogger('', loggerOptions || {});
    }

    Sentry.init({
      ...sentryOptions,
      integrations: [
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: async (err) => {
            // console.error('uncaughtException, not cool!')
            // console.error(err);
            if (err.name === 'SentryError') {
              console.log(err);
            } else {
              (
                Sentry.getCurrentHub().getClient<
                  Client<Options>
                >() as Client<Options>
              ).captureException(err);
              process.exit(1);
            }
          },
        }),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
        ...integrations,
      ],
    });
  }

  public static SentryServiceInstance(): SentryService {
    if (!SentryService.serviceInstance) {
      SentryService.serviceInstance = new SentryService();
    }
    return SentryService.serviceInstance;
  }

  log(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      if (this.opts && this.opts.logger) {
        this.opts.logger.log(message, context);
      }
      Sentry.captureMessage(message, Sentry.Severity.Log);
    } catch (err) {}
  }

  error(message: string, trace?: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      if (this.opts && this.opts.logger) {
        this.opts.logger.error(message, trace, context);
      }
      Sentry.captureMessage(message, Sentry.Severity.Error);
    } catch (err) {}
  }

  warn(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      if (this.opts && this.opts.logger) {
        this.opts.logger.warn(message, context);
      }
      Sentry.captureMessage(message, Sentry.Severity.Warning);
    } catch (err) {}
  }

  debug(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      if (this.opts && this.opts.logger && this.opts.logger.debug) {
        this.opts.logger.debug(message, context);
      }
      Sentry.captureMessage(message, Sentry.Severity.Debug);
    } catch (err) {}
  }

  verbose(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      if (this.opts && this.opts.logger && this.opts.logger.verbose) {
        this.opts.logger.verbose(message, context);
      }
      Sentry.captureMessage(message, Sentry.Severity.Info);
    } catch (err) {}
  }

  instance() {
    return Sentry;
  }

  async onApplicationShutdown(signal?: string) {
    if (this.opts?.close?.enabled === true) {
      await Sentry.close(this.opts?.close.timeout);
    }
  }
}
