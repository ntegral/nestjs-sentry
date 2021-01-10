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

- [About](#about)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

`@ntegral/nestjs-sentry` implements a module, `SentryModule`, which when imported into
your nestjs project provides a Sentry.io client to any class that injects it. This
lets Sentry.io be worked into your dependency injection workflow without having to
do any extra work outside of the initial setup.

## Installation

```bash
npm install --save @ntegral/nestjs-sentry
```

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
      release: 'some_release' | null, // must create a release in sentry.io dashboard
      logLevel: LogLevel.Debug //based on sentry.io loglevel //
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
        release: 'some_release' | null, // must create a release in sentry.io dashboard
        logLevel: LogLevel.Debug //based on sentry.io loglevel //
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
