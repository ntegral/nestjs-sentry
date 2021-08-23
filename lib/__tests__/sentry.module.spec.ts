import { Test } from '@nestjs/testing';

import { SentryModule  } from '../sentry.module';
import { SentryModuleOptions, SentryOptionsFactory } from '../sentry.interfaces';
import { LogLevel } from '@sentry/types';
import { SentryService } from '../sentry.service';
import { SENTRY_TOKEN } from '../sentry.constants';
import { ConsoleLogger } from '@nestjs/common';

class CustomLogger extends ConsoleLogger {}

describe('SentryModule', () => {
    let logger = new CustomLogger('SentryModuleSpec');

    let config: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
    }

    let configWithCustomLogger: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
        logger,
    }

    let configWithNoLogger: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
        logger: null,
    }

    class TestService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return config;
        }
    }

    describe('forRoot', () => {
        it('should provide the sentry client', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot(config)],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            expect(sentry.opts?.logger).toBeInstanceOf(ConsoleLogger);
        });

        it('should provide the sentry client with custom logger', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot(configWithCustomLogger)],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            expect(sentry.opts?.logger).toBeInstanceOf(CustomLogger);
        });

        it('should provide the sentry client with no logger', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot(configWithNoLogger)],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            expect(sentry.opts?.logger).toBeNull();
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
                expect(sentry.opts?.logger).toBeInstanceOf(ConsoleLogger);
            });

            it('should provide sentry client with custom logger', async () => {
                const mod = await Test.createTestingModule({
                    imports: [
                        SentryModule.forRootAsync({
                            useFactory: () => (configWithCustomLogger),
                        }),
                    ]
                }).compile();

                const sentry = mod.get<SentryService>(SENTRY_TOKEN);
                expect(sentry).toBeDefined();
                expect(sentry).toBeInstanceOf(SentryService);
                expect(sentry.opts?.logger).toBeInstanceOf(CustomLogger);
            });

            it('should provide sentry client with no logger', async () => {
                const mod = await Test.createTestingModule({
                    imports: [
                        SentryModule.forRootAsync({
                            useFactory: () => (configWithNoLogger),
                        }),
                    ]
                }).compile();

                const sentry = mod.get<SentryService>(SENTRY_TOKEN);
                expect(sentry).toBeDefined();
                expect(sentry).toBeInstanceOf(SentryService);
                expect(sentry.opts?.logger).toBeNull();
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
})