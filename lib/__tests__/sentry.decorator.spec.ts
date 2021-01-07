import { Test, TestingModule } from '@nestjs/testing';
import { LogLevel } from "@sentry/types";
import { SentryModuleOptions } from '../sentry.interfaces';
import { Injectable } from '@nestjs/common';
import { InjectSentry } from '../sentry.decorator';
import { SentryModule } from '../sentry.module';
import { SentryService } from '../sentry.service';

describe('InjectS3', () => {

    let config: SentryModuleOptions = {
        dsn: 'https://45740e3ae4864e77a01ad61a47ea3b7e@o115888.ingest.sentry.io/25956308132020',
        debug: true,
        environment: 'development',
        logLevel: LogLevel.Debug,
    }
    let module: TestingModule;

    @Injectable()
    class InjectableService {
        public constructor(@InjectSentry() public readonly client: SentryService) {}
    }

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [SentryModule.forRoot(config)],
            providers: [InjectableService],
        }).compile();
    });

    describe('when decorating a class constructor parameter', () => {
        it('should inject the sentry client', () => {
            const testService = module.get(InjectableService);
            expect(testService).toHaveProperty('client');
            expect(testService.client).toBeInstanceOf(SentryService);
        });
    });
})