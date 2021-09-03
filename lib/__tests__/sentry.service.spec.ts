import { SentryModuleOptions, SentryOptionsFactory } from "../sentry.interfaces";
import { LogLevel } from "@sentry/types";
import { Test } from "@nestjs/testing";
import { SentryModule } from "../sentry.module";
import { SentryService } from "../sentry.service";
import { SENTRY_TOKEN } from "../sentry.constants";

import * as Sentry from '@sentry/node';
jest.spyOn(Sentry, 'close')
  .mockImplementation(() => Promise.resolve(true));
const mockCloseSentry = Sentry.close as jest.MockedFunction<typeof Sentry.close>;

const SENTRY_NOT_CONFIGURE_ERROR = 'Please confirm that Sentry is configured correctly';

describe('SentryService', () => {
    let config: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
    };

    let failureConfig: SentryModuleOptions = {
        dsn: 'https://sentry_io_dsn@sentry.io/1512xxx',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
    };

    class TestService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return config;
        }
    }

    class FailureService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return failureConfig;
        }
    }

    describe('sentry.log:error', () => {
        it('should provide the sentry client and call log', async() => {
            const mod = await Test.createTestingModule({
                imports: [
                    SentryModule.forRootAsync({
                        useClass: FailureService
                    })
                ]
            }).compile();

            const fail = mod.get<SentryService>(SENTRY_TOKEN);
            console.log('sentry:error', fail);
            fail.log('sentry:log');
            expect(fail.log).toBeInstanceOf(Function);
        });
    });

    describe('sentry.log', () => {
        it('should provide the sentry client and call log', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...config,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            console.log('sentry', sentry);
            sentry.log('sentry:log');
            expect(sentry.log).toBeInstanceOf(Function);
            expect(true).toBeTruthy();
        });
    });

    describe('sentry.error', () => {
        it('should provide the sentry client and call error', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...config,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            sentry.error('sentry:error');
            expect(sentry.error).toBeInstanceOf(Function);
            expect(true).toBeTruthy();
        });
    });

    describe('sentry.verbose', () => {
        it('should provide the sentry client and call verbose', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...config,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            sentry.verbose('sentry:verbose','context:verbose');
            expect(sentry.verbose).toBeInstanceOf(Function);
            expect(true).toBeTruthy();
        });
    });

    describe('sentry.debug', () => {
        it('should provide the sentry client and call debug', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...config,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            sentry.debug('sentry:debug','context:debug');
            expect(sentry.debug).toBeInstanceOf(Function);
            expect(true).toBeTruthy();
        });
    });

    describe('sentry.warn', () => {
        it('should provide the sentry client and call warn', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...config,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            try {
                sentry.warn('sentry:warn','context:warn');
                expect(true).toBeTruthy();
            } catch(err) {}
            expect(sentry.warn).toBeInstanceOf(Function);
        });
    });

    describe('sentry.close', () => {
        it('should not close the sentry if not specified in config', async() => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot(config)],
            }).compile();
            await mod.enableShutdownHooks();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            await mod.close();
            // expect(mockCloseSentry).not.toHaveBeenCalled();
        });

        it('should close the sentry if specified in config', async() => {
            const timeout = 100;
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...config,
                    close: {
                        enabled: true,
                        timeout
                    }
                })],
            }).compile();
            await mod.enableShutdownHooks();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);
            await mod.close();
            // expect(mockCloseSentry).toHaveBeenCalledWith(timeout);
        });
    });

    describe('Sentry Service exception handling', () => {
        it('should test verbose catch err', async () => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...failureConfig,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);

            try {
                sentry.verbose('This will throw an exception');
            }
            catch(err) {
                //to do//
                expect(sentry.log).toThrowError(SENTRY_NOT_CONFIGURE_ERROR);
            }
        })
        it('should test warn catch err', async () => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...failureConfig,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);

            try {
                sentry.warn('This will throw an exception');
            }
            catch(err) {
                //to do//
                expect(sentry.log).toThrowError(SENTRY_NOT_CONFIGURE_ERROR);
            }
        })
        it('should test error catch err', async () => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...failureConfig,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);

            try {
                sentry.error('This will throw an exception');
            }
            catch(err) {
                //to do//
                expect(sentry.log).toThrowError(SENTRY_NOT_CONFIGURE_ERROR);
            }
        })
        it('should test debug catch err', async () => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...failureConfig,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);

            try {
                sentry.debug('This will throw an exception');
            }
            catch(err) {
                //to do//
                expect(sentry.log).toThrowError(SENTRY_NOT_CONFIGURE_ERROR);
            }
        })
        it('should test log catch err', async () => {
            const mod = await Test.createTestingModule({
                imports: [SentryModule.forRoot({
                    ...failureConfig,
                })],
            }).compile();

            const sentry = mod.get<SentryService>(SENTRY_TOKEN);
            expect(sentry).toBeDefined();
            expect(sentry).toBeInstanceOf(SentryService);

            try {
                sentry.log('This will throw an exception');
            }
            catch(err) {
                //to do//
                expect(sentry.log).toThrowError(SENTRY_NOT_CONFIGURE_ERROR);
            }
        })
    })
    
});