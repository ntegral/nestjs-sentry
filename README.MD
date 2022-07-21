[![npm version](http://img.shields.io/npm/v/@ntegral/nestjs-sentry.svg?style=flat)](https://npmjs.org/package/@ntegral/nestjs-sentry "View this project on npm")
[![Codecov Coverage](https://img.shields.io/codecov/c/github/ntegral/nestjs-sentry/master.svg?style=flat-square)](https://codecov.io/gh/ntegral/nestjs-sentry)
[![ISC license](http://img.shields.io/badge/license-ISC-brightgreen.svg)](http://opensource.org/licenses/ISC)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PM2PTQ6Z2XATQ&source=url)

<p align="center">
  <h3 align="center">
    @ntegral/nestjs-sentry
  </h3>

  <p align="center">
    Provides an injectable sentry.io client to provide enterprise logging nestjs modules
  </p>
</p>

## Table Of Contents

- [NestJS 8 Support](#nestjs-8-support)
- [About](#about)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## NestJS 8 Support
Version 3.x.x will support NestJS 8+. If you need support for NestJS 7 please continue to use Version 2.x.x.  Thanks for you support!

## About

`@ntegral/nestjs-sentry` implements a module, `SentryModule`, which when imported into
your nestjs project provides a Sentry.io client to any class that injects it. This
lets Sentry.io be worked into your dependency injection workflow without having to
do any extra work outside of the initial setup.

## Installation

```bash
npm install --save @ntegral/nestjs-sentry @sentry/node
```

## Github Sample Project using @ntegral/nestjs-sentry

The following project was created as a sample starter project to get you going... (if needed...).
- [@ntegral/nestjs-sentry sample](https://github.com/ntegral/nestjs-sentry-example)

## Getting Started

The simplest way to use `@ntegral/nestjs-sentry` is to use `SentryModule.forRoot`

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@ntegral/nestjs-sentry';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'sentry_io_dsn',
      debug: true | false,
      environment: 'dev' | 'production' | 'some_environment',
      release: 'some_release', | null, // must create a release in sentry.io dashboard
      logLevels: ['debug'] //based on sentry.io loglevel //
    }),
  ],
})
export class AppModule {}
```

The async way `@ntegral/nestjs-sentry` is to use `SentryModule.forRootAsync`

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ConfigModule } from '@ntegral/nestjs-config';
import { ConfigService } from '@ntegral/nestjs-config';

@Module({
  imports: [
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg:ConfigService) => ({
        dsn: cfg.get('SENTRY_DSN'),
        debug: true | false,
        environment: 'dev' | 'production' | 'some_environment',
        release: 'some_release', | null, // must create a release in sentry.io dashboard
        logLevels: ['debug'] //based on sentry.io loglevel //
      }),
      inject: [ConfigService],
    })
  ]
})

export class AppModule {}
```

You can then inject the Sentry client into any of your injectables by using a
custom decorator

```typescript
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class AppService {
  public constructor(@InjectSentry() private readonly client: SentryService) {
      client.instance().captureMessage(message, Sentry.Severity.Log);
      client.instance().captureException(exception);
      ... and more
  }
}
```

You can instruct Nest to use the SentryService as the default logger:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.useLogger(SentryService.SentryServiceInstance());
  await app.listen(3000);
}
bootstrap();
```

You can instuct use the SentryService to log non-error messages as breadcrumbs or use the native Sentry.addBreadcrumb method.

```typescript
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class AppService {
  constructor(@InjectSentry() private readonly client: SentryService) {
    client.log('AppSevice Loaded','test', true); // creates log asBreadcrumb //
    client.instance().addBreadcrumb({level: 'debug' , message: 'How to use native breadcrumb', data: { context: 'WhatEver'}})
    client.debug('AppService Debug', 'context');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
```

## Interceptors

BREAKING CHANGES: The SentryInterceptor can be used in projects that don't require GraphQL. If you will be needed GraphQL support, use the GraphqlInterceptor.  Using the GraphqlInterceptor will create a dependancy for the @nestjs/graphql package.

```bash
npm install --save @nestjs/graphql
```

Using graphql interceptor globally
```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphqlInterceptor } from '@ntegral/nestjs-sentry';

@Module({
  ....
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
})
export class AppModule {}
```

Using the sentry interceptor globally
```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from '@ntegral/nestjs-sentry';

@Module({
  ....
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new SentryInterceptor({
        filters: [{
          type: HttpException,
          filter: (exception: HttpException) => 500 > exception.getStatus() // Only report 500 errors
        }]
      }),
    }
  ],
})
export class AppModule {}
```

## Flushing sentry
Sentry does not flush all the errors by itself, it does it in background so that it doesn't block the main thread. If 
you kill the nestjs app forcefully some exceptions have to be flushed and logged successfully.

If you want to force that behaviour use the close flag in your options. That is handy if using nestjs as a console
runner. Keep in mind that you need to have ```app.enableShutdownHooks();``` enabled in order 
for closing (flushing) to work.

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@ntegral/nestjs-sentry';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'sentry_io_dsn',
      debug: true | false,
      environment: 'dev' | 'production' | 'some_environment',
      release: 'some_release', | null, // must create a release in sentry.io dashboard
      logLevels: ['debug'] //based on sentry.io loglevel //
      close: {
        enabled: true,
        // Time in milliseconds to forcefully quit the application  
        timeout?: number,  
      }
    }),
  ],
})
export class AppModule {}
```


## Contributing

I would greatly appreciate any contributions to make this project better. Please
make sure to follow the below guidelines before getting your hands dirty.

1. Fork the repository
2. Create your branch (`git checkout -b my-branch`)
3. Commit any changes to your branch
4. Push your changes to your remote branch
5. Open a pull request

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [@sentry/node](https://github.com/getsentry/sentry-javascript)

Copyright &copy; 2019 Ntegral Inc.
