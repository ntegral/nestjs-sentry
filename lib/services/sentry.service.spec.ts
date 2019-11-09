import { SentryModuleOptions, SentryOptionsFactory } from "../interfaces";
import { LogLevel } from "@sentry/types";
import { Test } from "@nestjs/testing";
import { SentryModule } from "../sentry.module";
import { SentryService } from ".";
import { SENTRY_TOKEN } from "../common/sentry.constants";

describe('SentryService', () => {
    let config: SentryModuleOptions = {
        dsn: 'https://sentry.io.dsn@sentry.io/#value',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
    }

    class TestService implements SentryOptionsFactory {
        createSentryModuleOptions(): SentryModuleOptions {
            return config;
        }
    }

    describe('sentry.log', () => {
        it('should provide the sentry client and call log', async() => {
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
            console.log('sentry', sentry);
            sentry.log('sentry:log');
            expect(sentry.log).toBeInstanceOf(Function);
        });
    });

    describe('sentry.error', () => {
        it('should provide the sentry client and call error', async() => {
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
            // console.log('sentry', sentry);
            sentry.error('sentry:error');
            expect(sentry.error).toBeInstanceOf(Function);
        });
    });

    describe('sentry.verbose', () => {
        it('should provide the sentry client and call verbose', async() => {
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
            // console.log('sentry', sentry);
            sentry.verbose('sentry:verbose','context:verbose');
            expect(sentry.verbose).toBeInstanceOf(Function);
        });
    });

    describe('sentry.debug', () => {
        it('should provide the sentry client and call debug', async() => {
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
            // console.log('sentry', sentry);
            sentry.debug('sentry:debug','context:debug');
            expect(sentry.debug).toBeInstanceOf(Function);
        });
    });

    describe('sentry.warn', () => {
        it('should provide the sentry client and call warn', async() => {
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
            // console.log('sentry', sentry);
            sentry.debug('sentry:warn','context:warn');
            expect(sentry.warn).toBeInstanceOf(Function);
        });
    });
    
});