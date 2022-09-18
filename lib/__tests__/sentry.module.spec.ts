import { Test } from '@nestjs/testing';

import { SentryModule  } from '../sentry.module';
import { SentryModuleOptions, SentryOptionsFactory } from '../sentry.interfaces';
import { SentryService } from '../sentry.service';
import { SENTRY_TOKEN } from '../sentry.constants';
import { Module } from '@nestjs/common';

describe('SentryModule', () => {
    let config: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevels: ['debug'],
    }

    class TestService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return config;
        }
    }

    @Module({
        exports: [TestService],
        providers: [TestService]
    })
    class TestModule {}

    describe('forRoot', () => {
        it('should provide the sentry client', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot(config)],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            console.log('sentry', sentry);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
        });
    });

    describe('forRootAsync', () => {
        describe('when the `useFactory` option is used', () => {
            it('should provide sentry client', async () => {
                const mod = await Test.createTestingModule({
                    imports: [
                        SentryModule.forRootAsync({
                            useFactory: () => (config),
                        }),
                    ]
                }).compile();

                const sentry = mod.get<SentryService>(SENTRY_TOKEN);
                expect(sentry).toBeDefined();
                expect(sentry).toBeInstanceOf(SentryService);
            });
        })
    });

    describe('when the `useClass` option is used', () => {
        it('should provide the sentry client', async () => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: TestService
                    })
                ]
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
        });
    });

    describe('when the `useExisting` option is used', () => {
        it('should provide the stripe client', async () => {
          const mod = await Test.createTestingModule({
            imports: [
              SentryModule.forRootAsync({
                imports: [TestModule],
                useExisting: TestService,
              }),
            ],
          }).compile();
  
          const sentry = mod.get<SentryService>(SENTRY_TOKEN);
          expect(sentry).toBeDefined();
          expect(sentry).toBeInstanceOf(SentryService);
        });
      });
})