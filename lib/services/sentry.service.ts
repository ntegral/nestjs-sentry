import { Inject, Injectable, Logger } from '@nestjs/common';
import { Scope } from '@sentry/hub';
import { Breadcrumb, Event, Severity, User } from '@sentry/types';
import * as Sentry from '@sentry/node';

import { SENTRY_MODULE_OPTIONS } from '../common/sentry.constants';
import { SentryModuleOptions } from '../interfaces/sentry-options.interface';

export interface ISentryService {
  /**
    * Records a new breadcrumb which will be attached to future events.
    *
    * Breadcrumbs will be added to subsequent events to provide more context on
    * user's actions prior to an error or crash.
    *
    * @param breadcrumb The breadcrumb to record.
  */
  addBreadcrumb(breadcrumb: Breadcrumb): void;
  /**
    * Captures an exception event and sends it to Sentry.
    *
    * @param exception An exception-like object.
    * @returns The generated eventId.
  */
  captureException(exception: any): string;
  /**
    * Captures a manually created event and sends it to Sentry.
    *
    * @param event The event to send to Sentry.
    * @returns The generated eventId.
  */
  captureEvent(event: Event): string;
  /**
    * Callback to set context information onto the scope.
    * @param callback Callback function that receives Scope.
  */
  configureScope(callback: (scope: Scope) => void): void;
  /**
    * Captures a message event and sends it to Sentry.
    *
    * @param message The message to send to Sentry.
    * @param level Define the level of the message.
    * @returns The generated eventId.
  */
  captureMessage(message: string, level?: Severity|undefined): string;
  /**
    * Sets context data with the given name.
    * @param name of the context
    * @param context Any kind of data. This data will be normailzed.
  */
  setContext(name: string, context: {
    [key: string]: any;
  } | null): void;
  /**
    * Set an object that will be merged sent as extra data with the event.
    * @param extras Extras object to merge into current context.
  */
  setExtras(extras: {
    [key: string]: any;
  }): void;
  /**
    * Set an object that will be merged sent as tags data with the event.
    * @param tags Tags context object to merge into current context.
  */
  setTags(tags: {
    [key: string]: string;
  }): void;
  /**
    * Set key:value that will be sent as extra data with the event.
    * @param key String of extra
    * @param extra Any kind of data. This data will be normailzed.
  */
  setExtra(key: string, extra: any): void;
  /**
    * Set key:value that will be sent as tags data with the event.
    * @param key String key of tag
    * @param value String value of tag
  */
  setTag(key: string, value: string): void;
  /**
    * Updates user context information for future events.
    *
    * @param user User context object to be set in the current context. Pass `null` to unset the user.
  */
  setUser(user: User | null): void;
  /**
    * Creates a new scope with and executes the given operation within.
    * The scope is automatically removed once the operation
    * finishes or throws.
    *
    * This is essentially a convenience function for:
    *
    *     pushScope();
    *     callback();
    *     popScope();
    *
    * @param callback that will be enclosed into push/popScope.
  */
  withScope(callback: (scope: Scope) => void): void;
  /**
    * Calls a function on the latest client. Use this with caution, it's meant as
    * in "internal" helper so we don't need to expose every possible function in
    * the shim. It is not guaranteed that the client actually implements the
    * function.
    *
    * @param method The method to call on the client/client.
    * @param args Arguments to pass to the client/fontend.
  */
  _callOnClient(method: string, ...args: any[]): void;
}

export abstract class SentryBaseService extends Logger {}

@Injectable()
export class SentryService extends Logger {
    app: string = '@ntegral/nestjs-sentry: ';
    constructor(
        @Inject(SENTRY_MODULE_OPTIONS)
        private readonly options?: SentryModuleOptions,
      ) {
        super();
        if (!(options && options.dsn)) {
          console.log('options not found. Did you use SentryModule.forRoot?');
          return;
        }

        Sentry.init({
          dsn: options.dsn,
          debug: options.debug,
          environment: options.environment,
          release: options.release,
          logLevel: options.logLevel
        });
        console.log('sentry.io initialized', Sentry);
      }

  log(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Log);
      super.log(message, context);
    } catch (err) {
      console.error(message, err);
    }
  }

  error(message: string, trace?: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Error);
      super.error(message, trace, context);
    } catch (err) {
      console.error(message, err);
    }
  }

  warn(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Warning);
      super.warn(message, context);
    } catch (err) {
      console.error(message, err);
    }
  }

  debug(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Debug);
      super.debug(message, context);
    } catch (err) {
      console.error(message, err);
    }
  }

  verbose(message: string, context?: string) {
    message = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(message, Sentry.Severity.Info);
      super.verbose(message, context);
    } catch (err) {
      console.error(message, err);
    }
  }
}