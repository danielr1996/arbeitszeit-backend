import {Test} from '@nestjs/testing';
import {SourceModule} from "./source.module";
import {ServiceType} from "../user.module/service.model";
import {PostgresModule} from "../postgres.module/postgres.module";
import {ClockifyService} from "./clockify.service";
import {TestDataService} from "./testdata.service";

describe('SourceModule', () => {
    it('should provide instances of GenericTimesheetService with an injection token', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [SourceModule, PostgresModule.forRoot({configFactory: () => ({}), inject: []})]
        }).compile();
        const clockifyService = moduleRef.get(ServiceType.CLOCKIFY_SERVICE)
        const testDataService = moduleRef.get(ServiceType.TESTDATA_SERVICE)
        expect(clockifyService).toBeInstanceOf(ClockifyService)
        expect(testDataService).toBeInstanceOf(TestDataService)
    });
});
